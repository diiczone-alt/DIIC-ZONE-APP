'use client';

import { use, useState, useEffect } from 'react';
import { 
    ChevronLeft, FolderPlus, UploadCloud, FileVideo, 
    Camera, Mic, Film, Plus, Eye, X, HelpCircle, AlertCircle, RefreshCw, Folder
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function UploadPage({ params }) {
    const { shootId } = use(params);
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    
    // Storage Destination State
    const [storageDest, setStorageDest] = useState('supabase'); // 'supabase' | 'drive'
    const [googleToken, setGoogleToken] = useState(null);
    const [googleEmail, setGoogleEmail] = useState('');
    const [driveFolderId, setDriveFolderId] = useState(null);

    // Folders/Categories state
    const [folders, setFolders] = useState([
        { id: 'SCN-01', label: 'Escena 01', type: 'scene', icon: Clapperboard, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
        { id: 'SCN-02', label: 'Escena 02', type: 'scene', icon: Clapperboard, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
        { id: 'DRONE', label: 'Dron / Aéreas', type: 'drone', icon: Camera, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
        { id: 'AUDIO', label: 'Audio Externo', type: 'audio', icon: Mic, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
        { id: 'BLOOPERS', label: 'Bloopers', type: 'bloopers', icon: Film, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    ]);

    const [files, setFiles] = useState({}); // { folderId: [files] }
    
    // Modal states
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderType, setNewFolderType] = useState('scene'); // 'scene' | 'drone' | 'audio' | 'bloopers' | 'other'

    // Preview state
    const [previewFile, setPreviewFile] = useState(null); // { name, url, type }

    // Load Google token and existing files
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('diic_google_token') || localStorage.getItem('sb-pigojfotwzgahcmtvyko-oauth-token');
            if (token) {
                setGoogleToken(token);
                // Try to get cached email
                setGoogleEmail(localStorage.getItem('diic_google_email') || 'Google Drive Conectado');
            }
        }

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
                            progress: 100,
                            isExisting: true
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

    const handleConnectGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.href, // Return to this exact page after OAuth
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    scopes: 'https://www.googleapis.com/auth/drive.file'
                }
            });
            if (error) throw error;
        } catch (err) {
            console.error('OAuth error:', err);
            toast.error('Error al conectar con Google: ' + err.message);
        }
    };

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
            progress: 0,
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

    const updateFileProgress = (folderId, fileId, progress) => {
        setFiles(prev => ({
            ...prev,
            [folderId]: (prev[folderId] || []).map(f => f.id === fileId ? { ...f, progress } : f)
        }));
    };

    const updateFileTag = async (folderId, fileId, tag) => {
        const file = (files[folderId] || []).find(f => f.id === fileId);
        
        setFiles(prev => ({
            ...prev,
            [folderId]: prev[folderId].map(f => f.id === fileId ? { ...f, tag } : f)
        }));

        if (file && file.isExisting) {
            try {
                const { error } = await supabase
                    .from('shoot_materials')
                    .update({ tag })
                    .eq('id', fileId);
                if (error) throw error;
                toast.success('Etiqueta sincronizada en la base de datos');
            } catch (err) {
                console.error('Error updating tag in DB:', err);
                toast.error('Error al guardar etiqueta');
            }
        }
    };

    const handleCreateFolder = (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        const nextId = folders.length + 1;
        const folderId = `USER-${Date.now()}`;
        
        let icon = Folder;
        let color = 'text-gray-400';
        let bg = 'bg-gray-500/10';
        let border = 'border-gray-500/30';

        if (newFolderType === 'scene') {
            icon = Clapperboard;
            color = 'text-cyan-400';
            bg = 'bg-cyan-500/10';
            border = 'border-cyan-500/30';
        } else if (newFolderType === 'drone') {
            icon = Camera;
            color = 'text-amber-400';
            bg = 'bg-amber-500/10';
            border = 'border-amber-500/30';
        } else if (newFolderType === 'audio') {
            icon = Mic;
            color = 'text-rose-400';
            bg = 'bg-rose-500/10';
            border = 'border-rose-500/30';
        } else if (newFolderType === 'bloopers') {
            icon = Film;
            color = 'text-purple-400';
            bg = 'bg-purple-500/10';
            border = 'border-purple-500/30';
        }

        setFolders([...folders, {
            id: folderId,
            label: newFolderName.trim(),
            type: newFolderType,
            icon,
            color,
            bg,
            border
        }]);

        setNewFolderName('');
        setShowFolderModal(false);
        toast.success(`Carpeta "${newFolderName}" creada correctamente.`);
    };

    // Google Drive Upload API Call
    const uploadFileToGoogleDrive = async (fileObject, folderIdOnDrive) => {
        const metadata = {
            name: fileObject.name,
            mimeType: fileObject.type || 'video/mp4'
        };
        if (folderIdOnDrive) {
            metadata.parents = [folderIdOnDrive];
        }

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', fileObject);

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${googleToken}`
            },
            body: form
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Error al subir a Google Drive');
        }

        const data = await response.json();
        // Return file link and ID
        return {
            id: data.id,
            url: `https://drive.google.com/file/d/${data.id}/view?usp=drivesdk`
        };
    };

    // Create a Folder on Google Drive
    const createGoogleDriveFolder = async (folderName, parentFolderId = null) => {
        const metadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder'
        };
        if (parentFolderId) {
            metadata.parents = [parentFolderId];
        }

        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${googleToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metadata)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Error al crear carpeta en Google Drive');
        }

        const data = await response.json();
        return data.id;
    };

    const handleConfirmUpload = async () => {
        try {
            const newFilesToUpload = [];
            Object.entries(files).forEach(([folderId, fileList]) => {
                fileList.forEach(file => {
                    if (!file.isExisting && file.fileObject) {
                        newFilesToUpload.push({ folderId, file });
                    }
                });
            });

            if (newFilesToUpload.length === 0) {
                toast.info('No hay archivos nuevos para subir.');
                router.push(`/workstation/filmmaker`);
                return;
            }

            if (storageDest === 'drive' && !googleToken) {
                toast.error('Por favor, conecta tu cuenta de Google Drive antes de subir.');
                return;
            }

            setUploading(true);
            const total = newFilesToUpload.length;
            let current = 0;
            
            toast.loading(`Iniciando subida de ${total} archivo(s)...`, { id: 'upload-toast' });

            // 1. Google Drive Directory Provisioning
            let driveShootRootId = driveFolderId;
            if (storageDest === 'drive' && !driveShootRootId) {
                toast.loading('Creando carpeta del rodaje en Google Drive...', { id: 'upload-toast' });
                // Get or Create "DIIC ZONE Rodajes" Parent Folder
                let rootId = localStorage.getItem('diic_drive_root_id');
                if (!rootId) {
                    rootId = await createGoogleDriveFolder('DIIC ZONE Rodajes');
                    localStorage.setItem('diic_drive_root_id', rootId);
                }
                // Create specific folder for this shoot
                driveShootRootId = await createGoogleDriveFolder(`Rodaje_${shootId}`, rootId);
                setDriveFolderId(driveShootRootId);
            }

            // Map of drive subfolder IDs created in this session
            const driveSubfolderIds = {};

            for (const item of newFilesToUpload) {
                const { folderId, file } = item;
                current++;
                toast.loading(`Procesando archivo ${current} de ${total}: ${file.name}...`, { id: 'upload-toast' });

                let publicUrl = '';

                if (storageDest === 'supabase') {
                    // --- UPLOAD TO SUPABASE STORAGE ---
                    const fileExt = file.name.split('.').pop();
                    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `${shootId}/${folderId}/${uniqueName}`;

                    const { error: uploadErr } = await supabase.storage
                        .from('materials')
                        .upload(filePath, file.fileObject, {
                            cacheControl: '3600',
                            upsert: true,
                            onUploadProgress: (progress) => {
                                const percent = Math.round((progress.loaded / progress.total) * 100);
                                updateFileProgress(folderId, file.id, percent);
                            }
                        });

                    if (uploadErr) throw new Error(`Error en Supabase: ${uploadErr.message}`);

                    const { data: { publicUrl: pUrl } } = supabase.storage
                        .from('materials')
                        .getPublicUrl(filePath);
                    
                    publicUrl = pUrl;
                    updateFileProgress(folderId, file.id, 100);
                } else {
                    // --- UPLOAD TO GOOGLE DRIVE ---
                    // Create subfolder for this scene/category on Google Drive if it doesn't exist
                    let driveSubfolderId = driveSubfolderIds[folderId];
                    if (!driveSubfolderId) {
                        const folderName = folders.find(f => f.id === folderId)?.label || folderId;
                        driveSubfolderId = await createGoogleDriveFolder(folderName, driveShootRootId);
                        driveSubfolderIds[folderId] = driveSubfolderId;
                    }

                    updateFileProgress(folderId, file.id, 50); // mock middle progress for simple fetch
                    const gFile = await uploadFileToGoogleDrive(file.fileObject, driveSubfolderId);
                    publicUrl = gFile.url;
                    updateFileProgress(folderId, file.id, 100);
                }

                // 2. Save reference in Supabase database
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

                if (dbErr) throw new Error(`Error al guardar en DB: ${dbErr.message}`);
                
                // Mark file as saved locally
                setFiles(prev => ({
                    ...prev,
                    [folderId]: (prev[folderId] || []).map(f => f.id === file.id ? { ...f, isExisting: true, uploadedUrl: publicUrl } : f)
                }));
            }

            toast.success(`¡Sincronización exitosa! Se subieron ${total} archivos.`, { id: 'upload-toast' });
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

    const handleFilePreview = (file) => {
        let url = '';
        if (file.fileObject) {
            url = URL.createObjectURL(file.fileObject);
        } else {
            url = file.uploadedUrl;
        }

        const ext = file.name.split('.').pop().toLowerCase();
        let fileType = 'other';
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
            fileType = 'video';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
            fileType = 'image';
        }

        setPreviewFile({
            name: file.name,
            url,
            type: fileType
        });
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
                        onClick={() => setShowFolderModal(true)}
                        disabled={uploading}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold rounded-xl transition-colors border border-white/5 flex items-center gap-2 disabled:opacity-50"
                    >
                        <FolderPlus className="w-4 h-4 text-cyan-400" />
                        Nueva Carpeta
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

            {/* Storage configuration selector */}
            <div className="bg-[#0A0A15] border-b border-white/5 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Destino de almacenamiento:</span>
                    <div className="inline-flex bg-black/40 rounded-xl p-1 border border-white/5">
                        <button
                            onClick={() => setStorageDest('supabase')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight transition-all ${storageDest === 'supabase' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
                        >
                            Nube DIIC ZONE (Supabase)
                        </button>
                        <button
                            onClick={() => setStorageDest('drive')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight transition-all ${storageDest === 'drive' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
                        >
                            Google Drive Personal
                        </button>
                    </div>
                </div>

                {storageDest === 'drive' && (
                    <div className="flex items-center gap-3">
                        {googleToken ? (
                            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {googleEmail}
                                <button 
                                    onClick={handleConnectGoogle}
                                    className="ml-2 text-[10px] text-gray-400 hover:text-white underline font-black"
                                >
                                    Cambiar
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnectGoogle}
                                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Conectar Google Drive
                            </button>
                        )}
                    </div>
                )}
                {storageDest === 'supabase' && (
                    <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                        Almacenamiento directo de alta velocidad integrado en DIIC ZONE.
                    </div>
                )}
            </div>

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
                                <span className={`font-bold ${folder.color} truncate`}>{folder.label}</span>
                                <span className="ml-auto text-xs bg-black/30 px-2 py-1 rounded text-gray-400 shrink-0">
                                    {(files[folder.id] || []).length}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById(`file-input-${folder.id}`).click();
                                    }}
                                    disabled={uploading}
                                    className="p-1 bg-white/5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors shrink-0"
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
                                        className="flex-1 flex flex-col items-center justify-center text-center opacity-30 cursor-pointer hover:opacity-60 transition-opacity"
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
                                            className="bg-[#0E0E18] rounded-xl p-3 border border-white/5 group/file hover:border-white/10 relative"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div 
                                                    onClick={() => handleFilePreview(file)}
                                                    className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-500 shrink-0 cursor-pointer hover:bg-cyan-500/20 hover:text-cyan-400 transition-all group"
                                                    title="Previsualizar archivo"
                                                >
                                                    <Eye className="w-4 h-4 group-hover:scale-110" />
                                                </div>
                                                <div className="overflow-hidden flex-1">
                                                    <p className="text-xs font-bold text-gray-300 truncate" title={file.name}>{file.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-[10px] text-gray-600 font-mono">{file.size}</p>
                                                        {file.isExisting ? (
                                                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded uppercase tracking-tighter">Sincronizado</span>
                                                        ) : file.progress > 0 && file.progress < 100 ? (
                                                            <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded uppercase tracking-tighter">Subiendo ({file.progress}%)</span>
                                                        ) : file.progress === 100 ? (
                                                            <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded uppercase tracking-tighter animate-pulse">Guardando...</span>
                                                        ) : (
                                                            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded uppercase tracking-tighter">Pendiente</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            {!file.isExisting && file.progress > 0 && file.progress < 100 && (
                                                <div className="w-full bg-black/40 rounded-full h-1.5 mb-2 overflow-hidden border border-white/5">
                                                    <div 
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300" 
                                                        style={{ width: `${file.progress}%` }} 
                                                    />
                                                </div>
                                            )}

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

            {/* Folder Creation Modal */}
            <AnimatePresence>
                {showFolderModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowFolderModal(false)} 
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative w-full max-w-md bg-[#0E0E18] border border-white/10 rounded-[2rem] p-8 shadow-2xl z-10 space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Nueva Carpeta de Rodaje</h3>
                                <button onClick={() => setShowFolderModal(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateFolder} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Nombre de la Carpeta</label>
                                    <input 
                                        type="text"
                                        required
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-cyan-500/50 transition-all font-medium"
                                        placeholder="Ej. Escena 03, Entrevistas, etc."
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Tipo de Contenido / Icono</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'scene', label: '🎬 Escena', desc: 'Clips por escena' },
                                            { id: 'drone', label: '🚁 Dron / Aéreas', desc: 'Tomas con dron' },
                                            { id: 'audio', label: '🎙️ Audio Externo', desc: 'Audios, lavalier' },
                                            { id: 'bloopers', label: '🤪 Bloopers', desc: 'Detrás de cámaras' },
                                            { id: 'other', label: '📂 Otros / B-Roll', desc: 'Otros recursos' },
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setNewFolderType(type.id)}
                                                className={`p-3 rounded-xl border text-left transition-all ${newFolderType === type.id ? 'bg-cyan-600/10 border-cyan-500 text-white' : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10'}`}
                                            >
                                                <p className="text-xs font-black uppercase tracking-tight">{type.label}</p>
                                                <p className="text-[9px] text-gray-500 font-medium mt-0.5">{type.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Crear Carpeta
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Media Preview Modal */}
            <AnimatePresence>
                {previewFile && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setPreviewFile(null)} 
                            className="absolute inset-0 bg-black/95 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.95, opacity: 0 }} 
                            className="relative w-full max-w-4xl bg-[#080810] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl z-10 flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center mb-4 shrink-0 px-2">
                                <h3 className="text-sm font-black text-gray-300 truncate max-w-lg select-all font-mono">{previewFile.name}</h3>
                                <button onClick={() => setPreviewFile(null)} className="p-1.5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden min-h-[300px]">
                                {previewFile.type === 'video' ? (
                                    <video 
                                        src={previewFile.url} 
                                        controls 
                                        autoPlay
                                        className="max-w-full max-h-[70vh] rounded-xl outline-none" 
                                    />
                                ) : previewFile.type === 'image' ? (
                                    <img 
                                        src={previewFile.url} 
                                        alt={previewFile.name} 
                                        className="max-w-full max-h-[70vh] object-contain rounded-xl" 
                                    />
                                ) : (
                                    <div className="text-center p-8 space-y-3">
                                        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto" />
                                        <p className="text-sm font-bold text-gray-400">Previsualización no disponible</p>
                                        <p className="text-xs text-gray-600">Este tipo de archivo no se puede reproducir directamente en el navegador.</p>
                                        {previewFile.url && (
                                            <a 
                                                href={previewFile.url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="inline-block mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-cyan-400 uppercase tracking-widest transition-colors"
                                            >
                                                Descargar / Ver original
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
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
