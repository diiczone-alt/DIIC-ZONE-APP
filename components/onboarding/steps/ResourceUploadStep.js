'use client';

import { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Film, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResourceUploadStep({ onNext, updateData }) {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...droppedFiles]);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        setIsUploading(true);
        // Simulación de carga
        await new Promise(resolve => setTimeout(resolve, 2000));

        updateData({ resources: files.map(f => f.name) });
        toast.success(`Se subieron ${files.length} archivos a Drive`);
        onNext();
    };

    const getIcon = (type) => {
        if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-purple-400" />;
        if (type.includes('video')) return <Film className="w-5 h-5 text-red-400" />;
        return <FileText className="w-5 h-5 text-blue-400" />;
    };

    return (
        <div className="space-y-6 text-center h-full flex flex-col">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Central de Recursos</h2>
                <p className="text-gray-400">Sube tus activos iniciales (Fotos, Videos, PDFs).</p>
            </div>

            <div
                className="flex-1 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all flex flex-col items-center justify-center p-8 relative overflow-hidden group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {files.length === 0 ? (
                    <div className="text-center space-y-4 pointer-events-none">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-gray-400 group-hover:text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">Arrastra y suelta aquí</p>
                            <p className="text-sm text-gray-500">o haz clic para explorar</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 p-2 content-start">
                        {files.map((file, i) => (
                            <div key={i} className="bg-[#0A0A12] p-3 rounded-xl border border-white/10 flex items-center gap-3 relative group/item text-left">
                                {getIcon(file.type)}
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-white truncate">{file.name}</p>
                                    <p className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="absolute top-1 right-1 p-1 bg-red-500/20 text-red-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Input invisible cobertura total */}
                {files.length === 0 && (
                    <input
                        type="file"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileSelect}
                    />
                )}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => onNext()} // Permitir omitir
                    className="flex-1 py-4 bg-transparent text-gray-400 font-bold hover:text-white transition-colors"
                >
                    Omitir por ahora
                </button>
                <button
                    onClick={handleUpload}
                    disabled={isUploading || files.length === 0}
                    className="flex-[2] py-4 bg-white text-black rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Subiendo a Drive...
                        </>
                    ) : (
                        `Subir ${files.length} Archivos`
                    )}
                </button>
            </div>
        </div>
    );
}
