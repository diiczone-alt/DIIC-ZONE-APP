'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    LayoutDashboard, MessageSquare, Calendar as CalendarIcon, FileText,
    Users, ChevronRight, Bell, Search, Mic, Send, TrendingUp, AlertCircle, Bot, Share2,
    Target, Activity, Zap, Shield, Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function CommunityDashboard() {
    const { user } = useAuth();
    const [clients, setClients] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCMData = async () => {
            if (!user) return;
            
            setLoading(true);
            try {
                if (user.role === 'CLIENT') {
                    // MODO CLIENTE: Buscar solo su propio perfil de cliente vinculado
                    const { data: myClient, error: clientError } = await supabase
                        .from('clients')
                        .select('*')
                        .or(`id.eq.${user.client_id},email.eq.${user.email}`)
                        .maybeSingle();

                    if (clientError) throw clientError;
                    setClients(myClient ? [myClient] : []);

                    if (myClient) {
                        const { data: tasksData, error: tasksError } = await supabase
                            .from('tasks')
                            .select('*')
                            .eq('client', myClient.id)
                            .order('created_at', { ascending: false })
                            .limit(5);

                        if (tasksError) throw tasksError;
                        setRecentTasks(tasksData || []);
                    }
                } else if (user.full_name) {
                    // MODO GESTOR: Buscar todos los clientes asignados
                    const { data: assignedClients, error: clientsError } = await supabase
                        .from('clients')
                        .select('*')
                        .eq('cm', user.full_name);

                    if (clientsError) throw clientsError;
                    setClients(assignedClients || []);

                    if (assignedClients && assignedClients.length > 0) {
                        const clientIds = assignedClients.map(c => c.id);
                        const { data: tasksData, error: tasksError } = await supabase
                            .from('tasks')
                            .select('*')
                            .in('client', clientIds)
                            .order('created_at', { ascending: false })
                            .limit(5);

                        if (tasksError) throw tasksError;
                        setRecentTasks(tasksData || []);
                    }
                }
            } catch (err) {
                console.error('Error fetching CM data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCMData();
    }, [user?.full_name]);

    const STATS = [
        { label: 'Cuentas Activas', value: clients.length.toString(), color: 'text-emerald-400', icon: Shield, trend: '+2 esta semana' },
        { label: 'Estrategias', value: 'Óptimo', color: 'text-indigo-400', icon: Target, trend: '98% salud' },
        { label: 'Ritmo Social', value: '+22%', color: 'text-fuchsia-400', icon: Activity, trend: 'Alcance orgánico' },
    ];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 animate-pulse">Sincronizando Sistema Estratégico...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header & Status - High Fidelity UI */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
                <div className="relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                            Command Center v2.0
                        </div>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">Status: En Línea</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
                        Panel <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-white">Estratégico.</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-4 font-bold max-w-lg uppercase tracking-widest">
                        {user.role === 'CLIENT' 
                            ? `Bienvenida, ${user.full_name || 'Dra. Reyes'}. Visualizando tu ecosistema activo.`
                            : `Bienvenido, ${user.full_name || 'Community Manager'}. Gestionando ${clients.length} ecosistemas activos.`
                        }
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex -space-x-4">
                        {clients.slice(0, 3).map((c, i) => (
                            <div key={i} className="w-12 h-12 rounded-2xl border-2 border-[#050511] bg-white/5 flex items-center justify-center text-[10px] font-black text-white p-1 hover:translate-y-[-5px] transition-transform cursor-pointer overflow-hidden backdrop-blur-xl">
                                {c.name.substring(0, 2).toUpperCase()}
                            </div>
                        ))}
                        {clients.length > 3 && (
                            <div className="w-12 h-12 rounded-2xl border-2 border-[#050511] bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                                +{clients.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Top Metrics Grid - Liquid Glass Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STATS.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.05] transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</div>
                            <stat.icon className={`w-5 h-5 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        </div>
                        <div className={`text-4xl font-black italic tracking-tighter ${stat.color} mb-2`}>{stat.value}</div>
                        <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{stat.trend}</div>
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </motion.div>
                ))}
            </div>

            {/* Central Hub: AI Assistant & Managed Accounts */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* AI Assistant Hub (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-transparent border border-white/10 rounded-[3rem] p-1 overflow-hidden group">
                        <div className="bg-[#0A0A1F]/90 backdrop-blur-xl rounded-[2.8rem] p-10 relative overflow-hidden">
                            {/* Animated Background */}
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-1000" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="space-y-6 text-center md:text-left flex-1">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Asistente Inteligente</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-white italic tracking-tighter">Sinergia Creativa <span className="text-indigo-500">Activada.</span></h3>
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
                                        Tu copiloto está analizando las métricas de ayer. Hay una oportunidad masiva para <span className="text-white italic">{clients[0]?.name || 'tu marca asignada'}</span> en Reels Educativos.
                                    </p>
                                    <Link href="/dashboard/community/agent">
                                        <button className="w-full md:w-auto px-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-white/5 flex items-center justify-center gap-3 group/btn">
                                            Optimizar Estrategias <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                                        </button>
                                    </Link>
                                </div>

                                <div className="relative shrink-0 group-hover:rotate-6 transition-transform duration-700">
                                    <div className="w-48 h-48 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[3rem] shadow-2xl relative z-10 flex items-center justify-center overflow-hidden">
                                        <Bot className="w-20 h-20 text-white" />
                                        <div className="absolute inset-0 bg-white/10 opacity-50 backdrop-blur-xl" />
                                    </div>
                                    <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full -z-10 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Production Feed / Alerts */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <Zap className="w-4 h-4 text-amber-500" /> Alertas de Producción
                            </h3>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Ver Todo el Flujo</span>
                        </div>
                        <div className="space-y-4">
                            {recentTasks.map((task, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-5 rounded-3xl hover:bg-white/[0.05] transition-all cursor-pointer group"
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 ${task.priority === 'high' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase italic">{task.title}</div>
                                        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Status: {task.status} • Cliente: {task.client}</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-700 group-hover:translate-x-2 transition-transform" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Ecosystem Access & Team */}
                <div className="space-y-8">
                    {/* Visual Ecosystem Grid */}
                    <div className="bg-[#0A0A1F] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <h3 className="font-black text-white mb-6 text-xs uppercase tracking-[0.3em] text-gray-500 italic">Arquitectura Operativa</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'strategy', icon: Share2, label: 'Estrategia', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                { id: 'calendar', icon: CalendarIcon, label: 'Calendario', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                                { id: 'content', icon: LayoutDashboard, label: 'Contenidos', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                                { id: 'reports', icon: FileText, label: 'Reportes', color: 'text-blue-400', bg: 'bg-blue-500/10' }
                            ].map(item => (
                                <Link
                                    key={item.id}
                                    href={`/dashboard/community/${item.id === 'content' ? 'contenidos' : item.id}`}
                                    className={`p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-center transition-all hover:scale-105 ${item.bg} border border-white/5 hover:border-white/10 group`}
                                >
                                    <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Team - Online Status */}
                    <div className="bg-[#0A0A1F] border border-white/5 rounded-[2.5rem] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-white text-xs uppercase tracking-[0.3em] text-gray-500 italic">Nodos Activos</h3>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Global Link</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {[
                                { name: 'Roberto G.', role: 'Estratega Senior', img: 'Felix' },
                                { name: 'Ana M.', role: 'Art Director', img: 'Ana' }
                            ].map((member, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 p-0.5 group-hover:scale-110 transition-transform">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.img}`} className="w-full h-full rounded-[14px] object-cover" alt="Avatar" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase italic">{member.name}</div>
                                        <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{member.role}</div>
                                    </div>
                                    <button className="p-2 bg-white/5 rounded-xl text-gray-600 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                            Sincronizar Equipo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ className }) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}
