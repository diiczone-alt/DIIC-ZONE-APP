'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, UploadCloud, Film, Layers, Palette, Globe, Layout, Smartphone, Share2, Users, FileVideo } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import SceneEditor from './SceneEditor';
import { toast } from 'sonner';
import { agencyService } from '@/services/agencyService';

export default function NewProjectWizard({ isOpen, onClose, squad, client }) {
    const [step, setStep] = useState(1); // 1: Selection, 2: Config, 3: Details
    const [selectedDept, setSelectedDept] = useState(null);
    const [projectType, setProjectType] = useState(null); 
    const [scenes, setScenes] = useState([
        { id: 1, name: 'Intro', description: '', files: [] },
        { id: 2, name: 'Desarrollo', description: '', files: [] },
        { id: 3, name: 'Cierre', description: '', files: [] }
    ]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [assignee, setAssignee] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use squad provided by Strategist or Mock fallback
    const TEAM_MEMBERS = squad && squad.length > 0 ? squad.map(m => ({
        id: m.name, // Usar nombre como ID para la asginacion directa en task.assigned_to
        name: m.name,
        role: m.role,
        avatar: m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=random`
    })) : [
        { id: 'Ana (Senior)', name: 'Ana (Senior)', role: 'Lead', avatar: 'https://i.pravatar.cc/150?u=ana' },
        { id: 'Carlos (Junior)', name: 'Carlos (Junior)', role: 'Creator', avatar: 'https://i.pravatar.cc/150?u=carlos' },
        { id: 'Sofía', name: 'Sofía', role: 'Specialist', avatar: 'https://i.pravatar.cc/150?u=sofia' }
    ];

    const handleDeptSelect = (dept) => {
        setSelectedDept(dept);
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedDept(null);
            setProjectType(null);
        } else if (step === 3) {
            setStep(2);
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleCreateProject = async () => {
        setIsSubmitting(true);
        
        try {
            // Find assignee name
            const assignedMember = TEAM_MEMBERS.find(m => m.id === assignee);
            
            const taskObj = {
                title: `Proyecto de ${selectedDept?.title} - ${projectType}`,
                client_name: client?.name || 'Cliente Interno',
                client: client?.id || null,
                city: client?.city || 'Remoto',
                assigned_to: assignedMember ? assignedMember.name : assignee,
                assigned_role: selectedDept?.id || 'creative',
                status: 'pending',
                priority: 'normal',
                tags: [selectedDept?.title, projectType],
                details: {
                    scenes,
                    uploadedFiles: uploadedFiles.map(f => f.name)
                }
            };
            
            await agencyService.createTask(taskObj);
            toast.success("Proyecto Asignado", { description: `El proyecto fue asignado a ${taskObj.assigned_to}`});
            
            // Redirigir a la workstation del departamento correspondiente
            if (selectedDept?.href) {
                window.location.href = selectedDept.href;
            } else {
                onClose();
            }
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Error al asignar proyecto");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1_Selection = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Hola Creativo 👋</h2>
                <p className="text-gray-400">¿Qué quieres crear el día de hoy?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
                {DEPARTMENTS.map((dept) => (
                    <motion.div
                        key={dept.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeptSelect(dept)}
                        className={`cursor-pointer p-4 rounded-xl border ${dept.bg} ${dept.border} hover:bg-opacity-20 transition-all flex flex-col items-center text-center gap-3 group`}
                    >
                        <div className={`p-3 rounded-full bg-white/5 ${dept.color} group-hover:scale-110 transition-transform`}>
                            <dept.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">{dept.title}</h3>
                            <p className="text-[10px] text-gray-400 leading-tight">{dept.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const renderStep2_Config = () => {
        // Configuraciones dinámicas basadas en el departamento
        const isVideo = selectedDept.id === 'video' || selectedDept.id === 'filmmaker';
        const isDesign = selectedDept.id === 'design';
        const isWeb = selectedDept.id === 'web';
        const isCommunity = selectedDept.id === 'community';

        let options = [];
        let title = `Nuevo Proyecto de ${selectedDept.title}`;
        let subtitle = "Elige la estructura para tu contenido";

        if (isVideo) {
            options = [
                { id: 'single', title: 'Video Único', desc: 'Podcasts, entrevistas o una sola toma.', icon: Film, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { id: 'multi', title: 'Multi-Escena', desc: 'Reels, TikToks o comerciales estructurados.', icon: Layers, color: 'text-purple-500', bg: 'bg-purple-500/10' }
            ];
        } else if (isDesign) {
            options = [
                { id: 'post', title: 'Post / Feed', desc: 'Gráficas estáticas para Instagram o Facebook.', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                { id: 'carousel', title: 'Carrusel', desc: 'Múltiples imágenes para deslizar (educativo).', icon: Layers, color: 'text-orange-500', bg: 'bg-orange-500/10' }
            ];
        } else if (isWeb) {
            options = [
                { id: 'landing', title: 'Landing Page', desc: 'Página de aterrizaje para captura de leads.', icon: Layout, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                { id: 'ecommerce', title: 'E-Commerce', desc: 'Tienda en línea completa con carrito.', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
            ];
        } else if (isCommunity) {
            options = [
                { id: 'campaign', title: 'Campaña Mensual', desc: 'Parrilla de contenido mensual completa.', icon: Share2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { id: 'launch', title: 'Lanzamiento', desc: 'Estrategia agresiva para un producto/evento.', icon: Users, color: 'text-red-500', bg: 'bg-red-500/10' }
            ];
        } else {
            // Generic fallback
            options = [
                { id: 'standard', title: 'Proyecto Estándar', desc: 'Flujo de trabajo clásico con entrega directa.', icon: UploadCloud, color: 'text-gray-400', bg: 'bg-white/5' },
                { id: 'complex', title: 'Proyecto Complejo', desc: 'Requiere múltiples revisiones y fases.', icon: Layers, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
            ];
        }

        return (
            <div className="space-y-8 max-w-2xl mx-auto">
                <div className="text-center">
                    <div className={`inline-flex p-3 rounded-full bg-white/5 ${selectedDept.color} mb-4`}>
                        <selectedDept.icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <p className="text-gray-400">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            onClick={() => { setProjectType(opt.id); handleNext(); }}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${projectType === opt.id ? 'border-primary bg-primary/10' : 'border-white/5 bg-[#0B0B15] hover:border-white/20'}`}
                        >
                            <div className={`mb-4 ${opt.bg} w-12 h-12 rounded-lg flex items-center justify-center ${opt.color}`}>
                                <opt.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{opt.title}</h3>
                            <p className="text-sm text-gray-400">{opt.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderStep3_Details = () => {
        const renderUploadBox = (title, subtitle) => (
            <div className="relative">
                <input 
                    type="file" 
                    id="global-upload" 
                    className="hidden" 
                    multiple 
                    onChange={(e) => {
                        if (e.target.files.length > 0) {
                            toast.success(`Archivos cargados con éxito`);
                            const newFiles = Array.from(e.target.files).map(f => ({
                                file: f,
                                name: f.name,
                                type: f.type,
                                preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null
                            }));
                            setUploadedFiles([...uploadedFiles, ...newFiles]);
                        }
                    }}
                />
                <div 
                    onClick={(e) => {
                        if (uploadedFiles.length === 0) document.getElementById('global-upload').click();
                    }}
                    className={`border-2 border-dashed border-white/10 rounded-2xl h-56 flex flex-col items-center justify-center transition-colors bg-white/5 ${uploadedFiles.length === 0 ? 'hover:border-primary/50 cursor-pointer group' : ''}`}
                >
                    {uploadedFiles.length > 0 ? (
                        <div className="w-full h-full p-4 flex flex-col">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-white text-sm font-bold">{uploadedFiles.length} Archivo(s) subido(s)</h3>
                                <button 
                                    onClick={() => document.getElementById('global-upload').click()}
                                    className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md hover:bg-primary hover:text-white transition-colors"
                                >
                                    + Añadir más
                                </button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-y-auto custom-scrollbar pr-1 pb-2 flex-1">
                                {uploadedFiles.map((f, idx) => (
                                    <div key={idx} className="relative group bg-black/40 rounded-lg border border-white/5 overflow-hidden aspect-square flex flex-col items-center justify-center">
                                        {f.preview ? (
                                            <img src={f.preview} alt={f.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 p-2">
                                                <FileVideo className="w-6 h-6 text-gray-500" />
                                                <span className="text-[9px] text-gray-400 text-center truncate w-full px-1">{f.name}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                            <span className="text-[8px] text-white truncate max-w-[90%] px-1">{f.name}</span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
                                                }}
                                                className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors mt-1"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <UploadCloud className="w-12 h-12 text-gray-500 mb-4 group-hover:text-primary transition-colors" />
                            <h3 className="text-white font-bold mb-1">{title || 'Arrastra tus archivos aquí'}</h3>
                            <p className="text-xs text-gray-500">{subtitle || 'Imágenes, Videos, Audios o Documentos'}</p>
                            <button className="mt-4 px-4 py-2 bg-white/10 group-hover:bg-primary text-white rounded-lg text-sm font-bold transition-colors">
                                Explorar Archivos
                            </button>
                        </>
                    )}
                </div>
            </div>
        );

        const renderFormGroup = (label, placeholder, isTextarea = true) => (
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">{label}</label>
                {isTextarea ? (
                    <textarea
                        className="w-full bg-[#0B0B15] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none h-28 resize-none"
                        placeholder={placeholder}
                    ></textarea>
                ) : (
                    <input
                        type="text"
                        className="w-full bg-[#0B0B15] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none"
                        placeholder={placeholder}
                    />
                )}
            </div>
        );

        let content = null;

        // Flujos Específicos por Tipo de Proyecto
        if (projectType === 'multi' || projectType === 'carousel') {
            content = <SceneEditor scenes={scenes} setScenes={setScenes} />;
        } 
        else if (projectType === 'single') {
            content = (
                <div className="space-y-6">
                    {renderUploadBox('Sube tu archivo de video RAW', 'MP4, MOV (Máx 2GB)')}
                    <div className="grid grid-cols-2 gap-4">
                        {renderFormGroup('Instrucciones de Edición', 'Ej: Cortar silencios, añadir subtítulos dinámicos...')}
                        {renderFormGroup('Referencias Visuales (Links)', 'Pega links de TikToks o Reels de referencia...')}
                    </div>
                </div>
            );
        }
        else if (projectType === 'post') {
            content = (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderUploadBox('Recursos Gráficos', 'Logos (PNG/SVG), Fotos base')}
                        <div className="space-y-4">
                            {renderFormGroup('Copy / Texto del Diseño', 'El texto exacto que debe ir en la imagen')}
                            {renderFormGroup('Estilo o Colores', 'Ej: Estilo minimalista, usar azul corporativo', false)}
                        </div>
                    </div>
                </div>
            );
        }
        else if (projectType === 'landing' || projectType === 'ecommerce') {
            content = (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {renderFormGroup('Dominio Preferido', 'ejemplo.com', false)}
                        {renderFormGroup('Objetivo Principal', 'Ej: Capturar leads, vender producto X', false)}
                    </div>
                    {renderUploadBox('Manual de Marca & Assets', 'PDF, Logos, Imágenes de producto')}
                    {renderFormGroup('Estructura Deseada (Opcional)', 'Ej: Hero con video, Sección de Testimonios, Pricing...')}
                </div>
            );
        }
        else if (projectType === 'campaign' || projectType === 'launch') {
            content = (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {renderFormGroup('Fecha de Inicio', 'DD/MM/YYYY', false)}
                        {renderFormGroup('Fecha de Fin', 'DD/MM/YYYY', false)}
                    </div>
                    {renderFormGroup('Objetivo de la Campaña', 'Ej: Aumentar seguidores en un 20%, Lanzar nuevo producto')}
                    {renderUploadBox('Material Existente', 'Fotos, Videos anteriores, Docs de la marca')}
                </div>
            );
        }
        else {
            // Estándar / Complejo / Fallback
            content = (
                <div className="space-y-6">
                    {renderUploadBox()}
                    {renderFormGroup('Instrucciones Estratégicas', 'Escribe el contexto, copy sugerido, referencias o indicaciones clave...')}
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">
                        {projectType === 'multi' || projectType === 'carousel' 
                            ? 'Estructura Detallada' 
                            : 'Configuración de Recursos e Instrucciones'}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {projectType === 'multi' || projectType === 'carousel' 
                            ? 'Define las partes de tu contenido paso a paso.' 
                            : 'Completa los requerimientos específicos para tu solicitud.'}
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {content}
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 w-full">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Asignar Proyecto a:</label>
                        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                            {TEAM_MEMBERS.map(member => (
                                <div 
                                    key={member.id}
                                    onClick={() => setAssignee(member.id)}
                                    className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all border min-w-[140px] ${assignee === member.id ? 'border-primary bg-primary/20 shadow-lg shadow-primary/10' : 'border-white/5 bg-[#0B0B15] hover:border-white/20'}`}
                                >
                                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-white/10" />
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold text-white truncate">{member.name}</p>
                                        <p className="text-[10px] text-primary">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleCreateProject}
                        disabled={isSubmitting || !assignee}
                        className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all w-full md:w-auto whitespace-nowrap mt-4 md:mt-0 ${
                            isSubmitting || !assignee
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5' 
                            : 'bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-primary/25'
                        }`}
                    >
                        {!assignee ? 'Selecciona Creativo' : isSubmitting ? 'Asignando al equipo...' : 'Crear & Designar'}
                    </button>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#12121A] border border-white/10 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl relative overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0B0B15]">
                        <div className="flex items-center gap-4">
                            {step > 1 && (
                                <button onClick={handleBack} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Paso {step}/3</span>
                                <span className="text-xs text-gray-500">
                                    {step === 1 ? 'Selección' : step === 2 ? 'Configuración' : 'Detalles'}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 overflow-y-auto">
                        {step === 1 && renderStep1_Selection()}
                        {step === 2 && renderStep2_Config()}
                        {step === 3 && renderStep3_Details()}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
