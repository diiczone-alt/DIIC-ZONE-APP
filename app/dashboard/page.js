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
  Palette, FileText, ArrowRight, Settings, LogOut, User, Shield,
  Globe, UserPlus, Target, Fingerprint, Building2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import StrategyPlanner from '../../components/shared/Strategy/StrategyPlanner';
import { googleDriveService } from '@/services/googleDriveService';
import SocialFeedPreview from '../../components/dashboard/SocialFeedPreview';
import AdPerformanceCard from '../../components/dashboard/AdPerformanceCard';
import ActionProtocol from '../../components/growth/ActionProtocol';
import { getNicheConfig } from '../../components/growth/nicheConfig';
import GalleryPreview from '../../components/dashboard/GalleryPreview';

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

// ─── Brand Identity Sidebar (Client Version) ────────────────────



// ─── Reverted Dashboard Content ──────────────────────────────────
function DashboardContent() {
  const { user, loading: authLoading, getHomeRoute } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  
  const [clientData, setClientData] = useState(null);
  const [socialMetrics, setSocialMetrics] = useState(null);
  const [brandMetrics, setBrandMetrics] = useState(null);
  const [adInsights, setAdInsights] = useState([]);
  const [crmLeads, setCrmLeads] = useState([]);
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

            // 3. Get Social Analytics
            const { data: social, error: socialErr } = await supabase
                .from('social_analytics')
                .select('*')
                .eq('user_id', user.id);
            
            if (social) setSocialMetrics(social);

            // 4. Get Brand Analytics
            const { data: brand, error: brandErr } = await supabase
                .from('brand_analytics')
                .select('*')
                .eq('user_id', user.id)
                .single();
            
            if (brand) setBrandMetrics(brand);

            // 5. Get Ad Insights
            const { data: insights, error: insightsErr } = await supabase
                .from('insights_daily')
                .select('*')
                .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
            
            if (insights) setAdInsights(insights);

            // 6. Get CRM Leads
            const { data: leads, error: leadsErr } = await supabase
                .from('crm_leads')
                .select('*')
                .eq('user_id', user.id);
            
            if (leads) setCrmLeads(leads);

            // 7. NEW: Integration Check - Force Jessica Data if empty (Demo Mode)
            if (!socialMetrics || socialMetrics.length === 0) {
                const { MOCK_DATA } = require('@/lib/mockData');
                setSocialMetrics(MOCK_DATA.social_analytics.filter(s => s.user_id === 'jessica_user_id'));
                setBrandMetrics(MOCK_DATA.brand_analytics.find(b => b.user_id === 'jessica_user_id'));
                setAdInsights(MOCK_DATA.insights_daily);
                setCrmLeads(MOCK_DATA.crm_leads);
            }

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user, searchParams]);

  // Helper to format large numbers
  const formatValue = (val) => {
    if (!val) return '0';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();
  };

  // Dynamic Stats calculation
  const totalInteractions = socialMetrics?.reduce((acc, curr) => acc + (curr.total_interactions || 0), 0) || 0;
  const totalAudience = socialMetrics?.reduce((acc, curr) => acc + (curr.followers_count || 0), 0) || 0;
  
  // Niche Config for guidance
  const currentNiche = clientData?.niche || 'medical';
  const nicheData = getNicheConfig(currentNiche);
  const levelKeys = ['presencia', 'crecimiento', 'autoridad', 'sistemas', 'escala'];
  const currentLevelKey = levelKeys[(brandMetrics?.current_level || 2) - 1];

  // Commercial Analytics
  const totalSpend = adInsights?.reduce((acc, curr) => acc + Number(curr.spend || 0), 0) || 0;
  const totalConversions = adInsights?.reduce((acc, curr) => acc + (curr.conversions || 0), 0) || 0;
  const cpa = totalConversions > 0 ? (totalSpend / totalConversions).toFixed(2) : '0.00';
  const totalNewLeads = crmLeads?.length || 0;

  const stats = [
    { 
        title: clientData?.industry?.includes('Médico') || clientData?.industry?.includes('Urología') ? 'Captación de Pacientes' : 'Captación de Leads', 
        value: totalNewLeads.toString(), 
        delta: '+18.5%', 
        icon: UserPlus, 
        color: '#10b981', 
        chartData: "M 0,40 Q 30,15 60,35 T 100,5" 
    },
    { 
        title: clientData?.industry?.includes('Médico') || clientData?.industry?.includes('Urología') ? 'Costo por Paciente' : 'Costo por Lead', 
        value: `$${cpa}`, 
        delta: '-4.2%', 
        icon: Target, 
        color: '#f59e0b', 
        chartData: "M 0,20 Q 25,35 50,15 T 100,25" 
    },
    { 
        title: 'En Producción', 
        value: production.length.toString(), 
        delta: 'Al día', 
        icon: AlertCircle, 
        color: '#6366f1', 
        chartData: "M 0,25 Q 30,5 60,35 T 100,20" 
    },
    { 
        title: 'Audiencia Total', 
        value: totalAudience > 0 ? formatValue(totalAudience) : '0', 
        delta: totalAudience > 0 ? '+3.2%' : 'Pendiente', 
        icon: Users, 
        color: '#ec4899', 
        chartData: totalAudience > 0 ? "M 0,40 Q 40,30 70,10 T 100,5" : "M 0,20 L 100,20" 
    }
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

  const isStaff = user?.role === 'CM' || user?.role === 'COMMUNITY' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen text-white p-6 md:p-10 pt-16 md:pt-20 space-y-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden bg-transparent">
      
      {/* ─── Role-Based Main Module ─── */}
      {isStaff ? (
        <section className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-[#0A0A1F] to-[#050510] shadow-2xl">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
            <StrategyPlanner activeCampaign={{ name: clientData?.name || 'DIIC Global', progress: 94 }} />
        </section>
      ) : (
        <section className="flex flex-col md:flex-row justify-between items-end gap-6 pb-8 relative pt-4">
           <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3">
                 <div className={`text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2 px-3 py-1 rounded-full border ${clientData?.status === 'Pausado' ? 'text-amber-500 bg-amber-500/5 border-amber-500/10' : 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-lg ${clientData?.status === 'Pausado' ? 'bg-amber-500' : 'bg-emerald-500'}`} /> 
                    NODO CLIENTE {clientData?.status?.toUpperCase() || 'ACTIVO'}
                 </div>
                 <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
                 </div>
              </div>
              
              <div className="relative">
                 <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none select-none">
                    ¡Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-white">{user?.user_metadata?.brand || (user?.user_metadata?.full_name || user?.full_name || 'Estratega').split(' ')[0]}</span>.
                 </h1>
                 <div className="absolute -top-4 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
              </div>

              <p className="text-sm md:text-base font-bold text-gray-400 max-w-xl leading-relaxed">
                 Bienvenido a tu <span className="text-indigo-400">Ecosistema {clientData?.name || 'Digital'}</span>. Tu marca se encuentra en un estado de <span className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">crecimiento constante</span>. 
                 <span className="text-gray-600 block text-xs mt-1 uppercase tracking-widest font-black">Revisa tus últimos activos y reportes debajo.</span>
              </p>
           </div>
           
           {/* Identity Panel Removed as per feedback */}
        </section>
      )}

      {/* ─── Metric Cards ─── */}
      <section className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
         {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </section>

      {/* ─── Connectivity & Storage Section (NEW) ─── */}
      {!isStaff && (
          <section className="relative px-8 py-10 rounded-[3rem] bg-indigo-500/[0.03] border border-indigo-500/10 overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10" />
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                  <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                          <Globe className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Espacio de Almacenamiento</h3>
                          <p className="text-sm text-gray-500 font-bold">
                              {clientData?.google_connected_email 
                                ? `Sincronizado con: ${clientData.google_connected_email}` 
                                : 'Tu almacenamiento en Google Drive no está vinculado aún.'}
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-4">
                      {clientData?.google_connected_email ? (
                          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Nube Activa</span>
                          </div>
                      ) : (
                          <button 
                            onClick={async () => {
                                // Logic to trigger Google Auth handled by AuthContext
                                window.location.href = '/login'; 
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3"
                          >
                            <UserPlus className="w-4 h-4" /> Relacionar Google Drive
                          </button>
                      )}
                      
                      <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-lg shadow-indigo-600/20">
                          <Settings className="w-4 h-4" /> Configurar Sincronización
                      </button>
                  </div>
              </div>
          </section>
      )}

      {/* ─── Strategic Protocol Section ─── */}
      <section className="mb-10 px-2">
         <ActionProtocol 
            protocols={nicheData.dailyProtocols} 
            level={currentLevelKey}
            role="CLIENT"
            onComplete={(id) => console.log('Tarea completada:', id)}
         />
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

         {/* Row 3: Insights 360 (Social + Ads) */}
         <section className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Left: Social Feed */}
            <div className="h-full">
                <SocialFeedPreview 
                    connected={socialMetrics && socialMetrics.length > 0} 
                    platform="instagram" 
                />
            </div>

            {/* Right: Ads Performance */}
            <div className="h-full">
                <AdPerformanceCard 
                    campaigns={Object.values(adInsights?.reduce((acc, curr) => {
                        const campId = curr.campaign_id;
                        if (!acc[campId]) {
                            acc[campId] = { 
                                id: campId, 
                                name: campId === 'camp_001' ? (clientData?.industry?.includes('Médico') ? 'Captación Medicina Estética' : 'Campaña de Ventas') : (clientData?.industry?.includes('Médico') ? 'Branding Nova Clínica' : 'Autoridad de Marca'),
                                objective: campId === 'camp_001' ? 'Conversiones (WhatsApp)' : 'Alcance',
                                spend: 0, clicks: 0, conversions: 0, budget_daily: campId === 'camp_001' ? 25 : 10
                            };
                        }
                        acc[campId].spend += Number(curr.spend || 0);
                        acc[campId].clicks += (curr.clicks || 0);
                        acc[campId].conversions += (curr.conversions || 0);
                        return acc;
                    }, {}))}
                />
            </div>
         </section>

      </section>

      {/* ─── Gallery Area (Restored) ─── */}
      {!isStaff && (
          <section className="mb-12 mt-10">
              <GalleryPreview />
          </section>
      )}

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
