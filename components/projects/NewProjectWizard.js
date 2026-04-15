'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, UploadCloud, Film, Layers } from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import SceneEditor from './SceneEditor';

export default function NewProjectWizard({ isOpen, onClose }) {
    const [step, setStep] = useState(1); // 1: Selection, 2: Config, 3: Details
    const [selectedDept, setSelectedDept] = useState(null);
    const [projectConfig, setProjectConfig] = useState({});

    // Video Specific State
    const [videoType, setVideoType] = useState(null); // 'single', 'multi'
    const [scenes, setScenes] = useState([
        { id: 1, name: 'Intro', description: '', files: [] },
        { id: 2, name: 'Desarrollo', description: '', files: [] },
        { id: 3, name: 'Cierre', description: '', files: [] }
    ]);

    const handleDeptSelect = (dept) => {
        setSelectedDept(dept);
        setStep(2);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedDept(null);
            setVideoType(null);
        } else if (step === 3) {
            setStep(2);
        }
    };

    const handleNext = () => {
        setStep(step + 1);
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

    const renderStep2_VideoConfig = () => (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center">
                <div className={`inline-flex p-3 rounded-full bg-white/5 ${selectedDept.color} mb-4`}>
                    <selectedDept.icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">Nuevo Proyecto de Video</h2>
                <p className="text-gray-400">Elige la estructura para tu contenido</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    onClick={() => { setVideoType('single'); handleNext(); }}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${videoType === 'single' ? 'border-primary bg-primary/10' : 'border-white/5 bg-[#0B0B15] hover:border-white/20'}`}
                >
                    <div className="mb-4 bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center text-blue-500">
                        <Film className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Video Unico</h3>
                    <p className="text-sm text-gray-400">Para archivos continuos como podcasts, entrevistas o grabaciones de una sola toma.</p>
                </div>

                <div
                    onClick={() => { setVideoType('multi'); handleNext(); }}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${videoType === 'multi' ? 'border-primary bg-primary/10' : 'border-white/5 bg-[#0B0B15] hover:border-white/20'}`}
                >
                    <div className="mb-4 bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center text-purple-500">
                        <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Multi-Escena</h3>
                    <p className="text-sm text-gray-400">Ideal para Reels, TikToks o videos comerciales con estructura compleja.</p>
                </div>
            </div>
        </div>
    );

    const renderStep3_VideoDetails = () => (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">
                    {videoType === 'single' ? 'Carga de Archivos' : 'Editor de Escenas'}
                </h2>
                <p className="text-sm text-gray-400">
                    {videoType === 'single' ? 'Sube tu archivo principal y recursos extra.' : 'Define la estructura paso a paso.'}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {videoType === 'single' ? (
                    <div className="space-y-6">
                        {/* Single Upload Area */}
                        <div className="border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center hover:border-primary/50 transition-colors bg-white/5">
                            <UploadCloud className="w-12 h-12 text-gray-500 mb-4" />
                            <h3 className="text-white font-bold mb-1">Arrastra tu video aquí</h3>
                            <p className="text-xs text-gray-500">MP4, MOV hasta 2GB</p>
                            <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">
                                Explorar Archivos
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Instrucciones Generales</label>
                            <textarea
                                className="w-full bg-[#0B0B15] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary outline-none h-32"
                                placeholder="Describe el estilo, música o referencias para este video..."
                            ></textarea>
                        </div>
                    </div>
                ) : (
                    <SceneEditor scenes={scenes} setScenes={setScenes} />
                )}
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
                <button
                    onClick={onClose} // TODO: Implement submit logic
                    className="px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-primary/25 transition-all w-full md:w-auto"
                >
                    Crear Proyecto
                </button>
            </div>
        </div>
    );

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
                        {step === 2 && renderStep2_VideoConfig()}
                        {step === 3 && renderStep3_VideoDetails()}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
