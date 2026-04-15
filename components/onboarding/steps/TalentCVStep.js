'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle2, ArrowRight, Briefcase, Plus, X, Phone } from 'lucide-react';

export default function TalentCVStep({ onNext, updateData }) {
    const [cvName, setCvName] = useState('');
    const [cvSummary, setCvSummary] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');

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
            <div className="space-y-3">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Habilidades Clave (Skills)</label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-white/5 border border-white/5 rounded-2xl">
                    {skills.map(skill => (
                        <motion.span 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={skill} 
                            className="bg-indigo-500 text-white text-[10px] font-black py-1.5 px-3 rounded-full flex items-center gap-2"
                        >
                            {skill}
                            <button onClick={() => removeSkill(skill)}><X className="w-3 h-3" /></button>
                        </motion.span>
                    ))}
                    <div className="flex items-center gap-2 ml-2">
                        <input 
                            type="text" 
                            placeholder="Agregar skill..."
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            className="bg-transparent border-none text-[10px] text-white focus:outline-none w-24 font-bold"
                        />
                        <button onClick={addSkill} className="p-1 hover:bg-white/10 rounded-full transition-all">
                            <Plus className="w-3 h-3 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* CONTINUE BUTTON */}
            <button
                onClick={handleContinue}
                className="w-full py-5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-[24px] font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 mt-4 group"
            >
                FINALIZAR REQUISITOS
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
