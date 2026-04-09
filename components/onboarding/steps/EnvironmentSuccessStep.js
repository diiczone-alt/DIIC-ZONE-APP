'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Server, FolderGit2, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EnvironmentSuccessStep({ onNext, formData }) {
    const router = useRouter();
    const [status, setStatus] = useState('initializing'); // initializing, processing, ready
    const [logs, setLogs] = useState([]);
    const [identityCode, setIdentityCode] = useState('');

    const roleCodes = {
        editor: 'EDIT',
        filmmaker: 'FILM',
        designer: 'DSGN',
        audio: 'AUDI',
        community: 'CMMG',
        photo: 'PHOT',
        model: 'MODL',
        web: 'WEBD',
        print: 'PRNT',
        event: 'EVNT'
    };

    useEffect(() => {
        const sequence = [
            { msg: 'Conectando con Drive...', delay: 500 },
            { msg: 'Creando estructura de carpetas...', delay: 1500 },
            { msg: 'Configurando CRM...', delay: 2500 },
            { msg: 'Personalizando Dashboard...', delay: 3500 },
            { msg: '¡Todo listo!', delay: 4500, status: 'ready' }
        ];

        let timeouts = [];

        sequence.forEach(({ msg, delay, status: endStatus }) => {
            const t = setTimeout(() => {
                setLogs(prev => [...prev, msg]);
                if (endStatus) {
                    setStatus(endStatus);
                    // Generar Código de Identidad al finalizar
                    if (formData.type === 'creative') {
                        const role = roleCodes[formData.role] || 'TALN';
                        const cityPref = (formData.city || 'GEN').substring(0, 3).toUpperCase();
                        const num = Math.floor(100 + Math.random() * 900); // Num aleatorio 3 cifras
                        setIdentityCode(`${role}-${cityPref}-${num}`);
                    }
                }
            }, delay);
            timeouts.push(t);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    const handleEnterDashboard = () => {
        if (formData.type === 'creative') {
            const roleRoutes = {
                editor: '/workstation/editor',
                filmmaker: '/workstation/filmmaker',
                designer: '/workstation/designer',
                audio: '/workstation/audio',
                community: '/workstation/community-manager',
                photo: '/workstation/photography',
                model: '/workstation/talent',
                web: '/workstation/web',
                print: '/workstation/print',
                event: '/workstation/event'
            };
            const route = roleRoutes[formData.role] || '/dashboard';
            router.push(route);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
            {status !== 'ready' ? (
                // LOADING STATE
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Server className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>
                    <div className="space-y-2 text-left bg-black/40 p-6 rounded-xl border border-white/10 font-mono text-sm h-48 overflow-y-auto custom-scrollbar">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-gray-400 flex items-center gap-2"
                            >
                                <span className="text-emerald-500">➜</span> {log}
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-gray-500 animate-pulse">Configurando tu entorno DIIC ZONE...</p>
                </motion.div>
            ) : (
                // SUCCESS STATE
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-8"
                >
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">¡Entorno Listo!</h2>
                        <p className="text-gray-400 text-lg">
                            {formData.type === 'creative' 
                                ? `Bienvenido al equipo, ${formData.name || 'Creativo'}. Tu nodo de trabajo está configurado.`
                                : 'Ya tienes un equipo digital acompañándote. Tu sistema de producción y ventas está activo.'
                            }
                        </p>
                        
                        {identityCode && (
                            <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl inline-block">
                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-2 text-center">Código de Identidad DIIC ZONE</p>
                                <p className="text-3xl font-black text-white font-mono tracking-widest">{identityCode}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 py-6 border-y border-white/5">
                        <div className="flex flex-col items-center gap-2">
                            <FolderGit2 className="w-5 h-5 text-indigo-400" />
                            <span>Drive Conectado</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Server className="w-5 h-5 text-purple-400" />
                            <span>CRM Activo</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                            <span>Panel Personalizado</span>
                        </div>
                    </div>

                    <button
                        onClick={handleEnterDashboard}
                        className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-xl hover:scale-[1.02] transition-transform shadow-xl hover:shadow-indigo-500/20 flex items-center justify-center gap-3"
                    >
                        Entrar a mi Sistema
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </motion.div>
            )}
        </div>
    );
}
