'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, MessageSquare, Search, Plus, Activity, 
  CheckCircle2, AlertCircle, Users, Play, 
  Layout, MessageCircle, MoreVertical, 
  ChevronRight, TrendingUp, PieChart, Video, 
  Palette, FileText, ArrowRight, Settings, LogOut, User, Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// ─── Stat Card Component ─────────────────────────────────────────
function StatCard({ title, value, delta, icon: Icon, color, chartData }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex-1 min-w-[280px] group transition-all duration-500 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div 
        className="absolute -right-10 -bottom-10 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
          {title}
        </span>
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 transition-all duration-500 group-hover:border-white/20 relative"
          style={{ backgroundColor: `${color}10` }}
        >
          <div className="absolute inset-0 blur-[15px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: color }} />
          <Icon className="w-6 h-6 relative z-10 transition-colors" style={{ color: color }} />
        </div>
      </div>
      
      <div className="flex items-end justify-between relative z-10">
        <div className="space-y-2">
          <span className="text-4xl font-black text-white italic tracking-tighter block group-hover:scale-110 origin-left transition-transform duration-500">
            {value}
          </span>
          <div className="flex items-center gap-2">
             <div className="bg-emerald-500/10 p-1 rounded-md">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span className="text-emerald-400">{delta}</span> vs. prev
             </span>
          </div>
        </div>
        
        {/* Neon Sparkline Area */}
        <div className="w-28 h-14 relative group-hover:scale-110 transition-transform duration-500">
           <svg width="100%" height="100%" viewBox="0 0 100 40" className="overflow-visible">
              {/* Shadow/Glow Path */}
              <motion.path 
                d={chartData} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" 
                className="opacity-20 blur-[6px]"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
              />
              {/* Solid Path */}
              <motion.path 
                d={chartData} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" 
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
              />
           </svg>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
    </motion.div>
  );
}

// ─── Production Item Component ───────────────────────────────────
function ProductionItem({ title, type, progress, color, time, icon: Icon }) {
  return (
    <div className="bg-[#11111d] rounded-2xl p-5 border border-white/5 flex gap-4 group hover:bg-white/[0.03] transition-all">
      <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border border-white/5" style={{ color: color }}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-center">
           <div>
              <p className="text-sm font-black text-white">{title}</p>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: color }}>{type}</p>
           </div>
           <span className="text-[10px] font-bold text-gray-600"> {time}</span>
        </div>
        
        <div className="space-y-1.5">
           <div className="flex justify-between text-[10px] font-black">
              <span className="text-gray-500" />
              <span className="text-white">{progress}%</span>
           </div>
           <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: `${progress}%` }} 
               transition={{ duration: 1 }}
               className="h-full rounded-full" 
               style={{ backgroundColor: color }} 
             />
           </div>
        </div>
      </div>
    </div>
  );
}

// ─── Donut Chart Component ───────────────────────────────────────
function DonutChart({ value, label, color, icon: Icon }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
       <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
             <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
             <motion.circle 
               cx="40" cy="40" r={radius} stroke={color} strokeWidth="6" strokeDasharray={circumference} 
               initial={{ strokeDashoffset: circumference }}
               animate={{ strokeDashoffset: offset }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               fill="transparent" strokeLinecap="round"
             />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-xs font-black text-white">{value}%</span>
          </div>
       </div>
       <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

// ─── Reverted Dashboard Content ──────────────────────────────────
function DashboardContent() {
  const { user, loading: authLoading, getHomeRoute } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  
  const [clientData, setClientData] = useState(null);
  const [production, setProduction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

    // Handle role-based redirection as soon as user is loaded
    useEffect(() => {
        if (!authLoading && user) {
            const homeRoute = getHomeRoute(user.role);
            // Only redirect if the current path is /dashboard and the home route is different
            // We compare with '/dashboard' but also check if we are already where we need to be
            if (homeRoute && homeRoute !== '/dashboard') {
                console.log(`[Dashboard] Redirecting ${user.role} to ${homeRoute}`);
                router.push(homeRoute);
            }
        }
    }, [user, authLoading, router, getHomeRoute]);

    useEffect(() => {


    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        
        try {
            // 1. Get Client Info
            const targetClientId = user.client_id || searchParams.get('client');
            
            if (targetClientId) {
                const { data: client, error: clientErr } = await supabase
                    .from('clients')
                    .select('*')
                    .eq('id', targetClientId)
                    .single();
                
                if (client) setClientData(client);
            }

            // 2. Get Tasks (filtered by client if necessary)
            let taskQuery = supabase.from('tasks').select('*');
            if (user.role === 'CLIENT' && user.client_id) {
                taskQuery = taskQuery.eq('client_id', user.client_id);
            }

            const { data: tasks, error: taskErr } = await taskQuery.order('created_at', { ascending: false });

            if (tasks) {
                setProduction(tasks.map(t => ({
                    title: t.title,
                    type: t.priority === 'high' ? 'Urgente' : 'Edición',
                    progress: t.status === 'completed' ? 100 : t.status === 'in-progress' ? 65 : 10,
                    color: t.priority === 'high' ? '#f59e0b' : '#3b82f6',
                    time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    icon: Play
                })));
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user, searchParams]);

  const stats = [
    { title: 'Interacciones Totales', value: '24,519', delta: '+12.5%', icon: Activity, color: '#6366f1', chartData: "M 0,35 Q 25,10 50,30 T 100,0" },
    { title: 'Activos Publicados', value: '138', delta: '+8.3%', icon: CheckCircle2, color: '#10b981', chartData: "M 0,30 Q 25,35 50,15 T 100,10" },
    { title: 'En Producción', value: production.length.toString(), delta: 'Al día', icon: AlertCircle, color: '#f59e0b', chartData: "M 0,25 Q 30,5 60,35 T 100,20" },
    { title: 'Audiencia Total', value: '18.4K', delta: '+3.2%', icon: Users, color: '#ec4899', chartData: "M 0,40 Q 40,30 70,10 T 100,5" }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07070F] flex items-center justify-center text-white font-black tracking-[0.5em] uppercase text-[10px] italic">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <span className="animate-pulse">Autenticando Acceso...</span>
        </div>
      </div>
    );
  }

  const homeRoute = getHomeRoute(user?.role);
  if (homeRoute && homeRoute !== '/dashboard') {
    return (
      <div className="min-h-screen bg-[#07070F] flex items-center justify-center text-white font-black tracking-[0.5em] uppercase text-[10px] italic">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <span className="animate-pulse">Redireccionando a tu Workstation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070F] text-white p-6 md:p-10 space-y-10 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* ─── Top Navigation (Premium Centered) ─── */}
      <header className="grid grid-cols-3 items-center h-20 mb-8 relative z-[100]">
         {/* Left: Branding Redesign */}
         <div className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-all">
            <div className="relative">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black italic text-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20 z-10 relative">D</div>
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-black text-white tracking-[0.2em] uppercase leading-none">Diiczone</span>
               <span className="text-[7px] font-black text-white/40 tracking-[0.4em] uppercase mt-1">Ecosistema Pro</span>
            </div>
         </div>
         
         {/* Middle: Centered Search */}
         <div className="flex justify-center">
            <div className="relative group w-full max-w-sm">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-white transition-colors z-10" />
               <input 
                 type="text" 
                 placeholder="Buscar en el ecosistema..." 
                 className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-12 pr-16 text-[10px] text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all font-bold tracking-wide relative z-0"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/5 z-10">
                  <span className="text-[8px] font-black text-gray-600 tracking-tighter">⌘ K</span>
               </div>
            </div>
         </div>

         {/* Right: Actions & Premium Profile */}
         <div className="flex items-center justify-end gap-6">
            <div className="flex items-center gap-4 pr-6 border-r border-white/5">
               <button 
                onClick={() => setActiveDropdown(activeDropdown === 'notif' ? null : 'notif')}
                className={`p-2 rounded-xl transition-all relative ${activeDropdown === 'notif' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                  <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#07070F] shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                  <Bell className="w-5 h-5" />
               </button>
               <button 
                onClick={() => setActiveDropdown(activeDropdown === 'msg' ? null : 'msg')}
                className={`p-2 rounded-xl transition-all ${activeDropdown === 'msg' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                  <MessageSquare className="w-5 h-5" />
               </button>
            </div>
            
            <div 
              onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
              className={`flex items-center gap-4 px-2 py-1.5 rounded-2xl cursor-pointer transition-all border ${activeDropdown === 'profile' ? 'bg-white/10 border-white/20' : 'hover:bg-white/5 border-transparent'}`}
            >
               <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none">
                     {user?.user_metadata?.full_name || user?.full_name || 'Estratega'}
                  </p>
                  <p className="text-[7px] font-bold text-emerald-400 uppercase tracking-tighter mt-1 opacity-70">
                     {user?.role === 'ADMIN' ? 'Administrador Master' : (user?.role === 'CREATOR' || user?.role === 'CM' || user?.role === 'COMMUNITY' ? 'Estratega de Contenido' : (user?.user_metadata?.brand || 'Cliente Empresarial'))}
                  </p>
               </div>
               <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 p-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full rounded-[8px] object-cover" alt="User" />
               </div>
            </div>

            {/* Premium Dropdowns Container */}
            <AnimatePresence>
              {activeDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-20 right-0 w-80 bg-[#0A0A14] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden z-[200]"
                >
                  {/* NOTIFICATIONS DROPDOWN */}
                  {activeDropdown === 'notif' && (
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center mb-2">
                         <h3 className="text-xs font-black uppercase tracking-widest">Notificaciones</h3>
                         <span className="text-[10px] text-indigo-400 font-bold cursor-pointer hover:underline">Marcar todo</span>
                      </div>
                      <div className="space-y-3">
                        {[1, 2].map(i => (
                          <div key={i} className="flex gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                              <Bell className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] font-bold">Nueva Tarea Asignada</p>
                              <p className="text-[9px] text-gray-500">Diseño de landing page está lista para revisión.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-3 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors border-t border-white/5 pt-4">Ver historial</button>
                    </div>
                  )}

                  {/* MESSAGES DROPDOWN */}
                  {activeDropdown === 'msg' && (
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                         <h3 className="text-xs font-black uppercase tracking-widest">Mensajería Directa</h3>
                         <Plus className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>
                      <div className="space-y-3">
                        {[1, 2].map(i => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden shrink-0">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i === 1 ? 'Ana' : 'Bob'}`} alt="Avatar" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-[11px] font-bold truncate">{i === 1 ? 'Ana M. (Lead Designer)' : 'Robert G. (Creative Director)'}</p>
                               <p className="text-[9px] text-gray-500 truncate">{i === 1 ? 'Envié los bocetos actualizados...' : 'Mañana tenemos reunión de equipo.'}</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PROFILE DROPDOWN (Premium Window) */}
                  {activeDropdown === 'profile' && (
                    <div className="p-2">
                       <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-2 relative overflow-hidden">
                          <div className="relative z-10 space-y-1">
                             <h3 className="text-lg font-black italic tracking-tighter uppercase">{user?.user_metadata?.full_name || user?.full_name || 'DIIC User'}</h3>
                             <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest leading-none">
                                {user?.role === 'CLIENT' ? `MARCA: ${user?.user_metadata?.brand || 'DIIC ZONE'}` : `TALENTO: ${user?.role || 'PROF'}`} • {user?.user_metadata?.city || 'Global'}
                             </p>
                             <div className="pt-4 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-white/60" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{user?.role === 'CLIENT' ? 'CLIENTE PRO' : 'COLABORADOR'}</span>
                             </div>
                          </div>
                          {/* Ambient glow */}
                          <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-white/20 blur-2xl rounded-full" />
                       </div>
                       
                       <div className="grid grid-cols-1 gap-1 p-2">
                          <button 
                             onClick={() => { setActiveDropdown(null); router.push('/dashboard/profile'); }}
                             className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white group"
                          >
                             <User className="w-4 h-4 group-hover:text-indigo-400" />
                             <span className="text-[11px] font-bold">{user?.role === 'CLIENT' ? 'Perfil de Empresa' : 'Configuración de Mi Cuenta'}</span>
                          </button>
                          <button 
                             onClick={() => { setActiveDropdown(null); router.push('/dashboard/settings'); }}
                             className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white group"
                          >
                             <Settings className="w-4 h-4 group-hover:text-indigo-400" />
                             <span className="text-[11px] font-bold">Configuración</span>
                          </button>
                          <div className="my-2 border-t border-white/5 h-0" />
                          <button 
                             onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                             className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-rose-500/10 transition-all text-rose-500 group"
                          >
                             <LogOut className="w-4 h-4" />
                             <span className="text-[11px] font-black uppercase tracking-widest">Desconectar Hub</span>
                          </button>
                       </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </header>

      {/* ─── Hero Section (Premium Update) ─── */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 pb-8 relative">
         <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-3">
               <div className={`text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2 px-3 py-1 rounded-full border ${clientData?.status === 'Pausado' ? 'text-amber-500 bg-amber-500/5 border-amber-500/10' : 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-lg ${clientData?.status === 'Pausado' ? 'bg-amber-500' : 'bg-emerald-500'}`} /> 
                  SISTEMA {clientData?.status?.toUpperCase() || 'ACTIVO'}
               </div>
               <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
               </div>
            </div>
            
            <div className="relative">
               <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none select-none">
                  ¡Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-white">{(user?.user_metadata?.full_name || user?.full_name || 'Estratega').split(' ')[0]}</span>.
               </h1>
               {/* Subtle title glow */}
               <div className="absolute -top-4 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
            </div>

            <p className="text-sm md:text-base font-bold text-gray-400 max-w-xl leading-relaxed">
               Bienvenido a tu <span className="text-indigo-400">Ecosistema {clientData?.name || 'Digital'}</span>. Tu centro de mando operativo se encuentra al <span className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">98% de salud total</span>. 
               <span className="text-gray-600 block text-xs mt-1 uppercase tracking-widest font-black">Sincronización de nodos completa.</span>
            </p>
         </div>


      </section>

      {/* ─── Metric Cards ─── */}
      <section className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
         {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </section>

      {/* ─── Main Content Grid ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* Left: Production List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-2">
               <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <h2 className="text-sm font-black text-white uppercase tracking-widest italic">Producción en Curso</h2>
                  <div className="bg-amber-500/10 px-2 py-0.5 rounded text-[8px] font-black text-amber-500 uppercase tracking-widest">Live</div>
               </div>
               <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest cursor-pointer hover:text-white">Ver todo &gt;</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               {production.map((p, i) => <ProductionItem key={i} {...p} />)}
            </div>
         </div>

         {/* Right: Creative Zone */}
         <div className="bg-[#11111d] border border-white/5 rounded-[2.5rem] p-8 space-y-8 h-fit">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                   <h2 className="text-sm font-black text-white uppercase tracking-widest italic">Zona Creativa</h2>
                </div>
                <PieChart className="w-4 h-4 text-gray-600" />
            </div>

            <div className="flex justify-around items-center pt-2">
               <DonutChart value={75} label="Video" color="#6366f1" icon={Video} />
               <DonutChart value={90} label="Diseño" color="#10b981" icon={Palette} />
               <DonutChart value={42} label="Copy" color="#f59e0b" icon={FileText} />
            </div>

            <div className="space-y-6 pt-4">
               {production.slice(0, 3).map((p, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] w-12">{p.icon === Play ? 'Video' : p.icon === Layout ? 'Diseño' : 'Audio'}</p>
                       <span className="text-[11px] font-bold text-gray-300">{p.title}</span>
                    </div>
                    <span className="text-[10px] font-black text-white">{p.progress}%</span>
                 </div>
               ))}
            </div>

            <button className="w-full py-4 mt-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2">
               Ver Zona Creativa <ArrowRight className="w-3 h-3" />
            </button>
         </div>

      </section>

      {/* Background Decor */}
      <div className="fixed -top-40 -left-40 w-[60rem] h-[60rem] bg-indigo-500/5 rounded-full blur-[10rem] -z-10" />
      <div className="fixed -bottom-40 -right-40 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[8rem] -z-10" />

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07070F] flex items-center justify-center text-white font-black tracking-widest uppercase text-[10px] italic animate-pulse">CARGANDO_DASHBOARD...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
