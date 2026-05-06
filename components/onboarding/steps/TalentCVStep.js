'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle2, ArrowRight, Briefcase, Plus, X, Phone, Wand2 } from 'lucide-react';

const ROLE_SKILLS = {
    designer: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva', 'Figma', 'After Effects', 'InDesign', 'CorelDraw', 'CSS', 'UI/UX'],
    editor: ['Adobe Premiere Pro', 'After Effects', 'CapCut', 'DaVinci Resolve', 'Final Cut Pro', 'Sony Vegas', 'Audition', 'Color Grading'],
    filmmaker: ['Dirección de Fotografía', 'Manejo de Estabilizadores', 'Iluminación', 'Drone Pilot', 'Adobe Premiere', 'Storyboarding'],
    community: ['Copywriting', 'Metric Analysis', 'Ads Manager', 'Planificación Estratégica', 'Diseño Básico', 'Gestión de Crisis'],
    photo: ['Adobe Lightroom', 'Photoshop', 'Capture One', 'Iluminación de Estudio', 'Retoque High-End', 'Composición Visual'],
    model: ['Pasarela', 'Acting', 'Posado Fotográfico', 'Protocolo', 'Mantenimiento de Imagen', 'Expresión Corporal'],
    web: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Supabase', 'Figma to Code', 'SEO Técnico'],
    print: ['Preprensa', 'Gestión de Color', 'Manejo de Plotter', 'Adobe InDesign', 'Diseño Estructural', 'Sustratos'],
    event: ['Logística', 'Producción Técnica', 'Booking', 'Dirección de Escena', 'Presupuestación', 'AV Systems'],
};

export default function TalentCVStep({ onNext, updateData, data }) {
    const role = data?.role || 'editor';
    const [cvName, setCvName] = useState('');
    const [cvSummary, setCvSummary] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');

    const suggestedSkills = ROLE_SKILLS[role] || [];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        // Simulamos carga
        setTimeout(() => {
            setCvName(file.name);
            setIsUploading(false);
        }, 1500);
    };

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleContinue = () => {
        updateData({ 
            cv_url: cvName ? `https://storage.diiczone.com/cvs/${cvName}` : '',
            cv_summary: cvSummary,
            skills: skills,
            whatsapp: whatsapp
        });
        onNext();
    };

    return (
        <div className="space-y-8 text-left max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                    <Briefcase className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Perfil Profesional</h2>
                    <p className="text-gray-400 text-sm">Carga tu CV y destaca tus habilidades principales.</p>
                </div>
            </div>

            {/* CV UPLOAD AREA */}
            <div className="relative group">
                <input 
                    type="file" 
                    id="cv-upload" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                />
                <label 
                    htmlFor="cv-upload" 
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-300 bg-white/5 
                                ${cvName ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/10'}`}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Analizando Documento...</span>
                        </div>
                    ) : cvName ? (
                        <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            <span className="text-sm font-bold text-white italic">{cvName}</span>
                            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Listo para Procesar</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-center px-4">
                            <Upload className="w-10 h-10 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                            <div className="space-y-1">
                                <span className="text-sm font-bold text-gray-300">Click para subir Curriculum Vitae</span>
                                <p className="text-[10px] text-gray-500 font-medium">PDF o DOCX (Máx 5MB)</p>
                            </div>
                        </div>
                    )}
                </label>
            </div>

            {/* WHATSAPP FIELD */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> WhatsApp (Para Recordatorios)
                </label>
                <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+593 9..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                />
            </div>

            {/* PROFESSIONAL SUMMARY */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Resumen / Extracto Profesional
                </label>
                <textarea
                    value={cvSummary}
                    onChange={(e) => setCvSummary(e.target.value)}
                    placeholder="Escribe un breve resumen de tu trayectoria..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
            </div>

            {/* SKILLS TAGS */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Habilidades & Software</label>
                    <span className="text-[8px] text-gray-600 font-bold uppercase italic">Selecciona para agregar</span>
                </div>

                {/* Quick Suggestions based on Role */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {suggestedSkills.filter(s => !skills.includes(s)).slice(0, 6).map(s => (
                        <button 
                            key={s}
                            onClick={() => setSkills([...skills, s])}
                            className="text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center gap-1.5 group"
                        >
                            <Wand2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {s}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-white/5 border border-white/5 rounded-3xl">
                    {skills.length === 0 && (
                        <p className="text-[10px] text-gray-700 font-black uppercase italic tracking-widest py-2">Sin habilidades seleccionadas...</p>
                    )}
                    {skills.map(skill => (
                        <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={skill} 
                            className="bg-indigo-600 text-white text-[10px] font-black py-2 px-4 rounded-xl flex items-center gap-3 shadow-lg shadow-indigo-600/20 border border-indigo-400/30"
                        >
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                        </motion.span>
                    ))}
                    <div className="flex items-center gap-2 ml-2 flex-1">
                        <input 
                            type="text" 
                            placeholder="Otro skill..."
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            className="bg-transparent border-none text-[10px] text-white focus:outline-none w-full font-bold uppercase tracking-widest placeholder:text-gray-700"
                        />
                        <button onClick={addSkill} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                            <Plus className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTINUE BUTTON */}
            <button
                onClick={handleContinue}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[28px] font-black text-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_50px_rgba(79,70,229,0.3)] mt-6 group"
            >
                CONTINUAR REGISTRO
                <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
