'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const LocationSelector = dynamic(() => import('@/components/shared/Map/LocationSelector'), { ssr: false });
import {
  Bell, MessageSquare, Search, Plus, Activity, 
  CheckCircle2, AlertCircle, Users, Play, 
  Layout, MessageCircle, MoreVertical, 
  ChevronRight, TrendingUp, PieChart, Video, 
  Palette, FileText, ArrowRight, Settings, LogOut, User, Shield,
  Globe, UserPlus, Target, Fingerprint, Building2, Briefcase, Sparkles, MapPin, 
  Upload, HelpCircle
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
import UnifiedMessagingCenter from '../../components/shared/Messaging/UnifiedMessagingCenter';
import { driveService } from '@/services/driveService';
import { toast } from 'sonner';
import { agencyService } from '@/services/agencyService';

// Fallback City Centers for Ecuador
const CITY_COORDS = {
    'QUITO': [-0.1820, -78.4680],
    'GUAYAQUIL': [-2.1710, -79.9224],
    'SANTO DOMINGO': [-0.2520, -79.1730],
    'SANTO DOMINGO ': [-0.2520, -79.1730],
    'MANTA': [-0.9680, -80.7090],
    'CUENCA': [-2.9001, -79.0059],
    'LOJA': [-3.9931, -79.2042],
    'AMBATO': [-1.2491, -78.6168],
    'PORTOVIEJO': [-1.0546, -80.4544],
    'MACHALA': [-3.2581, -79.9553],
    'IBARRA': [0.3517, -78.1222],
    'RIOBAMBA': [-1.6731, -78.6483],
    'ESMERALDAS': [0.9682, -79.6517],
    'QUEVEDO': [-1.0286, -79.4635],
    'LATACUNGA': [-0.9316, -78.6058],
    'TULCAN': [0.8119, -77.7176],
    'TENA': [-0.9938, -77.8129],
    'PUYO': [-1.4821, -77.9991],
    'MACAS': [-2.3087, -78.1114],
    'ZAMORA': [-4.0692, -78.9567],
    'LAGO AGRIO': [0.0847, -76.8828],
    'NUEVA LOJA': [0.0847, -76.8828],
    'COCA': [-0.4667, -76.9833],
    'GUARANDA': [-1.5905, -79.0025],
    'BABAHOYO': [-1.8022, -79.5344],
    'SALINAS': [-2.2170, -80.9585],
    'SANTA ELENA': [-2.2268, -80.8584],
    'OTAVALO': [0.2295, -78.2625],
    'SANGOLQUI': [-0.3306, -78.4398],
    'DAULE': [-1.8622, -79.9790],
    'CHONE': [-0.6981, -80.0936],
    'MILAGRO': [-2.1286, -79.5914],
    'PASAJE': [-3.3255, -79.8066],
    'SANTA ROSA': [-3.4478, -79.9599],
    'LA LIBERTAD': [-2.2310, -80.9117]
};

// Curated Countries List
const COUNTRIES_LIST = ['Ecuador', 'Colombia', 'Perú', 'Estados Unidos', 'España', 'México', 'Chile', 'Argentina', 'Venezuela', 'Panamá'];

// Ecuador Cities List sorted alphabetically
const ECUADOR_CITIES_LIST = [
  'Quito', 'Guayaquil', 'Cuenca', 'Manta', 'Loja', 'Santo Domingo', 
  'Portoviejo', 'Machala', 'Ambato', 'Riobamba', 'Ibarra', 'Quevedo', 
  'Esmeraldas', 'Latacunga', 'Tulcán', 'Tena', 'Puyo', 'Macas', 
  'Zamora', 'Lago Agrio', 'Coca', 'Guaranda', 'Babahoyo', 'Salinas', 
  'Santa Elena', 'Otavalo', 'Sangolquí', 'Daule', 'Chone', 'Milagro', 
  'Pasaje', 'Santa Rosa', 'La Libertad'
].sort();

// Extracts coordinates from a Google Maps URL
const extractCoordsFromUrl = (url) => {
  if (!url) return null;
  try {
    // 1. Check for @lat,lng
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return [parseFloat(atMatch[1]), parseFloat(atMatch[2])];
    }
    
    // 2. Check for query/q parameters
    const queryMatch = url.match(/[?&](?:query|q)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i);
    if (queryMatch) {
      return [parseFloat(queryMatch[1]), parseFloat(queryMatch[2])];
    }
    
    // 3. Check for !3d lat !4d lng (Google Maps internal parameters)
    const dMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (dMatch) {
      return [parseFloat(dMatch[1]), parseFloat(dMatch[2])];
    }
  } catch (e) {
    console.error("Error parsing Google Maps URL:", e);
  }
  return null;
};

// Helper to get coordinates for standard Ecuador cities
const getCoordsForCity = (city) => {
  if (!city) return null;
  const normalized = city.trim().toUpperCase().replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I').replace(/Ó/g, 'O').replace(/Ú/g, 'U');
  return CITY_COORDS[normalized] || null;
};

// Helper to wrap promises with a timeout to prevent hanging UI
const withTimeout = (promise, ms = 8000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("La solicitud al servidor tardó demasiado (Timeout). Revisa tu conexión de red o inténtalo de nuevo.")), ms))
  ]);
};

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
        
        <div className="w-28 h-14 relative group-hover:scale-110 transition-transform duration-500">
           <svg width="100%" height="100%" viewBox="0 0 100 40" className="overflow-visible">
              <motion.path 
                d={chartData} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" 
                className="opacity-20 blur-[6px]"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.path 
                d={chartData} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" 
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
              />
           </svg>
        </div>
      </div>
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

  // Activation Center state
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerSubTab, setDrawerSubTab] = useState('perfil'); // For Drawer 1: perfil / diagnostico
  const [isResolvingUrl, setIsResolvingUrl] = useState(false);

  // Form states for modules
  const [infoForm, setInfoForm] = useState({
    company_name: '', country: 'Ecuador', city: '', address: '', website: '', email: '', phone: '', anniversary_date: '', description: '',
    services_offered: '', main_product: '', time_in_market: '', clients_count: '', team_size: '', revenue: '',
    coords: null
  });

  const [brandForm, setBrandForm] = useState({
    logo: '', primaryColor: '#6366f1', secondaryColor: '#ec4899', typography: 'Inter', brand_manual: ''
  });

  const [socialForm, setSocialForm] = useState({
    facebook: '', instagram: '', tiktok: '', linkedin: '', whatsapp: '', youtube: ''
  });

  const logoInputRef = useRef(null);
  const manualInputRef = useRef(null);

  // Handle role-based redirection as soon as user is loaded
  useEffect(() => {
    if (!authLoading && user) {
        const homeRoute = getHomeRoute(user.role);
        if (homeRoute && homeRoute !== '/dashboard') {
            console.log(`[Dashboard] Redirecting ${user.role} to ${homeRoute}`);
            router.push(homeRoute);
        }
    }
  }, [user, authLoading, router, getHomeRoute]);

  // Fetch client data
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
        const targetClientId = user.client_id || searchParams.get('client');
        
        if (targetClientId) {
            const { data: client, error: clientErr } = await supabase
                .from('clients')
                .select('*')
                .eq('id', targetClientId)
                .single();
            
            if (client) {
                setClientData(client);
                
                // Prefill form states
                const ob = client.onboarding_data || {};
                const cp = ob.company_profile || {};
                const bd = ob.business_diagnosis || {};
                const brand = ob.brand || {};
                const social = ob.social || {};

                setInfoForm({
                  company_name: cp.company_name || client.name || '',
                  country: cp.country || client.country || 'Ecuador',
                  city: cp.city || client.city || '',
                  address: cp.address || client.address || '',
                  website: cp.website || client.website || '',
                  email: cp.email || client.email || '',
                  phone: cp.phone || client.whatsapp_number || '',
                  anniversary_date: cp.anniversary_date || client.birth_date || '',
                  description: cp.description || '',
                  services_offered: bd.services_offered || '',
                  main_product: bd.main_product || '',
                  time_in_market: bd.time_in_market || '',
                  clients_count: bd.clients_count || '',
                  team_size: bd.team_size || '',
                  revenue: bd.revenue || '',
                  coords: cp.coords || client.coords || null
                });

                setBrandForm({
                  logo: brand.logo || '',
                  primaryColor: brand.primaryColor || '#6366f1',
                  secondaryColor: brand.secondaryColor || '#ec4899',
                  typography: brand.typography || 'Inter',
                  brand_manual: brand.brand_manual || ''
                });

                setSocialForm({
                  facebook: social.facebook || '',
                  instagram: social.instagram || '',
                  tiktok: social.tiktok || '',
                  linkedin: social.linkedin || '',
                  whatsapp: social.whatsapp || '',
                  youtube: social.youtube || ''
                });
            }
        }

        // Get Social Analytics
        const { data: social, error: socialErr } = await supabase
            .from('social_analytics')
            .select('*')
            .eq('user_id', user.id);
        
        if (social) setSocialMetrics(social);

        // Get Brand Analytics
        const { data: brand, error: brandErr } = await supabase
            .from('brand_analytics')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (brand) setBrandMetrics(brand);

        // Get Ad Insights
        const { data: insights, error: insightsErr } = await supabase
            .from('insights_daily')
            .select('*')
            .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        
        if (insights) setAdInsights(insights);

        // Get CRM Leads
        const { data: leads, error: leadsErr } = await supabase
            .from('crm_leads')
            .select('*')
            .eq('user_id', user.id);
        
        if (leads) setCrmLeads(leads);

        // Demo fallback
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

  useEffect(() => {
    fetchData();
  }, [user, searchParams]);

  // Google OAuth Redirect scan for Drive Connection
  useEffect(() => {
    const scanForDriveToken = async () => {
        if (!clientData || localStorage.getItem('diic_waiting_drive') !== 'true') return;
        
        const hash = window.location.hash || window.location.search;
        if (hash && (hash.includes('provider_token') || hash.includes('access_token'))) {
            const params = new URLSearchParams(hash.replace('#', '?'));
            const token = params.get('provider_token') || params.get('access_token');
            const refreshToken = params.get('provider_refresh_token') || params.get('refresh_token');
            
            if (token) {
                toast.loading('Google Drive conectado. Configurando carpetas...', { id: 'drive-setup' });
                localStorage.removeItem('diic_waiting_drive');
                window.history.replaceState(null, null, window.location.pathname);
                
                try {
                    const brandName = clientData.name || 'Mi Marca';
                    const driveResult = await driveService.automatedSetup(token, brandName);
                    
                    const updatedOnboardingData = {
                        ...(clientData.onboarding_data || {}),
                        drive_connected: true
                    };
                    
                    await supabase.from('clients').update({
                        google_drive_folder_id: driveResult.rootId,
                        google_access_token: token,
                        google_refresh_token: refreshToken || undefined,
                        google_connected_email: user?.email || '',
                        sync_active: true,
                        onboarding_data: updatedOnboardingData
                    }).eq('id', clientData.id);
                    
                    setClientData(prev => ({
                        ...prev,
                        google_drive_folder_id: driveResult.rootId,
                        google_connected_email: user?.email || '',
                        onboarding_data: updatedOnboardingData
                    }));
                    
                    toast.success('¡Ecosistema Google Drive creado y sincronizado!', { id: 'drive-setup' });
                } catch (e) {
                    console.error(e);
                    toast.error('Error al configurar carpetas: ' + e.message, { id: 'drive-setup' });
                }
            }
        }
    };
    
    if (user && clientData) {
        scanForDriveToken();
    }
  }, [user, clientData]);

  // Checklist Completion Checkers
  const checklistItems = [
    { id: 'info', label: 'Información de empresa', completed: !!clientData?.onboarding_data?.company_profile?.completed },
    { id: 'drive', label: 'Conectar Google Drive', completed: !!clientData?.google_drive_folder_id },
    { id: 'calendar', label: 'Activar Google Calendar', completed: !!clientData?.onboarding_data?.calendar_connected },
    { id: 'logo', label: 'Subir logo', completed: !!clientData?.onboarding_data?.brand?.logo },
    { id: 'visual', label: 'Configurar identidad visual', completed: !!clientData?.onboarding_data?.brand?.completed },
    { id: 'social', label: 'Conectar redes sociales', completed: !!clientData?.onboarding_data?.social?.completed },
    { id: 'growth', label: 'Elegir nivel de crecimiento', completed: !!clientData?.onboarding_data?.growth_level_completed }
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const activationProgress = 20 + Math.round((completedCount / 7) * 80);

  // Remaining days calculation
  const getRemainingDays = () => {
    if (!clientData?.start_date) return 15;
    const trialEndDate = new Date(clientData.start_date);
    const today = new Date();
    const diffTime = trialEndDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

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
  const currentNiche = clientData?.niche || 'other';
  const nicheData = getNicheConfig(currentNiche === 'doctor' || currentNiche === 'health' || currentNiche === 'horeca' || currentNiche === 'legal' || currentNiche === 'agro' ? currentNiche : 'medical');
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

  const handleVerifyMapLink = async () => {
    if (!infoForm.address) return;
    setIsResolvingUrl(true);
    try {
      const res = await fetch('/api/resolve-maps-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: infoForm.address,
          city: infoForm.city,
          country: infoForm.country
        })
      });
      const data = await res.json();
      if (data.success && data.coords) {
        setInfoForm(prev => ({ ...prev, coords: data.coords }));
        toast.success('Ubicación verificada y pin actualizado en el mapa.');
      } else {
        toast.error('No pudimos extraer coordenadas del link de ubicación. Intenta seleccionarlo directamente en el mapa.');
      }
    } catch (e) {
      console.error(e);
      toast.error('Error al verificar el enlace de ubicación.');
    } finally {
      setIsResolvingUrl(false);
    }
  };

  // Save changes to database for a module drawer
  const handleSaveModule = async (moduleId, data) => {
    if (!clientData?.id) return;
    setDrawerLoading(true);
    
    try {
        const updatedOnboardingData = {
            ...(clientData.onboarding_data || {}),
            ...data
        };
        
        const updates = {
            onboarding_data: updatedOnboardingData
        };
        
        if (moduleId === 'info') {
            if (data.company_profile?.company_name) updates.name = data.company_profile.company_name;
            if (data.company_profile?.country) updates.country = data.company_profile.country;
            if (data.company_profile?.city) updates.city = data.company_profile.city;
            if (data.company_profile?.address) updates.address = data.company_profile.address;
            if (data.company_profile?.website) updates.website = data.company_profile.website;
            if (data.company_profile?.email) updates.email = data.company_profile.email;
            if (data.company_profile?.phone) updates.whatsapp_number = data.company_profile.phone;
            
            if (data.company_profile?.anniversary_date) {
                updates.birth_date = data.company_profile.anniversary_date;
            } else {
                updates.birth_date = null;
            }
            
            // Extract coordinates from manual selection or url fallback
            let resolvedCoords = data.company_profile?.coords;
            if (!resolvedCoords && data.company_profile?.address) {
                resolvedCoords = extractCoordsFromUrl(data.company_profile.address);
                if (!resolvedCoords) {
                    // Try geocoding on the fly (first direct, then fallback with city/country)
                    try {
                        const rawQuery = data.company_profile.address;
                        let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(rawQuery)}`, {
                            headers: {
                                'User-Agent': 'DiicZoneApp/1.0 (contact: info@diiczone.com)'
                            }
                        });
                        let resData = await response.json();
                        if (resData && resData.length > 0) {
                            resolvedCoords = [parseFloat(resData[0].lat), parseFloat(resData[0].lon)];
                        } else {
                            const city = data.company_profile.city || '';
                            const country = data.company_profile.country || '';
                            if (city || country) {
                                const combined = `${rawQuery}, ${city}, ${country}`
                                    .replace(/,\s*,/g, ',').trim().replace(/^,|,$/g, '');
                                response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(combined)}`, {
                                    headers: {
                                        'User-Agent': 'DiicZoneApp/1.0 (contact: info@diiczone.com)'
                                    }
                                });
                                resData = await response.json();
                                if (resData && resData.length > 0) {
                                    resolvedCoords = [parseFloat(resData[0].lat), parseFloat(resData[0].lon)];
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Geocoding failed during save:", e);
                    }
                }
            }
            if (!resolvedCoords && data.company_profile?.city) {
                resolvedCoords = getCoordsForCity(data.company_profile.city);
            }
            
            updates.coords = resolvedCoords;
            if (updatedOnboardingData.company_profile) {
                updatedOnboardingData.company_profile.coords = resolvedCoords;
            }
        }
        
        if (moduleId === 'growth') {
            if (data.growth_level?.plan) updates.plan = data.growth_level.plan;
            if (data.growth_level?.price) updates.price = data.growth_level.price;
        }
        
        const { error } = await withTimeout(
            supabase
                .from('clients')
                .update(updates)
                .eq('id', clientData.id),
            8000
        );
            
        if (error) throw error;
        
        // Sync with profiles table to keep both sides completely mirrored
        try {
            await agencyService.syncClientProfile(clientData.id, updates);
        } catch (syncErr) {
            console.error('⚠️ [Sync] Failed to mirror updates to profile:', syncErr);
        }
        
        setClientData(prev => ({
            ...prev,
            ...updates
        }));
        
        toast.success('Cambios guardados con éxito.');
        setActiveDrawer(null);
    } catch (err) {
        console.error('Error saving module:', err);
        toast.error('Error al guardar: ' + err.message);
    } finally {
        setDrawerLoading(false);
    }
  };

  // Google OAuth Flow for Drive
  const handleConnectDrive = async () => {
    try {
        toast.loading('Iniciando conexión con Google...', { id: 'drive-connect' });
        localStorage.setItem('diic_waiting_drive', 'true');
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: window.location.origin + '/dashboard',
                scopes: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
            }
        });
        if (error) throw error;
    } catch (err) {
        toast.error('Error al conectar Google: ' + err.message, { id: 'drive-connect' });
    }
  };

  // Connection for Google Calendar
  const handleConnectCalendar = async () => {
    toast.loading('Activando Google Calendar...', { id: 'calendar-setup' });
    await new Promise(r => setTimeout(r, 1500));
    
    try {
        const updatedOnboardingData = {
            ...(clientData?.onboarding_data || {}),
            calendar_connected: true
        };
        
        await supabase.from('clients').update({
            onboarding_data: updatedOnboardingData
        }).eq('id', clientData.id);
        
        setClientData(prev => ({
            ...prev,
            onboarding_data: updatedOnboardingData
        }));
        
        toast.success('¡Google Calendar activado y sincronizado!', { id: 'calendar-setup' });
        setActiveDrawer(null);
    } catch (e) {
        toast.error('Error al conectar Calendar: ' + e.message, { id: 'calendar-setup' });
    }
  };

  // Logo uploader
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setDrawerLoading(true);
    try {
        await new Promise(r => setTimeout(r, 1200));
        const logoUrl = URL.createObjectURL(file); // fallback URL
        
        const updatedBrand = {
            ...(clientData?.onboarding_data?.brand || {}),
            logo: logoUrl
        };
        
        const updatedOnboardingData = {
            ...(clientData?.onboarding_data || {}),
            brand: updatedBrand
        };
        
        await supabase.from('clients').update({
            onboarding_data: updatedOnboardingData
        }).eq('id', clientData.id);
        
        setClientData(prev => ({
            ...prev,
            onboarding_data: updatedOnboardingData
        }));
        
        setBrandForm(prev => ({ ...prev, logo: logoUrl }));
        toast.success('Logotipo subido con éxito.');
    } catch (err) {
        toast.error('Error al subir logotipo: ' + err.message);
    } finally {
        setDrawerLoading(false);
    }
  };

  // Brand manual uploader
  const handleManualUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setDrawerLoading(true);
    try {
        await new Promise(r => setTimeout(r, 1500));
        const fileUrl = URL.createObjectURL(file);
        
        setBrandForm(prev => ({ ...prev, brand_manual: file.name }));
        toast.success('Manual de marca cargado.');
    } catch (err) {
        toast.error('Error al subir manual: ' + err.message);
    } finally {
        setDrawerLoading(false);
    }
  };

  // Drawer Title Generator
  const getDrawerTitle = (id) => {
    switch (id) {
      case 'info': return 'Perfil Empresarial';
      case 'drive': return 'Google Drive';
      case 'calendar': return 'Google Calendar';
      case 'logo': return 'Logotipo de Marca';
      case 'visual': return 'Identidad Visual';
      case 'social': return 'Canales Digitales';
      case 'growth': return 'Nivel de Crecimiento';
      default: return '';
    }
  };

  const getDrawerSubtitle = (id) => {
    switch (id) {
      case 'info': return 'Información de la empresa y diagnóstico';
      case 'drive': return 'Conecta tu almacenamiento en la nube';
      case 'calendar': return 'Sincroniza tus agendas de trabajo';
      case 'logo': return 'Sube el logo oficial de tu negocio';
      case 'visual': return 'Configura colores y tipografía oficial';
      case 'social': return 'Conecta tus perfiles de redes sociales';
      case 'growth': return 'Selecciona tu nivel de crecimiento digital';
      default: return '';
    }
  };

  // Crecimiento Digital specialized strategies (Módulo 6)
  const renderCrecimientoDigital = () => {
    const niche = clientData?.niche || 'other';
    
    const nicheLabels = {
        'doctor': 'Médico',
        'health': 'Hospitalario',
        'agro': 'Agropecuario',
        'horeca': 'Restaurantes',
        'legal': 'Jurídico',
        'realestate': 'Inmobiliario',
        'education': 'Educación',
        'tech': 'Empresas',
        'other': 'Digital'
    };
    
    const nicheLabel = nicheLabels[niche] || 'Digital';
    const nicheConfigs = {
        'doctor': {
            objective: 'Atraer pacientes recurrentes de alto valor y consolidar la reputación del doctor en su especialidad.',
            strategy: 'Funnel de Captación Médica + Campañas de Google Search para patologías de urgencia + Reels educativos.',
            route: 'Fase 1: Identidad visual médica. Fase 2: Automatización de agenda con IA. Fase 3: Pauta en Meta Ads.',
            indicators: 'Costo de Adquisición de Paciente (CPA), Pacientes Nuevos Mensuales, Tasa de Asistencia a Citas.',
            content: 'Videos explicando tratamientos, testimonios reales de pacientes y tips de prevención en salud.',
            automation: 'Chatbot de WhatsApp integrado a Doctoralia/Calendar para agendamiento autónomo.'
        },
        'health': {
            objective: 'Consolidar el posicionamiento del hospital/clínica y gestionar flujos masivos de agendamiento.',
            strategy: 'Plataforma multi-especialista + SEO local optimizado + Campañas de reputación clínica e instalaciones.',
            route: 'Fase 1: Auditoría web corporativa. Fase 2: Embudo de cotización de cirugías. Fase 3: Branding e impacto local.',
            indicators: 'Retorno de Gasto Publicitario (ROAS), Lead de Consulta Especializada, Retención de Pacientes.',
            content: 'Tour virtual de quirófanos, presentación del staff médico y webinars de especialidades complejas.',
            automation: 'CRM unificado con CRM-Hospital, asignación inteligente de médicos y confirmaciones por SMS.'
        },
        'agro': {
            objective: 'Generar leads B2B calificados, distribuidores y compradores mayoristas para productos agrícolas.',
            strategy: 'Campañas en LinkedIn Ads + Google Search para distribuidores de insumos + Landing de Catálogo.',
            route: 'Fase 1: Catálogo interactivo de productos. Fase 2: Embudo B2B de cotizaciones. Fase 3: Presencia en ferias.',
            indicators: 'Leads Mayoristas Generados, Costo por Lead B2B, Valor de Ciclo del Cliente (LTV).',
            content: 'Casos de éxito de cultivos con el insumo, demostraciones técnicas de maquinaria y reportes de rendimiento.',
            automation: 'Pipeline automático de ventas B2B con recordatorios de re-compra y cotizaciones PDF automáticas.'
        },
        'horeca': {
            objective: 'Incrementar visitas recurrentes al restaurante físico y escalar los pedidos a domicilio.',
            strategy: 'Meta Ads de Geocercas (localizado a 5km) + Campañas de WhatsApp + Colaboración con Foodies.',
            route: 'Fase 1: Menú digital interactivo. Fase 2: Campañas de fin de semana y promociones. Fase 3: Fidelización.',
            indicators: 'Costo por Reservación, Pedidos Delivery, Ticket Promedio por Mesa.',
            content: 'Videos ASMR de preparación de platos, interacción con comensales y dinámicas/promociones semanales.',
            automation: 'Bot de WhatsApp interactivo para visualización de menú, reservación de mesa y facturación instantánea.'
        },
        'legal': {
            objective: 'Posicionar al despacho como la principal opción legal y captar consultas de alta facturación.',
            strategy: 'Google Search Ads de Alta Intención + Artículos de Blog sobre Leyes + Casos de Éxito documentados.',
            route: 'Fase 1: Perfil de socios y biografía. Fase 2: Embudo de consulta exploratoria. Fase 3: Lead Magnets de contratos.',
            indicators: 'Leads Calificados, Costo por Consulta Agendada, Tasa de Conversión de Consulta a Contrato.',
            content: 'Explicación sencilla de reformas legales, tips para proteger empresas y análisis de casos de éxito.',
            automation: 'Envío de contratos de servicios digitales automáticos con firma digital e integración con Google Calendar.'
        },
        'realestate': {
            objective: 'Captar leads interesados en comprar o vender propiedades exclusivas (mercado inmobiliario premium).',
            strategy: 'Campañas de Meta Lead Ads + Fichas Interactivas de Propiedades + Video walkthroughs de alta producción.',
            route: 'Fase 1: Portafolio de propiedades listas. Fase 2: Embudo de pre-calificación crediticia. Fase 3: Retargeting.',
            indicators: 'Leads Inmobiliarios Calificados, Costo por Lead de Propiedad, Citas Agendadas para Visita.',
            content: 'Recorridos de video cinematográficos de propiedades, tips de inversión inmobiliaria y tendencias del mercado.',
            automation: 'Distribución automática de leads a asesores comerciales e integraciones con agendas de visitas.'
        },
        'education': {
            objective: 'Llenar las matrículas de programas, talleres, cursos y carreras educativas.',
            strategy: 'Clase gratuita (Lead Magnet) + Webinars interactivos + Campañas de conversiones con urgencia.',
            route: 'Fase 1: Diseño de la landing de conversión. Fase 2: Embudo del evento gratuito. Fase 3: Pauta en Meta Ads.',
            indicators: 'Estudiantes Inscritos, Costo de Adquisición de Alumno (CAC), Tasa de Asistencia al Webinar.',
            content: 'Extractos de clases presenciales, testimonios de egresados exitosos e infografías educativas.',
            automation: 'Secuencia automática de correos y mensajes de WhatsApp antes, durante y después del webinar.'
        },
        'tech': {
            objective: 'Incrementar las pruebas gratuitas y conversiones de pago para productos tecnológicos y SaaS.',
            strategy: 'Embudo SaaS directo a prueba gratuita + Campañas de remarketing de producto + Contenido comparativo.',
            route: 'Fase 1: Optimización de onboarding de producto. Fase 2: Campañas de paid media. Fase 3: Estrategia de Retención.',
            indicators: 'Registros a prueba (Sign-ups), Conversión de Prueba a Pago, Tasa de Cancelación (Churn Rate).',
            content: 'Tutoriales cortos de uso, animaciones 3D del producto, y comparativas "Nosotros vs Competencia".',
            automation: 'Eventos de uso de app enviados al CRM para lanzar correos personalizados a usuarios inactivos.'
        },
        'other': {
            objective: 'Construir una presencia digital robusta y diseñar canales optimizados de adquisición de clientes.',
            strategy: 'Embudo General de Ventas + Meta Ads + Campaña de Autoridad en Redes Sociales.',
            route: 'Fase 1: Estructura de marca básica. Fase 2: Implementación de CRM básico. Fase 3: Campaña de captación.',
            indicators: 'Visitas web, Leads generados, Costo por Lead total.',
            content: 'Presentación del equipo de trabajo, explicación de los servicios generales y casos prácticos.',
            automation: 'Respuesta automática en redes sociales e integración con base de datos unificada.'
        }
    };
    
    const config = nicheConfigs[niche] || nicheConfigs['other'];
    
    return (
        <section className="relative px-8 py-10 rounded-[3rem] bg-indigo-500/[0.03] border border-indigo-500/10 overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -z-10" />
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Marketing {nicheLabel}</h2>
                    <div className="bg-indigo-500/10 px-2 py-0.5 rounded text-[8px] font-black text-indigo-400 uppercase tracking-widest">Ecosistema {nicheLabel}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-[#0E0E1B] border border-white/5 rounded-2xl space-y-2">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Objetivo</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{config.objective}</p>
                    </div>
                    <div className="p-6 bg-[#0E0E1B] border border-white/5 rounded-2xl space-y-2">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Estrategia</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{config.strategy}</p>
                    </div>
                    <div className="p-6 bg-[#0E0E1B] border border-white/5 rounded-2xl space-y-2">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Ruta de crecimiento</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{config.route}</p>
                    </div>
                    <div className="p-6 bg-[#0E0E1B] border border-white/5 rounded-2xl space-y-2">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Indicadores clave</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{config.indicators}</p>
                    </div>
                    <div className="p-6 bg-[#0E0E1B] border border-white/5 rounded-2xl space-y-2">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Estrategia de Contenido</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{config.content}</p>
                    </div>
                    <div className="p-6 bg-[#0E0E1B] border border-white/5 rounded-2xl space-y-2">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Automatización propuesta</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">{config.automation}</p>
                    </div>
                </div>
            </div>
        </section>
    );
  };

  // Drawer Content Renderer
  const renderDrawerContent = (id) => {
    switch (id) {
      case 'info':
        return (
          <div className="space-y-6">
            <div className="flex bg-[#111126] p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setDrawerSubTab('perfil')}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${drawerSubTab === 'perfil' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Perfil
              </button>
              <button 
                onClick={() => setDrawerSubTab('diagnostico')}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${drawerSubTab === 'diagnostico' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Diagnóstico
              </button>
            </div>

            {drawerSubTab === 'perfil' ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nombre Empresa</label>
                  <input 
                    value={infoForm.company_name}
                    onChange={(e) => setInfoForm({...infoForm, company_name: e.target.value})}
                    className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">País</label>
                    <select 
                      value={COUNTRIES_LIST.includes(infoForm.country) ? infoForm.country : (infoForm.country ? 'Otro' : 'Ecuador')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Otro') {
                          setInfoForm({...infoForm, country: '', city: ''});
                        } else {
                          setInfoForm({...infoForm, country: val, city: ''});
                        }
                      }}
                      className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
                    >
                      {COUNTRIES_LIST.map(c => <option key={c} value={c} className="bg-[#111126] text-white">{c}</option>)}
                      <option value="Otro" className="bg-[#111126] text-white">Otro...</option>
                    </select>
                    {!COUNTRIES_LIST.includes(infoForm.country) && (
                      <div className="mt-2">
                        <input 
                          placeholder="Escribe el país..."
                          value={infoForm.country}
                          onChange={(e) => setInfoForm({...infoForm, country: e.target.value})}
                          className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Ciudad</label>
                    {infoForm.country === 'Ecuador' ? (
                      <>
                        <select 
                          value={ECUADOR_CITIES_LIST.includes(infoForm.city) ? infoForm.city : (infoForm.city ? 'Otro' : '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Otro') {
                              setInfoForm({...infoForm, city: ''});
                            } else {
                              const newCoords = getCoordsForCity(val);
                              setInfoForm({...infoForm, city: val, coords: newCoords});
                            }
                          }}
                          className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
                        >
                          <option value="" disabled className="bg-[#111126] text-white">Selecciona ciudad...</option>
                          {ECUADOR_CITIES_LIST.map(c => <option key={c} value={c} className="bg-[#111126] text-white">{c}</option>)}
                          <option value="Otro" className="bg-[#111126] text-white">Otra ciudad...</option>
                        </select>
                        {(!infoForm.city || !ECUADOR_CITIES_LIST.includes(infoForm.city)) && (
                          <div className="mt-2">
                            <input 
                              placeholder="Escribe la ciudad..."
                              value={infoForm.city}
                              onChange={(e) => setInfoForm({...infoForm, city: e.target.value})}
                              className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <input 
                        placeholder="Escribe la ciudad..."
                        value={infoForm.city}
                        onChange={(e) => setInfoForm({...infoForm, city: e.target.value})}
                        className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Link de Ubicación (Google Maps / Waze)</label>
                  <div className="flex gap-2">
                    <input 
                      placeholder="Ej: https://maps.app.goo.gl/... o https://www.google.com/maps/..."
                      value={infoForm.address}
                      onChange={(e) => setInfoForm({...infoForm, address: e.target.value})}
                      className="flex-1 bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      disabled={isResolvingUrl || !infoForm.address}
                      onClick={handleVerifyMapLink}
                      className="px-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 shrink-0"
                    >
                      {isResolvingUrl ? 'Verificando...' : 'Verificar'}
                    </button>
                  </div>
                  <p className="text-[9px] font-semibold text-gray-500 italic mt-1 leading-normal">
                    Pega el enlace de Google Maps o Waze y presiona verificar para ubicar tu negocio en el mapa.
                  </p>
                </div>

                {/* Selector de Mapa Interactivo */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Ubicación en el Mapa</label>
                  <LocationSelector 
                    value={infoForm.coords}
                    onChange={(coords) => {
                      const [lat, lng] = coords;
                      const generatedLink = `https://www.google.com/maps/place/${lat.toFixed(6)},${lng.toFixed(6)}/@${lat.toFixed(6)},${lng.toFixed(6)},17z`;
                      setInfoForm(prev => ({ 
                        ...prev, 
                        coords, 
                        address: generatedLink 
                      }));
                    }}
                  />
                  <p className="text-[9px] font-semibold text-gray-500 italic mt-1 leading-normal">
                    Puedes hacer clic en el mapa o arrastrar el pin para seleccionar la ubicación exacta de tu negocio. (Opcional)
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Sitio Web</label>
                  <input 
                    value={infoForm.website}
                    onChange={(e) => setInfoForm({...infoForm, website: e.target.value})}
                    className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Correo Empresarial</label>
                  <input 
                    value={infoForm.email}
                    onChange={(e) => setInfoForm({...infoForm, email: e.target.value})}
                    className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Teléfono</label>
                    <input 
                      value={infoForm.phone}
                      onChange={(e) => setInfoForm({...infoForm, phone: e.target.value})}
                      className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Fecha Aniversario</label>
                    <input 
                      type="date"
                      value={infoForm.anniversary_date}
                      onChange={(e) => setInfoForm({...infoForm, anniversary_date: e.target.value})}
                      className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Descripción Empresa</label>
                  <textarea 
                    value={infoForm.description}
                    onChange={(e) => setInfoForm({...infoForm, description: e.target.value})}
                    className="w-full h-24 bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Servicios que Ofrece</label>
                  <textarea 
                    placeholder="Describe los servicios principales..."
                    value={infoForm.services_offered}
                    onChange={(e) => setInfoForm({...infoForm, services_offered: e.target.value})}
                    className="w-full h-20 bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Producto Principal</label>
                  <input 
                    placeholder="Ej: Consultas de Cirugía Plástica"
                    value={infoForm.main_product}
                    onChange={(e) => setInfoForm({...infoForm, main_product: e.target.value})}
                    className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tiempo en Mercado</label>
                    <input 
                      placeholder="Ej: 3 años"
                      value={infoForm.time_in_market}
                      onChange={(e) => setInfoForm({...infoForm, time_in_market: e.target.value})}
                      className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Cantidad de Clientes</label>
                    <input 
                      placeholder="Ej: 150 activos"
                      value={infoForm.clients_count}
                      onChange={(e) => setInfoForm({...infoForm, clients_count: e.target.value})}
                      className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tamaño de Equipo</label>
                    <input 
                      placeholder="Ej: 5 personas"
                      value={infoForm.team_size}
                      onChange={(e) => setInfoForm({...infoForm, team_size: e.target.value})}
                      className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Facturación Aprox.</label>
                    <input 
                      placeholder="Ej: $5,000 / mes"
                      value={infoForm.revenue}
                      onChange={(e) => setInfoForm({...infoForm, revenue: e.target.value})}
                      className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="sticky bottom-0 bg-[#0A0A1F] pt-4 pb-2 mt-6 border-t border-white/5 z-10">
              <button
                onClick={() => handleSaveModule('info', {
                  company_profile: {
                    company_name: infoForm.company_name,
                    country: infoForm.country,
                    city: infoForm.city,
                    address: infoForm.address,
                    website: infoForm.website,
                    email: infoForm.email,
                    phone: infoForm.phone,
                    anniversary_date: infoForm.anniversary_date,
                    description: infoForm.description,
                    coords: infoForm.coords,
                    completed: true
                  },
                  business_diagnosis: {
                    services_offered: infoForm.services_offered,
                    main_product: infoForm.main_product,
                    time_in_market: infoForm.time_in_market,
                    clients_count: infoForm.clients_count,
                    team_size: infoForm.team_size,
                    revenue: infoForm.revenue
                  }
                })}
                disabled={drawerLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {drawerLoading ? 'Guardando...' : 'Guardar Información'}
              </button>
            </div>
          </div>
        );

      case 'drive':
        return (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-[#111126] border border-white/5 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
              <Globe className="w-8 h-8" />
            </div>
            
            <div className="space-y-2 max-w-sm mx-auto">
              <h4 className="text-white font-bold text-sm">Almacenamiento Cloud</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Vincula tu cuenta de Google Drive para crear carpetas inteligentes de entregables, videos, manuales y recursos automáticamente.
              </p>
            </div>

            {clientData?.google_drive_folder_id ? (
              <div className="space-y-4 pt-4">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Ecosistema Drive Sincronizado</span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono break-all bg-black/40 p-3 rounded-xl border border-white/5">
                  ID: {clientData.google_drive_folder_id}
                </p>
                <div className="flex gap-3 pt-2">
                  <a 
                    href={`https://drive.google.com/drive/folders/${clientData.google_drive_folder_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
                  >
                    Abrir Carpeta
                  </a>
                  <button 
                    onClick={async () => {
                      if(confirm("¿Seguro que deseas desvincular Google Drive?")) {
                        setDrawerLoading(true);
                        await supabase.from('clients').update({ google_drive_folder_id: null }).eq('id', clientData.id);
                        setClientData(prev => ({ ...prev, google_drive_folder_id: null }));
                        setDrawerLoading(false);
                        toast.success("Desvinculado con éxito.");
                      }
                    }}
                    className="px-4 py-3 bg-red-900/10 border border-red-500/20 hover:bg-red-900/20 text-red-400 text-xs font-bold rounded-xl"
                  >
                    Desvincular
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <button
                  onClick={handleConnectDrive}
                  disabled={drawerLoading}
                  className="w-full py-4 bg-white hover:bg-gray-100 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {drawerLoading ? 'Conectando...' : 'Conectar Google Drive'}
                </button>
              </div>
            )}
          </div>
        );

      case 'calendar':
        const hasCalendar = clientData?.onboarding_data?.calendar_connected;
        return (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-[#111126] border border-white/5 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
              <Plus className="w-8 h-8" />
            </div>
            
            <div className="space-y-2 max-w-sm mx-auto">
              <h4 className="text-white font-bold text-sm">Calendario Comercial</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Sincroniza tus eventos, filmaciones y reuniones directamente con Google Calendar para mantener al día a tu equipo.
              </p>
            </div>

            {hasCalendar ? (
              <div className="space-y-4 pt-4">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Google Calendar Activo</span>
                </div>
                <button 
                  onClick={async () => {
                    setDrawerLoading(true);
                    const updated = { ...(clientData.onboarding_data || {}), calendar_connected: false };
                    await supabase.from('clients').update({ onboarding_data: updated }).eq('id', clientData.id);
                    setClientData(prev => ({ ...prev, onboarding_data: updated }));
                    setDrawerLoading(false);
                    toast.success("Desactivado con éxito.");
                  }}
                  className="w-full py-3 bg-red-900/10 border border-red-500/20 hover:bg-red-900/20 text-red-400 text-xs font-bold rounded-xl"
                >
                  Desactivar Sincronización
                </button>
              </div>
            ) : (
              <div className="pt-6">
                <button
                  onClick={handleConnectCalendar}
                  disabled={drawerLoading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {drawerLoading ? 'Sincronizando...' : 'Activar Sincronización'}
                </button>
              </div>
            )}
          </div>
        );

      case 'logo':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-[#111126] border border-white/5 rounded-2xl text-center space-y-4 relative">
              {brandForm.logo ? (
                <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden border border-white/10 flex items-center justify-center bg-black/40">
                  <img src={brandForm.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  <button 
                    onClick={() => setBrandForm(prev => ({ ...prev, logo: '' }))}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md text-[8px] font-black"
                  >
                    ELIMINAR
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="w-32 h-32 mx-auto rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 cursor-pointer transition-colors"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-[10px] font-black uppercase">Subir Logo</span>
                </div>
              )}
              <input 
                type="file" 
                ref={logoInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleLogoUpload}
              />
              <p className="text-[10px] text-gray-500">Formato PNG transparente recomendado.</p>
            </div>

            <div className="sticky bottom-0 bg-[#0A0A1F] pt-4 pb-2 mt-6 border-t border-white/5 z-10">
              <button
                onClick={() => handleSaveModule('logo', {
                  brand: {
                    ...(clientData?.onboarding_data?.brand || {}),
                    logo: brandForm.logo
                  }
                })}
                disabled={drawerLoading || !brandForm.logo}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {drawerLoading ? 'Guardando...' : 'Confirmar Logotipo'}
              </button>
            </div>
          </div>
        );

      case 'visual':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Color Principal</label>
                <div className="flex gap-2 items-center bg-[#111126] border border-white/5 rounded-xl p-3">
                  <input 
                    type="color" 
                    value={brandForm.primaryColor}
                    onChange={(e) => setBrandForm({...brandForm, primaryColor: e.target.value})}
                    className="w-8 h-8 border-none bg-transparent cursor-pointer rounded"
                  />
                  <span className="text-xs font-bold text-white uppercase">{brandForm.primaryColor}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Color Secundario</label>
                <div className="flex gap-2 items-center bg-[#111126] border border-white/5 rounded-xl p-3">
                  <input 
                    type="color" 
                    value={brandForm.secondaryColor}
                    onChange={(e) => setBrandForm({...brandForm, secondaryColor: e.target.value})}
                    className="w-8 h-8 border-none bg-transparent cursor-pointer rounded"
                  />
                  <span className="text-xs font-bold text-white uppercase">{brandForm.secondaryColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tipografía Principal</label>
              <select 
                value={brandForm.typography}
                onChange={(e) => setBrandForm({...brandForm, typography: e.target.value})}
                className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Inter">Inter</option>
                <option value="Outfit">Outfit</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Manual de Marca (PDF/Doc)</label>
              <div 
                onClick={() => manualInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-indigo-500 cursor-pointer transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <span className="text-xs text-gray-400 font-bold">
                  {brandForm.brand_manual || 'Haz clic para subir tu manual de marca'}
                </span>
              </div>
              <input 
                type="file" 
                ref={manualInputRef} 
                className="hidden" 
                accept=".pdf,.doc,.docx"
                onChange={handleManualUpload}
              />
            </div>

            <div className="sticky bottom-0 bg-[#0A0A1F] pt-4 pb-2 mt-6 border-t border-white/5 z-10">
              <button
                onClick={() => handleSaveModule('visual', {
                  brand: {
                    ...(clientData?.onboarding_data?.brand || {}),
                    primaryColor: brandForm.primaryColor,
                    secondaryColor: brandForm.secondaryColor,
                    typography: brandForm.typography,
                    brand_manual: brandForm.brand_manual,
                    completed: true
                  }
                })}
                disabled={drawerLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {drawerLoading ? 'Guardando...' : 'Confirmar Identidad Visual'}
              </button>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Instagram</label>
                <input 
                  placeholder="https://instagram.com/tu_marca"
                  value={socialForm.instagram}
                  onChange={(e) => setSocialForm({...socialForm, instagram: e.target.value})}
                  className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Facebook</label>
                <input 
                  placeholder="https://facebook.com/tu_marca"
                  value={socialForm.facebook}
                  onChange={(e) => setSocialForm({...socialForm, facebook: e.target.value})}
                  className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">TikTok</label>
                <input 
                  placeholder="https://tiktok.com/@tu_marca"
                  value={socialForm.tiktok}
                  onChange={(e) => setSocialForm({...socialForm, tiktok: e.target.value})}
                  className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">LinkedIn</label>
                <input 
                  placeholder="https://linkedin.com/company/tu_marca"
                  value={socialForm.linkedin}
                  onChange={(e) => setSocialForm({...socialForm, linkedin: e.target.value})}
                  className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">WhatsApp Business</label>
                <input 
                  placeholder="Ej: +593987654321"
                  value={socialForm.whatsapp}
                  onChange={(e) => setSocialForm({...socialForm, whatsapp: e.target.value})}
                  className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">YouTube</label>
                <input 
                  placeholder="https://youtube.com/@tu_marca"
                  value={socialForm.youtube}
                  onChange={(e) => setSocialForm({...socialForm, youtube: e.target.value})}
                  className="w-full bg-[#111126] border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#0A0A1F] pt-4 pb-2 mt-6 border-t border-white/5 z-10">
              <button
                onClick={() => handleSaveModule('social', {
                  social: {
                    ...socialForm,
                    completed: true
                  }
                })}
                disabled={drawerLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {drawerLoading ? 'Guardando...' : 'Confirmar Canales'}
              </button>
            </div>
          </div>
        );

      case 'growth':
        const levels = [
          { name: 'Presencia Digital', price: 250, desc: 'Ideal para iniciar la digitalización de tu consultorio o marca. CRM + Pauta Básica.' },
          { name: 'Crecimiento', price: 500, desc: 'Expansión de canales y automatizaciones avanzadas. Recomendado para marcas medianas.' },
          { name: 'Autoridad', price: 700, desc: 'Posicionamiento estratégico, pauta optimizada y contenido multiplataforma Premium.' },
          { name: 'Escalamiento', price: 1000, desc: 'Estrategia omnicanal masiva, embudos avanzados e integraciones profundas.' },
          { name: 'Dominio de Mercado', price: 'Personalizado', desc: 'Desarrollo corporativo customizado con soporte prioritario 24/7.' }
        ];
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              {levels.map((lvl) => {
                const isSelected = clientData?.plan === lvl.name;
                return (
                  <div
                    key={lvl.name}
                    onClick={() => handleSaveModule('growth', {
                      growth_level: {
                        plan: lvl.name,
                        price: lvl.price
                      },
                      growth_level_completed: true
                    })}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/10 border-indigo-500 shadow-md'
                        : 'bg-[#111126] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-white uppercase tracking-wider">{lvl.name}</span>
                      <span className="text-xs font-black text-indigo-400">
                        {typeof lvl.price === 'number' ? `$${lvl.price}/mes` : lvl.price}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{lvl.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden bg-transparent">
      
      {/* ─── Floating Brand Identity ─── */}
      <div className="fixed top-8 left-8 z-[100] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-black italic text-xl shadow-2xl">D</div>
          <span className="text-xl font-black tracking-tight text-white hidden md:block italic uppercase drop-shadow-lg">DIIC <span className="text-gray-500">ZONE</span></span>
      </div>

      <div className="p-6 md:p-10 pt-24 md:pt-32 space-y-12">
      
      {isStaff ? (
        <section className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-gradient-to-br from-[#0A0A1F] to-[#050510] shadow-2xl">
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
                    ¡Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-white">{(user?.user_metadata?.brand || user?.user_metadata?.full_name || user?.full_name || 'Estratega').replace(/[-_\s]+workspace\s*$/i, '').trim()}</span>.
                 </h1>
                 <div className="absolute -top-4 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
              </div>

              <p className="text-sm md:text-base font-bold text-gray-400 max-w-xl leading-relaxed">
                 Bienvenido a tu <span className="text-indigo-400">Ecosistema {clientData?.name || 'Digital'}</span>. Tu marca se encuentra en un estado de <span className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">crecimiento constante</span>. 
                 <span className="text-gray-600 block text-xs mt-1 uppercase tracking-widest font-black">Revisa tus últimos activos y reportes debajo.</span>
              </p>

              {/* Warning Notification for missing Location/Coordinates */}
              {(!clientData?.coords || !clientData?.address) && (
                  <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-[2rem] bg-amber-500/[0.03] border border-amber-500/20 backdrop-blur-xl relative overflow-hidden w-full max-w-3xl"
                  >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] pointer-events-none" />
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                           <MapPin className="w-6 h-6 animate-bounce" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-xs font-black text-white uppercase tracking-wider italic">Falta Registrar Ubicación</h4>
                           <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                              Aún no has registrado tu dirección exacta. Por favor, completa tu información para ubicarte en el mapa de operaciones de DIIC ZONE.
                           </p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setActiveDrawer('info')}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-[9px] tracking-widest rounded-xl transition-all shadow-lg shrink-0"
                     >
                        Completar Ubicación
                     </button>
                  </motion.div>
              )}
           </div>
        </section>
      )}

      {/* ─── ACTIVATION CENTER WIDGET (NEW V2) ─── */}
      {!isStaff && activationProgress < 100 && (
          <section className="relative p-8 md:p-10 rounded-[3rem] bg-indigo-500/[0.03] border border-indigo-500/20 overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px] -z-10" />
              
              <div className="flex flex-col lg:flex-row justify-between gap-8 items-start relative z-10">
                  <div className="space-y-4 max-w-lg">
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Cuenta Activa</span>
                      </div>
                      
                      <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Bienvenido a DIIC ZONE</h2>
                      <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase tracking-wider">Tu cuenta está activa.</p>
                      
                      <div className="bg-[#0A0A12]/80 border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-6 max-w-sm">
                          <div>
                              <p className="text-[8px] font-black text-gray-500 uppercase tracking-wider">Prueba gratuita</p>
                              <p className="text-xs font-black text-indigo-400">{getRemainingDays()} días restantes</p>
                          </div>
                          <div>
                              <p className="text-[8px] font-black text-gray-500 uppercase tracking-wider">Costo Mensual</p>
                              <p className="text-xs font-black text-white">$70 / mes (Uso de App)</p>
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 w-full space-y-6">
                      <div className="flex justify-between items-end">
                          <div>
                              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Centro de Activación</h3>
                              <p className="text-xs text-gray-500">Completa tu entorno de trabajo corporativo</p>
                          </div>
                          <div className="flex items-end gap-0.5 font-mono">
                              <span className="text-3xl font-black text-white leading-none">{activationProgress}</span>
                              <span className="text-indigo-400 text-xs font-black">%</span>
                          </div>
                      </div>

                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                          <motion.div 
                              className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-emerald-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${activationProgress}%` }}
                              transition={{ duration: 0.8 }}
                          />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {checklistItems.map((item) => (
                              <button
                                  key={item.id}
                                  onClick={() => {
                                      if (item.id === 'drive' && !item.completed) {
                                          handleConnectDrive();
                                      } else if (item.id === 'calendar' && !item.completed) {
                                          handleConnectCalendar();
                                      } else {
                                          setActiveDrawer(item.id);
                                      }
                                  }}
                                  className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                                      item.completed
                                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                          : 'bg-white/[0.01] border-white/5 text-gray-400 hover:bg-white/[0.03] hover:border-white/10 hover:text-white'
                                  }`}
                              >
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                                      item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/10'
                                  }`}>
                                      {item.completed ? '✓' : ''}
                                  </div>
                                  <span className="text-xs font-bold truncate">{item.label}</span>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </section>
      )}

      {/* ─── Metric Cards ─── */}
      <section className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
         {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </section>

      {/* ─── Specialized Niche Growth Strategy (NEW V2 - Módulo 6) ─── */}
      {!isStaff && renderCrecimientoDigital()}

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
            <div className="h-full">
                <SocialFeedPreview 
                    connected={socialMetrics && socialMetrics.length > 0} 
                    platform="instagram" 
                />
            </div>

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

      {/* ─── Gallery Area ─── */}
      {!isStaff && (
          <section className="mb-12 mt-10">
              <GalleryPreview />
          </section>
      )}

      {/* Background Decor */}
      <div className="fixed -top-40 -left-40 w-[60rem] h-[60rem] bg-indigo-500/5 rounded-full blur-[10rem] -z-10" />
      <div className="fixed -bottom-40 -right-40 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[8rem] -z-10" />

      </div>

      {/* ─── ACTIVATION DRAWER PANEL ─── */}
      <AnimatePresence>
          {activeDrawer && (
              <>
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setActiveDrawer(null)}
                      className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
                  />
                   <motion.div
                       initial={{ x: '100%' }}
                       animate={{ x: 0 }}
                       exit={{ x: '100%' }}
                       transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                       className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#0A0A1F] border-l border-white/10 p-8 z-50 flex flex-col justify-between"
                   >
                       <div className="flex flex-col flex-1 min-h-0">
                           <div className="flex justify-between items-center pb-6 border-b border-white/5 flex-shrink-0">
                               <div>
                                   <h3 className="text-xl font-black text-white italic uppercase tracking-tight">
                                       {getDrawerTitle(activeDrawer)}
                                   </h3>
                                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">
                                       {getDrawerSubtitle(activeDrawer)}
                                   </p>
                               </div>
                               <button
                                   onClick={() => setActiveDrawer(null)}
                                   className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-mono text-sm"
                               >
                                   ✕
                               </button>
                           </div>

                           <div className="flex-1 overflow-y-auto py-8 pr-1 custom-scrollbar min-h-0 relative z-0">
                               {renderDrawerContent(activeDrawer)}
                           </div>
                       </div>
                       
                       <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-gray-600 uppercase tracking-widest flex-shrink-0">
                           <span>DIIC ZONE v2.0</span>
                           <span>CENTRO_DE_ACTIVACION</span>
                       </div>
                   </motion.div>
              </>
          )}
      </AnimatePresence>
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
