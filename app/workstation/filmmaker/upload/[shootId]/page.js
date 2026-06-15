'use client';

import { use, useState, useEffect } from 'react';
import { 
    ChevronLeft, FolderPlus, UploadCloud, FileVideo, 
    Camera, Mic, Film, Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function UploadPage({ params }) {
    const { shootId } = use(params);
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [folders, setFolders] = useState([
        { id: 'SCN-01', label: 'Escena 01', icon: Clapperboard, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
        { id: 'SCN-02', label: 'Escena 02', icon: Clapperboard, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
        { id: 'DRONE', label: 'Dron / Aéreas', icon: Camera, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
        { id: 'AUDIO', label: 'Audio Externo', icon: Mic, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
        { id: 'BLOOPERS', label: 'Bloopers', icon: Film, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    ]);

    const [files, setFiles] = useState({}); // { folderId: [files] }

    // Fetch existing files for this shoot
    useEffect(() => {
        const fetchExistingFiles = async () => {
            try {
                const { data, error } = await supabase
                    .from('shoot_materials')
                    .select('*')
                    .eq('shoot_id', shootId);
                if (error) throw error;
                if (data && data.length > 0) {
                    const filesMap = {};
                    data.forEach(item => {
                        if (!filesMap[item.folder_id]) {
                            filesMap[item.folder_id] = [];
                        }
                        filesMap[item.folder_id].push({
                            id: item.id,
                            name: item.name,
                            size: item.size,
                            tag: item.tag || 'principal',
                            uploadedUrl: item.url,
                            isExisting: true // already in DB
                        });
                    });
                    setFiles(filesMap);
                }
            } catch (err) {
                console.error('Error fetching existing shoot materials:', err);
            }
        };
        if (shootId) {
            fetchExistingFiles();
        }
    }, [shootId]);

    const handleFilesAdded = (fileList, folderId) => {
        if (!fileList || fileList.length === 0) return;
        
        const newFiles = Array.from(fileList).map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substring(5)}`,
            name: file.name,
            size: file.size > 1024 * 1024 
                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                : `${(file.size / 1024).toFixed(0)} KB`,
            fileObject: file, // Keep the actual File object for uploading
            tag: 'principal',
            isExisting: false
        }));
        
        setFiles(prev => ({
            ...prev,
            [folderId]: [...(prev[folderId] || []), ...newFiles]
        }));
        
        toast.success(`Añadido(s) ${newFiles.length} archivo(s) a ${folders.find(f => f.id === folderId)?.label || folderId}`);
    };

    const handleDrop = (e, folderId) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesAdded(e.dataTransfer.files, folderId);
        }
    };

    const updateFileTag = async (folderId, fileId, tag) => {
        const file = (files[folderId] || []).find(f => f.id === fileId);
        
        // Update local state first
        setFiles(prev => ({
            ...prev,
            [folderId]: prev[folderId].map(f => f.id === fileId ? { ...f, tag } : f)
        }));

        // If file is already saved in the database, sync the tag update to the DB
        if (file && file.isExisting) {
            try {
                const { error } = await supabase
                    .from('shoot_materials')
                    .update({ tag })
                    .eq('id', fileId);
                if (error) throw error;
                toast.success('Etiqueta actualizada en la nube');
            } catch (err) {
                console.error('Error updating tag in DB:', err);
                toast.error('Error al guardar etiqueta en la nube');
            }
        }
    };

    const addFolder = () => {
        const nextId = folders.length + 1;
        setFolders([...folders, {
            id: `SCN-0${nextId}`,
            label: `Escena 0${nextId}`,
            icon: Clapperboard,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30'
        }]);
    };

    const handleConfirmUpload = async () => {
        try {
            // Check for new files to upload
            const newFilesToUpload = [];
            Object.entries(files).forEach(([folderId, fileList]) => {
                fileList.forEach(file => {
                    if (!file.isExisting && file.fileObject) {
                        newFilesToUpload.push({ folderId, file });
                    }
                });
            });

            if (newFilesToUpload.length === 0) {
                toast.info('No hay archivos nuevos que subir.');
                router.push(`/workstation/filmmaker`);
                return;
            }

            setUploading(true);
            const total = newFilesToUpload.length;
            let current = 0;
            
            toast.loading(`Subiendo archivo 1 de ${total}...`, { id: 'upload-toast' });

            for (const item of newFilesToUpload) {
                const { folderId, file } = item;
                current++;
                toast.loading(`Subiendo archivo ${current} de ${total}: ${file.name}...`, { id: 'upload-toast' });

                // 1. Upload to Supabase Storage Bucket
                const fileExt = file.name.split('.').pop();
                const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${shootId}/${folderId}/${uniqueName}`;

                const { data: uploadData, error: uploadErr } = await supabase.storage
                    .from('materials')
                    .upload(filePath, file.fileObject, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadErr) {
                    console.error('Error uploading file:', file.name, uploadErr);
                    throw new Error(`Error al subir ${file.name}: ${uploadErr.message}`);
                }

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('materials')
                    .getPublicUrl(filePath);

                // 3. Save reference in database shoot_materials table
                const { error: dbErr } = await supabase
                    .from('shoot_materials')
                    .insert({
                        shoot_id: parseInt(shootId),
                        folder_id: folderId,
                        name: file.name,
                        size: file.size,
                        url: publicUrl,
                        tag: file.tag
                    });

                if (dbErr) {
                    console.error('Error saving file record to DB:', file.name, dbErr);
                    throw new Error(`Error al guardar registro de ${file.name} en base de datos: ${dbErr.message}`);
                }
            }

            toast.success(`¡Subida completada con éxito! Se subieron ${total} archivos.`, { id: 'upload-toast' });
            setTimeout(() => {
                router.push(`/workstation/filmmaker`);
            }, 1000);
        } catch (err) {
            console.error('Error in upload process:', err);
            toast.error(err.message || 'Error general durante la subida.', { id: 'upload-toast' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050511] text-white">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight font-black uppercase tracking-tighter italic">Subida de Material</h1>
                        <p className="text-xs text-gray-500">Organiza tus tomas por Escena para el equipo de edición.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addFolder}
                        disabled={uploading}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold rounded-xl transition-colors border border-white/5 flex items-center gap-2 disabled:opacity-50"
                    >
                        <FolderPlus className="w-4 h-4" />
                        Nueva Escena
                    </button>
                    <button
                        onClick={handleConfirmUpload}
                        disabled={uploading}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-4 h-4" />
                                Confirmar Subida
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Drop Zones Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                    {folders.map(folder => (
                        <div
                            key={folder.id}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, folder.id)}
                            className={`
                                rounded-3xl border-2 border-dashed ${folder.border} ${folder.bg}
                                flex flex-col relative overflow-hidden transition-all group hover:bg-opacity-20 min-h-[350px] max-h-[500px]
                            `}
                        >
                            {/* Hidden file input */}
                            <input 
                                type="file" 
                                multiple 
                                onChange={(e) => handleFilesAdded(e.target.files, folder.id)} 
                                id={`file-input-${folder.id}`} 
                                className="hidden" 
                            />

                            {/* Folder Header */}
                            <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-black/20 shrink-0">
                                <folder.icon className={`w-5 h-5 ${folder.color}`} />
                                <span className={`font-bold ${folder.color}`}>{folder.label}</span>
                                <span className="ml-auto text-xs bg-black/30 px-2 py-1 rounded text-gray-400">
                                    {(files[folder.id] || []).length} clips
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById(`file-input-${folder.id}`).click();
                                    }}
                                    disabled={uploading}
                                    className="p-1 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                                    title="Añadir archivos"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Files List / Drop Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar flex flex-col">
                                {(files[folder.id] || []).length === 0 ? (
                                    <div 
                                        onClick={() => document.getElementById(`file-input-${folder.id}`).click()}
                                        className="flex-1 flex flex-col items-center justify-center text-center opacity-40 cursor-pointer hover:opacity-70 transition-opacity"
                                    >
                                        <UploadCloud className={`w-12 h-12 mb-3 ${folder.color}`} />
                                        <p className="text-sm font-medium text-gray-300">Arrastra clips aquí</p>
                                        <p className="text-[10px] text-gray-500 mt-1">o haz clic para explorar</p>
                                    </div>
                                ) : (
                                    (files[folder.id] || []).map(file => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={file.id}
                                            className="bg-[#0E0E18] rounded-xl p-3 border border-white/5 group/file hover:border-white/10"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-500 shrink-0">
                                                    <FileVideo className="w-4 h-4" />
                                                </div>
                                                <div className="overflow-hidden flex-1">
                                                    <p className="text-xs font-bold text-gray-300 truncate" title={file.name}>{file.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-[10px] text-gray-600">{file.size}</p>
                                                        {file.isExisting ? (
                                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded uppercase">Sincronizado</span>
                                                        ) : (
                                                            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded uppercase">Pendiente</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tagging Toggles */}
                                            <div className="grid grid-cols-3 gap-1 bg-black/30 rounded-lg p-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateFileTag(folder.id, file.id, 'principal'); }}
                                                    className={`py-1 rounded text-[9px] font-bold uppercase transition-colors ${file.tag === 'principal' ? 'bg-cyan-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                                    title="Toma Principal"
                                                >
                                                    MAIN
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateFileTag(folder.id, file.id, 'secundaria'); }}
                                                    className={`py-1 rounded text-[9px] font-bold uppercase transition-colors ${file.tag === 'secundaria' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                                    title="Toma Secundaria"
                                                >
                                                    SEC
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateFileTag(folder.id, file.id, 'b-roll'); }}
                                                    className={`py-1 rounded text-[9px] font-bold uppercase transition-colors ${file.tag === 'b-roll' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                                    title="Recurso / B-Roll"
                                                >
                                                    B-ROLL
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Clapperboard(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.2 6 3 11l-.9-2.4c-.5-1.1.2-2.3 1.3-2.8l13.2-6.3c1.1-.5 2.3.2 2.8 1.3L20.2 6Z" />
            <path d="m6.2 5.3 3.1 3.9" />
            <path d="m12.4 3.4 3.1 4" />
            <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        </svg>
    )
}
