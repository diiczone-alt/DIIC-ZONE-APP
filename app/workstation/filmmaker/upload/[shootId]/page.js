'use client';

import { use, useState } from 'react';
// ... (imports)

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

    const handleDrop = (e, folderId) => {
        e.preventDefault();
        // Mock file drop
        const newFile = {
            id: Date.now(),
            name: `C00${Math.floor(Math.random() * 9000)}_Clip.mp4`,
            size: '124 MB',
            tag: 'principal' // Default tag
        };
        setFiles(prev => ({
            ...prev,
            [folderId]: [...(prev[folderId] || []), newFile]
        }));
    };

    const updateFileTag = (folderId, fileId, tag) => {
        setFiles(prev => ({
            ...prev,
            [folderId]: prev[folderId].map(f => f.id === fileId ? { ...f, tag } : f)
        }));
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

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050511]">
            {/* Header */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#050511]/90 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">Subida de Material</h1>
                        <p className="text-xs text-gray-500">Organiza tus tomas por Escena.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addFolder}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-bold rounded-xl transition-colors border border-white/5 flex items-center gap-2"
                    >
                        <FolderPlus className="w-4 h-4" />
                        Nueva Escena
                    </button>
                    <button
                        onClick={() => {
                            setUploading(true);
                            setTimeout(() => router.push(`/workstation/filmmaker/shoot/${shootId}`), 2000);
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sincronizando...
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full pb-20">
                    {folders.map(folder => (
                        <div
                            key={folder.id}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, folder.id)}
                            onClick={(e) => handleDrop(e, folder.id)} // Mock click to upload
                            className={`
                                rounded-3xl border-2 border-dashed ${folder.border} ${folder.bg}
                                flex flex-col relative overflow-hidden transition-all group hover:bg-opacity-20 max-h-[500px]
                            `}
                        >
                            {/* Folder Header */}
                            <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-black/20 shrink-0">
                                <folder.icon className={`w-5 h-5 ${folder.color}`} />
                                <span className={`font-bold ${folder.color}`}>{folder.label}</span>
                                <span className="ml-auto text-xs bg-black/30 px-2 py-1 rounded text-gray-400">
                                    {(files[folder.id] || []).length} clips
                                </span>
                            </div>

                            {/* Files List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {(files[folder.id] || []).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <UploadCloud className={`w-12 h-12 mb-3 ${folder.color}`} />
                                        <p className="text-sm font-medium text-gray-300">Arrastra clips aquí</p>
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
                                                <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-500">
                                                    <FileVideo className="w-4 h-4" />
                                                </div>
                                                <div className="overflow-hidden flex-1">
                                                    <p className="text-xs font-bold text-gray-300 truncate">{file.name}</p>
                                                    <p className="text-[10px] text-gray-600">{file.size}</p>
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
