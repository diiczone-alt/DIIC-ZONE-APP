'use client';

import { useState } from 'react';
import {
    LayoutGrid, Image as ImageIcon, Download, Share2,
    Filter, Search, Plus, MoreVertical, X, CheckCircle,
    Copy, Palette, Layers, Grid, List, Clock, User,
    MessageSquare, Eye, Trash2, Edit3, ArrowUpRight, AlertCircle, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// --- MOCK DATA ---
const ASSETS = [
    { id: 1, title: 'Campaña Black Friday - Hero', type: 'Social Media', format: '1080x1350', size: '2.4 MB', status: 'approved', thumb: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60' },
    { id: 2, title: 'Logo Versión Dark', type: 'Branding', format: 'SVG', size: '156 KB', status: 'approved', thumb: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&auto=format&fit=crop&q=60' },
    { id: 3, title: 'Stories Lanzamiento', type: 'Social Media', format: '1080x1920', size: '5.1 MB', status: 'review', thumb: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60' },
    { id: 4, title: 'Flyer Evento Corporativo', type: 'Print', format: 'A4', size: '12 MB', status: 'draft', thumb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60' },
    { id: 5, title: 'Banner Web Home', type: 'Web', format: '1920x600', size: '1.8 MB', status: 'approved', thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60' },
    { id: 6, title: 'Mockup Merch Camisetas', type: 'Merch', format: 'PSD', size: '45 MB', status: 'review', thumb: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=60' },
];

const REQUESTS = [
    { id: 'REQ-101', title: 'Diseño Carrusel Educativo', client: 'Clínica Dental', priority: 'high', deadline: '2026-02-18', status: 'pending', desc: '5 slides sobre blanqueamiento dental.', assets: 3 },
    { id: 'REQ-102', title: 'Edición Fotos Producto', client: 'EcoStore', priority: 'medium', deadline: '2026-02-20', status: 'in-progress', desc: 'Retoque de 15 fotos de catálogo.', assets: 15 },
    { id: 'REQ-103', title: 'Diseño Newsletter Mensual', client: 'Tech Solutions', priority: 'low', deadline: '2026-02-25', status: 'pending', desc: 'Plantilla mailchimp corporativa.', assets: 1 },
];

export default function DesignerDashboard() {
    const [activeTab, setActiveTab] = useState('gallery');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // --- Dynamic States ---
    const [assets, setAssets] = useState(ASSETS);
    const [requests, setRequests] = useState(REQUESTS);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // --- Upload Form State ---
    const [uploadForm, setUploadForm] = useState({
        title: '',
        category: 'Social Media',
        format: '1080x1350',
        fileSelected: false,
        fileName: '',
        fileSize: '',
        requestId: null
    });
    
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const filteredAssets = assets.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

    // --- Handlers ---
    const handleAcceptTask = (reqId) => {
        setRequests(prev => prev.map(req => 
            req.id === reqId ? { ...req, status: 'in-progress' } : req
        ));
        const req = requests.find(r => r.id === reqId);
        toast.success(`¡Tarea "${req?.title}" aceptada con éxito!`);
        
        // Update selected request in modal if open
        if (selectedRequest && selectedRequest.id === reqId) {
            setSelectedRequest(prev => ({ ...prev, status: 'in-progress' }));
        }
    };

    const handleStartGeneralUpload = () => {
        setUploadForm({
            title: '',
            category: 'Social Media',
            format: '1080x1350',
            fileSelected: false,
            fileName: '',
            fileSize: '',
            requestId: null
        });
        setIsUploading(true);
    };

    const handleStartUploadForRequest = (req) => {
        setUploadForm({
            title: `Entregable: ${req.title}`,
            category: req.title.toLowerCase().includes('logo') ? 'Branding' : req.title.toLowerCase().includes('carrusel') ? 'Social Media' : 'Web',
            format: req.title.toLowerCase().includes('carrusel') ? '1080x1350' : 'PNG',
            fileSelected: true,
            fileName: `${req.title.toLowerCase().replace(/\s+/g, '_')}_final.png`,
            fileSize: '3.2 MB',
            requestId: req.id
        });
        setIsUploading(true);
    };

    const handleFileChangeSimulate = () => {
        setUploadForm(prev => ({
            ...prev,
            fileSelected: true,
            fileName: prev.title ? `${prev.title.toLowerCase().replace(/\s+/g, '_')}.png` : 'diseno_propuesta.png',
            fileSize: '2.8 MB'
        }));
        toast.info('Archivo simulado seleccionado correctamente');
    };

    const handleSaveUpload = (e) => {
        e.preventDefault();
        if (!uploadForm.title.trim()) {
            toast.error('Por favor, ingresa un título para el asset');
            return;
        }
        if (!uploadForm.fileSelected) {
            toast.error('Por favor, selecciona o arrastra un archivo');
            return;
        }

        // Simulate upload progress
        setIsUploadingFile(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    
                    // Finalize upload
                    const categoryThumbs = {
                        'Social Media': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60',
                        'Branding': 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&auto=format&fit=crop&q=60',
                        'Print': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60',
                        'Web': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
                        'Merch': 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=60'
                    };

                    const newAsset = {
                        id: Date.now(),
                        title: uploadForm.title,
                        type: uploadForm.category,
                        format: uploadForm.format || 'PNG',
                        size: uploadForm.fileSize || '2.8 MB',
                        status: 'review', 
                        thumb: categoryThumbs[uploadForm.category] || 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60'
                    };

                    // Add to assets
                    setAssets(prev => [newAsset, ...prev]);

                    // Mark related request as completed
                    if (uploadForm.requestId) {
                        setRequests(prev => prev.map(req => 
                            req.id === uploadForm.requestId ? { ...req, status: 'completed' } : req
                        ));
                        
                        if (selectedRequest && selectedRequest.id === uploadForm.requestId) {
                            setSelectedRequest(prev => ({ ...prev, status: 'completed' }));
                        }
                    }

                    setIsUploadingFile(false);
                    setIsUploading(false);
                    toast.success('¡Entregable subido con éxito y enviado a revisión!');
                    setActiveTab('gallery'); // Redirect to gallery to show new design
                    return 100;
                }
                return prev + 25;
            });
        }, 300);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Main Content Controls */}
            <div className="h-16 flex items-center justify-between px-8 bg-[#050511]/50 backdrop-blur-sm border-b border-white/5 shrink-0">
                <div className="flex bg-[#0E0E18] p-1 rounded-lg border border-white/10">
                    <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'gallery' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <ImageIcon className="w-3.5 h-3.5" /> Galería
                    </button>
                    <button onClick={() => setActiveTab('requests')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${activeTab === 'requests' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Layers className="w-3.5 h-3.5" /> Solicitudes
                        {pendingRequestsCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar asset..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#0E0E18] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-pink-500 w-64 transition-colors"
                        />
                    </div>
                    <button 
                        onClick={handleStartGeneralUpload}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-white/10"
                    >
                        <UploadCloud className="w-3.5 h-3.5" /> Subir Asset
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative p-8">
                <AnimatePresence mode="wait">

                    {/* --- ASSET GALLERY --- */}
                    {activeTab === 'gallery' && (
                        <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <h2 className="text-2xl font-bold text-white">Assets Recientes</h2>
                                <div className="flex items-center gap-2 bg-[#0E0E18] p-1 rounded-lg border border-white/10">
                                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded hover:bg-white/5 transition-colors ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-gray-500'}`}><Grid className="w-4 h-4" /></button>
                                    <button onClick={() => setViewMode('list')} className={`p-2 rounded hover:bg-white/5 transition-colors ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-gray-500'}`}><List className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className={`grid gap-6 overflow-y-auto pb-20 custom-scrollbar flex-1 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
                                {filteredAssets.map(asset => (
                                    viewMode === 'grid' ? (
                                        <motion.div
                                            key={asset.id}
                                            layoutId={`asset-${asset.id}`}
                                            onClick={() => setSelectedAsset(asset)}
                                            className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 bg-[#0E0E18] cursor-pointer hover:border-pink-500/50 transition-all shadow-lg hover:shadow-pink-500/20"
                                        >
                                            <img src={asset.thumb} alt={asset.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-wide">
                                                {asset.type}
                                            </div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                                <h3 className="text-white font-bold text-sm truncate mb-1">{asset.title}</h3>
                                                <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                    <span>{asset.format} • {asset.size}</span>
                                                    <span className={`px-1.5 py-0.5 rounded border capitalize ${
                                                        asset.status === 'approved' ? 'border-green-500 text-green-400 bg-green-500/10' : 
                                                        asset.status === 'review' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' :
                                                        'border-gray-500 text-gray-400 bg-gray-500/10'
                                                    }`}>{asset.status === 'approved' ? 'Aprobado' : asset.status === 'review' ? 'En Revisión' : 'Borrador'}</span>
                                                </div>
                                            </div>

                                            {/* Hover overlay actions */}
                                            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toast.success('Descargando archivo original...'); }}
                                                    className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                                <button className="p-3 bg-black/80 text-white border border-white/20 rounded-full hover:scale-110 transition-transform"><Eye className="w-5 h-5" /></button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div key={asset.id} onClick={() => setSelectedAsset(asset)} className="flex items-center gap-4 p-4 bg-[#0E0E18] border border-white/5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                            <img src={asset.thumb} alt={asset.title} className="w-16 h-16 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold text-sm mb-1">{asset.title}</h3>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span>{asset.type}</span>
                                                    <span>•</span>
                                                    <span>{asset.format}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold capitalize border ${
                                                    asset.status === 'approved' ? 'border-green-500 text-green-400 bg-green-500/10' : 
                                                    asset.status === 'review' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' :
                                                    'border-gray-500 text-gray-400 bg-gray-500/10'
                                                }`}>{asset.status === 'approved' ? 'Aprobado' : asset.status === 'review' ? 'En Revisión' : 'Borrador'}</span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toast.success('Descargando archivo original...'); }}
                                                    className="p-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* --- REQUESTS INBOX --- */}
                    {activeTab === 'requests' && (
                        <motion.div key="requests" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full p-8 max-w-5xl mx-auto overflow-y-auto custom-scrollbar">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 shrink-0">
                                <div className="p-2 bg-pink-600/20 rounded-lg text-pink-400"><Layers className="w-6 h-6" /></div>
                                Solicitudes de Diseño
                            </h2>
                            <div className="grid gap-4">
                                {requests.map(req => {
                                    const isPending = req.status === 'pending';
                                    const isInProgress = req.status === 'in-progress';
                                    const isCompleted = req.status === 'completed';
                                    return (
                                        <div key={req.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-pink-500/30 transition-all group flex gap-6">
                                            <div className={`w-1 h-32 rounded-full shrink-0 ${req.priority === 'high' ? 'bg-red-500' : req.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2 gap-2">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors truncate">{req.title}</h3>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border shrink-0 ${
                                                                isPending ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' : 
                                                                isInProgress ? 'border-sky-500/30 text-sky-400 bg-sky-500/5' : 
                                                                'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                                                            }`}>
                                                                {isPending ? 'Pendiente' : isInProgress ? 'En Progreso' : 'Entregado'}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs font-mono text-gray-500 shrink-0">Deadline: {req.deadline}</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{req.desc}</p>
                                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-6">
                                                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {req.client}</span>
                                                        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {req.assets} Assets Ref</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    {isPending && (
                                                        <button 
                                                            onClick={() => handleAcceptTask(req.id)}
                                                            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-pink-900/40 transition-all flex items-center gap-2"
                                                        >
                                                            <CheckCircle className="w-3 h-3" /> Aceptar Tarea
                                                        </button>
                                                    )}
                                                    {isInProgress && (
                                                        <button 
                                                            onClick={() => handleStartUploadForRequest(req)}
                                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2"
                                                        >
                                                            <UploadCloud className="w-3 h-3" /> Entregar Diseño
                                                        </button>
                                                    )}
                                                    {isCompleted && (
                                                        <div className="px-4 py-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-2">
                                                            <CheckCircle className="w-3 h-3" /> Tarea Entregada
                                                        </div>
                                                    )}
                                                    <button 
                                                        onClick={() => setSelectedRequest(req)}
                                                        className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white text-xs font-bold rounded-lg transition-all"
                                                    >
                                                        Ver Detalles
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* --- REQUEST DETAIL MODAL --- */}
            <AnimatePresence>
                {selectedRequest && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-8"
                        onClick={() => setSelectedRequest(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} 
                            animate={{ scale: 1, y: 0 }} 
                            exit={{ scale: 0.9, y: 20 }} 
                            className="bg-[#0E0E18] border border-white/10 rounded-3xl overflow-hidden max-w-xl w-full flex flex-col shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Accent line based on priority */}
                            <div className={`h-1.5 w-full ${selectedRequest.priority === 'high' ? 'bg-red-500' : selectedRequest.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                            
                            <div className="p-8 space-y-6 flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{selectedRequest.id}</span>
                                        <h2 className="text-xl font-bold text-white mb-2 leading-tight">{selectedRequest.title}</h2>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-pink-600/20 text-pink-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{selectedRequest.client}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize border ${
                                                selectedRequest.priority === 'high' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 
                                                selectedRequest.priority === 'medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 
                                                'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                            }`}>
                                                Prioridad {selectedRequest.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedRequest(null)} className="p-2 bg-white/5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                        <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Descripción de la Tarea</h4>
                                        <p className="text-gray-300 text-xs leading-relaxed">{selectedRequest.desc}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Fecha Límite</div>
                                            <div className="text-white font-mono text-xs flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                                                {selectedRequest.deadline}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Estado actual</div>
                                            <div className="text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    selectedRequest.status === 'pending' ? 'bg-yellow-500 animate-pulse' : 
                                                    selectedRequest.status === 'in-progress' ? 'bg-sky-500 animate-pulse' : 'bg-emerald-500'
                                                }`} />
                                                {selectedRequest.status === 'pending' ? 'Pendiente' : selectedRequest.status === 'in-progress' ? 'En Progreso' : 'Entregado'}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3">Requisitos de Entrega</h4>
                                        <ul className="space-y-2 text-xs text-gray-400">
                                            <li className="flex items-center gap-2">
                                                <input type="checkbox" defaultChecked readOnly className="rounded border-white/10 bg-[#13131f] text-pink-600 focus:ring-0 w-3.5 h-3.5" />
                                                <span>Ajustarse a la paleta corporativa y guías de la marca.</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <input type="checkbox" defaultChecked readOnly className="rounded border-white/10 bg-[#13131f] text-pink-600 focus:ring-0 w-3.5 h-3.5" />
                                                <span>Exportación limpia en la resolución requerida.</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <input type="checkbox" className="rounded border-white/10 bg-[#13131f] text-pink-600 focus:ring-0 w-3.5 h-3.5" />
                                                <span>Incluir todos los assets e imágenes de referencia vinculadas.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-end gap-3 shrink-0">
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedRequest(null)}
                                        className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-white text-xs font-bold rounded-xl transition-all"
                                    >
                                        Cerrar
                                    </button>
                                    {selectedRequest.status === 'pending' && (
                                        <button 
                                            type="button"
                                            onClick={() => handleAcceptTask(selectedRequest.id)}
                                            className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-900/40 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" /> Aceptar Tarea
                                        </button>
                                    )}
                                    {selectedRequest.status === 'in-progress' && (
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setSelectedRequest(null);
                                                handleStartUploadForRequest(selectedRequest);
                                            }}
                                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2"
                                        >
                                            <UploadCloud className="w-3.5 h-3.5" /> Entregar Diseño
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- UPLOAD ASSET MODAL --- */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-8"
                        onClick={() => {
                            if (!isUploadingFile) setIsUploading(false);
                        }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} 
                            animate={{ scale: 1, y: 0 }} 
                            exit={{ scale: 0.9, y: 20 }} 
                            className="bg-[#0E0E18] border border-white/10 rounded-3xl overflow-hidden max-w-lg w-full flex flex-col shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Subir Nuevo Asset</h2>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                                            {uploadForm.requestId ? 'Respuesta a Solicitud de Diseño' : 'Envío a Galería General'}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setIsUploading(false)}
                                        disabled={isUploadingFile}
                                        className="p-2 bg-white/5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {isUploadingFile ? (
                                    <div className="py-12 flex flex-col items-center justify-center space-y-6">
                                        <div className="relative w-24 h-24 flex items-center justify-center">
                                            <div className="absolute inset-0 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                                            <UploadCloud className="w-8 h-8 text-pink-500 animate-pulse" />
                                        </div>
                                        <div className="text-center w-full max-w-xs space-y-2">
                                            <h3 className="text-sm font-bold text-white">Subiendo archivos a Diiczone Cloud...</h3>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-px border border-white/5">
                                                <motion.div 
                                                    className="h-full bg-pink-500 rounded-full" 
                                                    initial={{ width: '0%' }}
                                                    animate={{ width: `${uploadProgress}%` }}
                                                    transition={{ duration: 0.1 }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 font-mono">{uploadProgress}% Completado</p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSaveUpload} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-1">Título del Asset</label>
                                            <input 
                                                type="text"
                                                value={uploadForm.title}
                                                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Ej: Logo Clínica Dental - Versión Luz"
                                                required
                                                className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors font-bold"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-1">Categoría</label>
                                                <select
                                                    value={uploadForm.category}
                                                    onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                                                    className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors font-bold"
                                                >
                                                    <option>Social Media</option>
                                                    <option>Branding</option>
                                                    <option>Print</option>
                                                    <option>Web</option>
                                                    <option>Merch</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-1">Formato / Medidas</label>
                                                <input 
                                                    type="text"
                                                    value={uploadForm.format}
                                                    onChange={(e) => setUploadForm(prev => ({ ...prev, format: e.target.value }))}
                                                    placeholder="Ej: 1080x1350 px, PSD, SVG"
                                                    required
                                                    className="w-full bg-[#13131f] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors font-bold"
                                                />
                                            </div>
                                        </div>

                                        {/* File upload area */}
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-1">Seleccionar Archivo</label>
                                            {uploadForm.fileSelected ? (
                                                <div className="p-4 bg-pink-500/5 border border-pink-500/20 rounded-xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-pink-500/15 rounded-lg text-pink-400">
                                                            <ImageIcon className="w-5 h-5" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-xs font-bold text-white truncate max-w-[200px]">{uploadForm.fileName}</p>
                                                            <p className="text-[10px] text-gray-500 font-mono">{uploadForm.fileSize}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setUploadForm(prev => ({ ...prev, fileSelected: false, fileName: '', fileSize: '' }))}
                                                        className="text-[10px] text-pink-400 hover:text-pink-300 font-bold uppercase tracking-wider"
                                                    >
                                                        Cambiar
                                                    </button>
                                                </div>
                                            ) : (
                                                <div 
                                                    onClick={handleFileChangeSimulate}
                                                    className="border-2 border-dashed border-white/10 hover:border-pink-500/50 rounded-xl p-8 text-center bg-white/[0.01] hover:bg-pink-500/[0.02] cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
                                                >
                                                    <UploadCloud className="w-8 h-8 text-gray-600 group-hover:text-pink-500 transition-colors" />
                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Arrastre su diseño o haga clic para seleccionar</span>
                                                    <span className="text-[9px] text-gray-600 uppercase tracking-wider font-mono">PNG, JPG, SVG, PSD (Max 50MB)</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setIsUploading(false)}
                                                className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-white text-xs font-bold rounded-xl transition-all"
                                            >
                                                Cancelar
                                            </button>
                                            <button 
                                                type="submit"
                                                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-900/40 transition-all"
                                            >
                                                Guardar y Subir
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- ASSET DETAIL MODAL --- */}
            <AnimatePresence>
                {selectedAsset && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-8" onClick={() => setSelectedAsset(null)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0E0E18] border border-white/10 rounded-2xl overflow-hidden max-w-5xl w-full h-[80vh] flex shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex-1 bg-black/50 flex items-center justify-center p-8 relative">
                                <img src={selectedAsset.thumb} alt={selectedAsset.title} className="max-w-full max-h-full object-contain shadow-2xl" />
                            </div>
                            <div className="w-96 bg-[#13131f] border-l border-white/5 p-8 flex flex-col">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedAsset.title}</h2>
                                    <span className="bg-pink-600/20 text-pink-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{selectedAsset.type}</span>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Formato</div>
                                            <div className="text-white font-mono text-sm">{selectedAsset.format}</div>
                                        </div>
                                        <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Peso</div>
                                            <div className="text-white font-mono text-sm">{selectedAsset.size}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Historial de Versiones</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs p-2 hover:bg-white/5 rounded transition-colors cursor-pointer">
                                                <span className="text-white font-bold">v2.0 (Final)</span>
                                                <span className="text-gray-500">Hace 2h</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs p-2 hover:bg-white/5 rounded transition-colors cursor-pointer opacity-50">
                                                <span className="text-white font-bold">v1.5 (Draft)</span>
                                                <span className="text-gray-500">Ayer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-3">
                                    <button 
                                        onClick={() => toast.success('Descargando archivo original...')}
                                        className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-900/40 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" /> Descargar Asset
                                    </button>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success('¡Enlace de descarga copiado al portapapeles!');
                                        }}
                                        className="w-full py-3 border border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" /> Compartir Link
                                    </button>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAsset(null)} className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 z-50"><X className="w-5 h-5" /></button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function UploadCloud({ className }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>;
}
