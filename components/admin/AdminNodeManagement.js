'use client';
import Link from 'next/link';

import { useState, useEffect, useMemo, useRef } from 'react';
import { agencyService } from '@/services/agencyService';
import { supabase } from '@/lib/supabase';
import {
    MapPin, Globe, Users,
    FileText, TrendingUp, BarChart3,
    ArrowUpRight, Building2, Phone,
    Mail, Calendar, ShieldCheck,
    Search, Filter, LayoutGrid,
    Briefcase, Zap, Star,
    MousePointer2, Network, Video,
    Camera, Truck, UploadCloud,
    ArrowRight, ChevronRight,
    Trophy, AlertTriangle, DollarSign,
    CheckCircle2, XCircle, HandCoins,
    Gem, Activity, ShieldAlert, AlertCircle,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminNodeManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [activeView, setActiveView] = useState('map'); // 'map', 'workflow', 'economics'
    const [branchOffices, setBranchOffices] = useState([]);
    const [clients, setClients] = useState([]);
    const [fullTeam, setFullTeam] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const isMounted = useRef(true);

    const [isAddingCity, setIsAddingCity] = useState(false);
    const [newCityName, setNewCityName] = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [citySuggestions] = useState([
        "Santo Domingo", "Quito", "Guayaquil", "Cuenca", "Manta", 
        "Portoviejo", "Loja", "Ambato", "Esmeraldas", "Quevedo",
        "Machala", "Durán", "Ibarra", "Riobamba"
    ]);

    const loadAllData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setIsSyncing(true);
        try {
            const [branches, teamData, clientData, txData] = await Promise.all([
                agencyService.getBranchOffices(),
                agencyService.getTeam(),
                agencyService.getClients(),
                agencyService.getTransactions()
            ]);
            
            if (isMounted.current) {
                setBranchOffices(branches || []);
                setFullTeam(teamData || []);
                setClients(clientData || []);
                setTransactions(txData || []);
                
                // Persistence
                localStorage.setItem('diic_node_cache', JSON.stringify({
                    branches, teamData, clientData, txData
                }));
            }
        } catch (err) {
            console.error("Error loading HQ Control data:", err);
            if (!isBackground) toast.error("Error sincronizando el Centro de Control");
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setIsSyncing(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;

        // 1. Instant Cache Load
        const cached = localStorage.getItem('diic_node_cache');
        if (cached) {
            try {
                const { branches, teamData, clientData, txData } = JSON.parse(cached);
                setBranchOffices(branches || []);
                setFullTeam(teamData || []);
                setClients(clientData || []);
                setTransactions(txData || []);
                setLoading(false);
            } catch (e) {
                console.warn("Node Cache invalid");
            }
        }

        // 2. Background Sync
        loadAllData(!!cached);

        // 3. Realtime Listeners
        const nodeChannel = supabase
            .channel('node-management-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'branch_offices' }, () => loadAllData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => loadAllData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team' }, () => loadAllData(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => loadAllData(true))
            .subscribe();

        return () => {
            isMounted.current = false;
            supabase.removeChannel(nodeChannel);
        };
    }, []);

    // Calcular nodos dinámicamente basados en datos reales y sincronización financiera
    const nodes = useMemo(() => {
        return branchOffices.map(branch => {
            const cityClients = clients.filter(c => c.city?.toLowerCase() === branch.city?.toLowerCase());
            const cityTeam = fullTeam.filter(m => m.city?.toLowerCase() === branch.city?.toLowerCase());
            
            // 1. FACTURACIÓN (MRR)
            const revenue = cityClients.reduce((acc, c) => acc + (Number(c.price) || 0), 0);
            
            // 2. GASTO OPERATIVO: Nómina Local + Fee de Producción (25%) + Gastos Directos
            const payroll = cityTeam.reduce((acc, m) => acc + (Number(m.salary) || 0), 0);
            const productionFee = revenue * 0.25;
            
            // Buscar gastos reales vinculados a clientes de esta ciudad
            const cityClientIds = cityClients.map(c => c.id);
            const cityExpenses = transactions
                .filter(tx => tx.type === 'expense' && cityClientIds.includes(tx.reference_id))
                .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
            
            const totalOpEx = payroll + productionFee + cityExpenses;
            
            // 3. MARGEN
            const margin = revenue - totalOpEx;
            const marginPct = revenue > 0 ? (margin / revenue) * 100 : 0;

            const creativesCount = cityTeam.filter(m => 
                ['filmmaker', 'editor de video', 'diseñador'].includes(m.role?.toLowerCase())
            ).length;

            return {
                ...branch,
                id: branch.id,
                city: branch.city,
                name: branch.name || `Nodo ${branch.city}`,
                director: branch.director || "Asignación Pendiente",
                status: branch.status || "active",
                level: branch.level || "basico",
                creatives: creativesCount,
                activeProjects: cityClients.filter(c => c.status === 'active').length,
                monthlyRevenue: revenue,
                monthlyOpEx: totalOpEx,
                monthlyMargin: margin,
                marginPercentage: marginPct,
                health: branch.health || 100,
                team: cityTeam.map(m => m.name),
                clients: cityClients, // NUEVO: Lista completa de empresas
                reputation: {
                    puntuality: branch.reputation_puntual || 95,
                    quality: branch.reputation_quality || 90,
                    uploads: branch.reputation_uploads || 100,
                    clientSat: branch.reputation_sat || 98
                }
            };
        });
    }, [branchOffices, clients, fullTeam, transactions]);

    const handleAddCity = async (name) => {
        const targetCity = name || newCityName;
        if (!targetCity.trim()) {
            toast.error("Selecciona o ingresa una ciudad");
            return;
        }

        if (branchOffices.find(b => b.city?.toLowerCase() === targetCity.toLowerCase())) {
            toast.error("Esta ciudad ya tiene un nodo activo");
            return;
        }

        try {
            // Sincronizado con esquema REAL (uuid, city, name, director, status, level)
            const newBranch = {
                city: targetCity,
                name: `Nodo expansion ${targetCity}`,
                director: "Pendiente",
                status: "active",
                level: "basico"
            };

            const createdBranch = await agencyService.createBranchOffice(newBranch);
            
            // Si el servicio no retorna el objeto (mock), usamos el local con ID temporal
            const finalBranch = createdBranch || { ...newBranch, id: `temp-${Date.now()}` };
            
            setBranchOffices(prev => [...prev, finalBranch]);
            setIsAddingCity(false);
            setNewCityName('');
            setShowCityDropdown(false);
            toast.success(`Nodo ${targetCity} activado correctamente.`, {
                description: "Iniciando fase de expansión territorial."
            });
        } catch (err) {
            console.error("Error opening node:", err);
            toast.error("Error al aperturar nueva ciudad", {
                description: "Conflicto de esquema detectado. Reintentando con parámetros base..."
            });
        }
    };

    const handleAssignMember = async (memberId, targetCity) => {
        try {
            await agencyService.updateTeamMember(memberId, { city: targetCity });
            setFullTeam(prev => prev.map(m => m.id === memberId ? { ...m, city: targetCity } : m));
            toast.success("Personal asignado a Sede Operativa");
        } catch (error) {
            console.error(error);
            toast.error("Error al asignar talento");
        }
    };

    const handleUnassignMember = async (memberId) => {
        try {
            await agencyService.updateTeamMember(memberId, { city: "Remoto" }); 
            setFullTeam(prev => prev.map(m => m.id === memberId ? { ...m, city: "Remoto" } : m));
            toast.success("Talento desvinculado de la sede");
        } catch (error) {
            console.error(error);
            toast.error("Error al desvincular");
        }
    };

    const handleAssignDirector = async (nodeId, memberName) => {
        try {
            if(agencyService.updateBranchOffice) {
                await agencyService.updateBranchOffice(nodeId, { director: memberName });
            }
            setBranchOffices(prev => prev.map(b => b.id === nodeId ? { ...b, director: memberName } : b));
            toast.success("Director de Sede Actualizado");
        } catch (error) {
            console.error(error);
            toast.error("Error al asignar director");
        }
    };

    const handleAssignClient = async (clientId, targetCity) => {
        try {
            await agencyService.updateClient(clientId, { city: targetCity });
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, city: targetCity } : c));
            setBranchOffices(prev => [...prev]); // force refresh
            toast.success("Empresa añadida a la sede");
        } catch (error) {
            console.error(error);
            toast.error("Error al asignar empresa");
        }
    };

    const handleUnassignClient = async (clientId) => {
        try {
            await agencyService.updateClient(clientId, { city: "Remoto" });
            setClients(prev => prev.map(c => c.id === clientId ? { ...c, city: "Remoto" } : c));
            setBranchOffices(prev => [...prev]); // force refresh
            toast.success("Empresa removida de la sede");
        } catch (error) {
            console.error(error);
            toast.error("Error al desvincular empresa");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            {/* NODE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                    {isSyncing ? (
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                            <Activity className="w-3 h-3" /> HQ LIVE SYNC
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" /> SIEMPRE CONECTADO
                        </div>
                    )}
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <MapPin className="w-8 h-8 text-indigo-500" /> Red de Nodos Locales
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Infraestructura Operativa de Expansión Territorial</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                        <TabBtn active={activeView === 'map'} icon={Globe} onClick={() => setActiveView('map')} label="Ranking Glocal" />
                        <TabBtn active={activeView === 'workflow'} icon={Network} onClick={() => setActiveView('workflow')} label="Flujo de Producción" />
                        <TabBtn active={activeView === 'economics'} icon={HandCoins} onClick={() => setActiveView('economics')} label="Modelo Económico" />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeView === 'map' ? (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
                    >
                        {/* NODE GRID */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {nodes.map((node) => (
                                <NodeCard
                                    key={node.id}
                                    data={node}
                                    onClick={() => setSelectedNode(node)}
                                    isSelected={selectedNode?.id === node.id}
                                    onDelete={async () => {
                                        if (confirm(`¿Eliminar nodo ${node.city}?`)) {
                                            await agencyService.deleteBranchOffice(node.id);
                                            setBranchOffices(prev => prev.filter(b => b.id !== node.id));
                                        }
                                    }}
                                />
                            ))}
                            <div 
                                onClick={() => setIsAddingCity(true)}
                                className="border-2 border-dashed border-white/5 rounded-[40px] p-8 flex flex-col items-center justify-center text-center group hover:border-indigo-500/30 transition-all cursor-pointer bg-white/[0.01]"
                            >
                                <div className="p-4 rounded-full bg-white/5 group-hover:bg-indigo-500/10 transition-all mb-4">
                                    <PlusIcon className="w-8 h-8 text-gray-500 group-hover:text-indigo-400" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Aperturar Ciudad</h4>
                                <p className="text-[10px] text-gray-600 mt-1 uppercase font-black tracking-widest text-indigo-400/50">Expansión 2026</p>
                            </div>
                        </div>

                        {/* MODAL APERTURA */}
                        <AnimatePresence>
                            {isAddingCity && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                                >
                                    <motion.div 
                                        initial={{ scale: 0.9, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-10 w-full max-w-md shadow-2xl relative"
                                    >
                                        <button onClick={() => setIsAddingCity(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white">
                                            <XCircle className="w-6 h-6" />
                                        </button>

                                        <h3 className="text-2xl font-black text-white mb-2">Aperturar Sede</h3>
                                        <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest font-black">Expansión Territorial DIIC ZONE</p>

                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2 relative">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Seleccionar Ciudad</label>
                                                    <div className="relative">
                                                        <input 
                                                            autoFocus
                                                            type="text" 
                                                            value={newCityName}
                                                            onFocus={() => setShowCityDropdown(true)}
                                                            onChange={(e) => {
                                                                setNewCityName(e.target.value);
                                                                setShowCityDropdown(true);
                                                            }}
                                                            placeholder="Escribe para buscar..."
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-700 outline-none focus:border-indigo-500 transition-all font-bold"
                                                        />
                                                        {newCityName && (
                                                            <button 
                                                                onClick={() => { setNewCityName(''); setShowCityDropdown(true); }}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <AnimatePresence>
                                                        {showCityDropdown && (
                                                            <motion.div 
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F1A] border border-white/10 rounded-2xl p-4 z-50 shadow-2xl max-h-[250px] overflow-y-auto custom-scrollbar"
                                                            >
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {citySuggestions
                                                                        .filter(c => c.toLowerCase().includes(newCityName.toLowerCase()))
                                                                        .map((city, i) => (
                                                                            <button
                                                                                key={i}
                                                                                onClick={() => {
                                                                                    setNewCityName(city);
                                                                                    setShowCityDropdown(false);
                                                                                }}
                                                                                className="text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all group"
                                                                            >
                                                                                <p className="text-[11px] font-black text-gray-400 group-hover:text-white uppercase transition-colors">{city}</p>
                                                                                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Ecuador</p>
                                                                            </button>
                                                                        ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-white/5">
                                                <button 
                                                    onClick={() => handleAddCity()}
                                                    disabled={!newCityName}
                                                    className={`w-full font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group ${
                                                        newCityName 
                                                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20' 
                                                        : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                                    }`}
                                                >
                                                    Confirmar Apertura
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* NODE PANEL (DETAILS) */}
                        <div className="space-y-6 relative z-30">
                            {selectedNode ? (
                                <NodeFocusPanel 
                                    node={selectedNode} 
                                    team={fullTeam}
                                    allClients={clients}
                                    onAssign={handleAssignMember}
                                    onUnassign={handleUnassignMember}
                                    onAssignDirector={(name) => handleAssignDirector(selectedNode.id, name)}
                                    onAssignClient={handleAssignClient}
                                    onUnassignClient={handleUnassignClient}
                                />
                            ) : (
                                <div className="bg-[#0A0A12] border border-white/5 rounded-[40px] p-10 flex flex-col items-center justify-center text-center opacity-40 h-full min-h-[400px]">
                                    <MapPin className="w-12 h-12 text-gray-600 mb-4" />
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Seleccionar Nodo Local</h3>
                                    <p className="text-[10px] text-gray-600 mt-2">Monitorea la ejecución territorial de DIIC ZONE</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : activeView === 'workflow' ? (
                    <motion.div
                        key="workflow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#0A0A12] border border-white/10 rounded-[40px] p-12 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Network className="w-96 h-96 text-indigo-500" />
                        </div>

                        <h3 className="text-2xl font-black text-white mb-12 flex items-center gap-4">
                            <Zap className="w-8 h-8 text-yellow-500" /> Flujo de Producción Territorial
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                            <FlowStep n="1" icon={Calendar} title="Agenda Cliente" desc="El sistema detecta la ciudad y tipo de servicio." color="blue" />
                            <FlowStep n="2" icon={MapPin} title="Detección Ciudad" desc="Asignación automática al nodo local certificado." color="indigo" />
                            <FlowStep n="3" icon={AlertCircle} title="Alerta Nodo" desc="Nodo recibe orden de producción en su ciudad." color="indigo" highlight={true} />
                            <FlowStep n="4" icon={Camera} title="Grabación Local" desc="Ejecución de rodaje y captura de activos fisicos." color="emerald" />
                            <FlowStep n="5" icon={UploadCloud} title="Carga Material" desc="Nodo sube BRUTO para auditoría técnica inmediata." color="pink" />
                            <FlowStep n="6" icon={Activity} title="Post-Prod Central" desc="Equipo DIIC central edita y automatiza piezas." color="purple" />
                            <FlowStep n="7" icon={CheckCircle2} title="Aprobación" desc="Validación final bajo estándares DIIC ZONE." color="emerald" />
                            <FlowStep n="8" icon={ArrowRight} title="Entrega" desc="Envío final al ecosistema digital del cliente." color="blue" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="economics"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-[40px] p-10">
                            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-emerald-500" /> Modelo Económico de Expansión
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <EconomicCard label="Cliente Paga" value="100%" desc="DIIC ZONE Central" color="white" />
                                <EconomicCard label="Pago a Nodo" value="Local Fee" desc="Solo ejecución física" color="indigo" />
                                <EconomicCard label="DIIC Margin" value="Retención" desc="Margen + Post-Prod" color="emerald" />
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Ejemplo de Distribución</h4>
                                <ComparisonRow service="Pack 4 Reels" client="$240" node="$45" diic="$195" />
                                <ComparisonRow service="Video Médico" client="$350" node="$60" diic="$290" />
                                <ComparisonRow service="Campaña Premium" client="$1.2k" node="$250" diic="$950" />
                            </div>
                        </div>

                        <div className="bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] p-10">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-400" /> Blindaje de Marca
                            </h4>
                            <div className="space-y-8">
                                <BlindajeItem title="Propiedad Intelectual" desc="Todos los brutos grabados por el nodo pertenecen a DIIC ZONE desde el minuto 1." />
                                <BlindajeItem title="Exclusividad Regional" desc="El nodo no puede prestar servicios similares fuera del ecosistema DIIC." />
                                <BlindajeItem title="Auditoría de Equipo" desc="Mantenimiento de cámaras y luces verificado trimestralmente." />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, icon: Icon, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Icon className="w-4 h-4" /> {label}
        </button>
    );
}

function NodeCard({ data, onClick, isSelected, onDelete }) {
    const levels = {
        premium: { label: "Premium", icon: Gem, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
        operativo: { label: "Operativo", icon: Award, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
        basico: { label: "Básico", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        observation: { label: "Observación", icon: ShieldAlert, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
    };

    const lvl = levels[data.level === 'basico' && data.status === 'observation' ? 'observation' : data.level] || levels.basico;
    const LvlIcon = lvl.icon;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={onClick}
            className={`bg-[#0A0A12] border rounded-[40px] p-8 cursor-pointer transition-all relative overflow-hidden group ${isSelected ? 'border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'border-white/10 hover:border-white/20'}`}
        >
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{data.city}</h3>
                        {isSelected && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                className="p-1 hover:text-red-500 text-gray-700 transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border ${lvl.bg} ${lvl.color} w-fit`}>
                        <LvlIcon className="w-3 h-3" /> {lvl.label}
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-2xl font-black ${data.health > 85 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {data.health}%
                    </div>
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Salud Operativa</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6 relative border-t border-white/5 pt-6">
                <MiniBar label="Calidad de Captura" value={data.reputation?.quality || 90} color="indigo" />
                <MiniBar label="Puntualidad" value={data.reputation?.puntuality || 95} color="blue" />
            </div>

            {/* --- CARTERA DE EMPRESAS (NUEVO: ALL CLIENTS) --- */}
            <div className="mb-6 space-y-2">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-indigo-400" /> Cartera de Empresas
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-[60px] overflow-y-auto custom-scrollbar pr-2">
                    {data.clients && data.clients.length > 0 ? data.clients.map((client, idx) => (
                        <div 
                            key={idx}
                            title={`${client.name} - ${client.plan || 'Plan Individual'}`}
                            className="bg-indigo-500/5 border border-indigo-500/20 px-2.5 py-1 rounded-lg text-[9px] font-black text-white hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all cursor-default"
                        >
                            {client.name}
                        </div>
                    )) : (
                        <p className="text-[9px] text-gray-700 italic font-bold">Sin empresas asignadas</p>
                    )}
                </div>
            </div>

            <div className="space-y-4 relative border-t border-white/5 pt-6">
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-left">
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Facturado</div>
                        <div className="text-sm font-black text-white">${data.monthlyRevenue.toLocaleString()}</div>
                    </div>
                    <div className="text-center border-l border-white/5">
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Egreso</div>
                        <div className="text-sm font-black text-rose-500/80">${data.monthlyOpEx.toLocaleString()}</div>
                    </div>
                    <div className="text-right border-l border-white/5">
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Margen</div>
                        <div className={`text-sm font-black ${data.monthlyMargin >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                            {data.monthlyMargin >= 0 ? '+' : ''}{Math.round(data.marginPercentage)}%
                        </div>
                    </div>
                </div>

                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(0, Math.min(100, data.marginPercentage))}%` }}
                        className={`h-full rounded-full ${data.monthlyMargin >= 0 ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mt-6 text-[10px] font-black uppercase text-gray-500 tracking-tighter">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> {data.creatives} Creativos
                </div>
                <div className={`px-3 py-1 rounded-lg border ${data.monthlyMargin > 0 ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                    ${data.monthlyMargin.toLocaleString()} <span className="opacity-60 ml-1">Utilidad</span>
                </div>
            </div>
        </motion.div>
    );
}

function MiniBar({ label, value, color }) {
    const colors = {
        indigo: "bg-indigo-500",
        blue: "bg-blue-500"
    };
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[8px] font-black uppercase text-gray-500">
                <span>{label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${colors[color]} rounded-full shadow-[0_0_5px_rgba(99,102,241,0.5)]`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

function NodeFocusPanel({ node, team, allClients, onAssign, onUnassign, onAssignDirector, onAssignClient, onUnassignClient }) {
    const [assigningRole, setAssigningRole] = useState(null); // 'estratega', 'cm', 'creative', 'director', 'client'

    // Filtrar equipo local por ciudad y rol
    const localTeam = useMemo(() => {
        return team.filter(m => m.city?.toLowerCase() === node.city?.toLowerCase());
    }, [team, node.city]);

    const strategist = localTeam.find(m => m.role?.toLowerCase().includes('estrateg') || m.role?.toLowerCase().includes('manager'));
    const cm = localTeam.find(m => m.role?.toLowerCase() === 'community manager' || m.role?.toLowerCase().includes('cm'));
    const creatives = localTeam.filter(m => 
        ['filmmaker', 'editor de video', 'diseñador'].includes(m.role?.toLowerCase())
    );

    // Filter available records for the modal based on what role is being assigned
    const availablePool = useMemo(() => {
        if(!assigningRole) return [];
        
        if (assigningRole === 'client') {
            return (allClients || []).filter(c => c.city?.toLowerCase() !== node.city?.toLowerCase());
        }

        return team.filter(m => {
            const r = (m.role || '').toLowerCase();
            // Ya están asignados a nosotros
            if (m.city?.toLowerCase() === node.city?.toLowerCase()) return false;
            
            if (assigningRole === 'estratega') return r.includes('estrateg') || r.includes('manager');
            if (assigningRole === 'cm') return r === 'community manager' || r.includes('cm') || r.includes('content');
            if (assigningRole === 'creative') return r.includes('film') || r.includes('editor') || r.includes('diseña');
            if (assigningRole === 'director') return true; // anyone can be a node director conceptually, or filter by seniors
            return false;
        });
    }, [team, allClients, assigningRole, node.city]);

    return (
        <div className="bg-[#0A0A12] border border-indigo-500/20 rounded-[40px] p-8 lg:p-10 relative overflow-hidden h-full z-40">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Building2 className="w-32 h-32" />
            </div>

            <div className="relative mb-10 text-left">
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{node.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">Sede Regional {node.city}</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-gray-400">
                        <Activity className="w-3 h-3 text-emerald-400" /> ONLINE
                    </div>
                </div>
            </div>

            <div className="space-y-6 mb-10">
                {/* ROL: ESTRATEGA */}
                <div className="space-y-3 relative z-10">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">
                        <span className="flex items-center gap-2"><Zap className="w-3 h-3 text-yellow-500" /> Estrategia Maestra</span>
                        {!strategist && (
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('estratega'); }} 
                                className="flex items-center gap-1 text-[9px] text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/50 cursor-pointer pointer-events-auto"
                            >
                                + Añadir
                            </button>
                        )}
                    </p>
                    {strategist ? (
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-white/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-black">
                                    {strategist.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase">{strategist.name}</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase">{strategist.role}</p>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnassign(strategist.id); }} 
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white cursor-pointer pointer-events-auto" title="Desvincular"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('estratega'); }} 
                            className="p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:bg-white/10 transition-colors pointer-events-auto"
                        >
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">+ Asignar Estratega</p>
                        </div>
                    )}
                </div>

                {/* ROL: COMMUNITY MANAGER */}
                <div className="space-y-3 relative z-10">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">
                        <span className="flex items-center gap-2"><Users className="w-3 h-3 text-indigo-500" /> Gestión de Comunidad</span>
                        {!cm && (
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('cm'); }} 
                                className="flex items-center gap-1 text-[9px] text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/50 cursor-pointer pointer-events-auto"
                            >
                                + Añadir
                            </button>
                        )}
                    </p>
                    {cm ? (
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-white/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-black">
                                    {cm.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase">{cm.name}</p>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase">Community Manager Certificado</p>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnassign(cm.id); }} 
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white cursor-pointer pointer-events-auto" title="Desvincular"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('cm'); }} 
                            className="p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:bg-white/10 transition-colors pointer-events-auto"
                        >
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">+ Asignar CM</p>
                        </div>
                    )}
                </div>

                {/* ROL: CÉLULA CREATIVA */}
                <div className="space-y-3 relative z-10">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">
                        <span className="flex items-center gap-2"><Video className="w-3 h-3 text-pink-500" /> Célula Creativa Local</span>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('creative'); }} 
                            className="flex items-center gap-1 text-[9px] text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/50 cursor-pointer pointer-events-auto"
                        >
                            + Añadir
                        </button>
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {creatives.length > 0 ? creatives.map((member, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group transition-all hover:bg-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center text-[10px] font-black">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-white uppercase">{member.name}</p>
                                        <p className="text-[8px] text-gray-600 uppercase font-black">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[7px] font-black uppercase">
                                        {member.status || 'Activo'}
                                    </div>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnassign(member.id); }} 
                                        className="p-1.5 bg-red-500/10 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white cursor-pointer pointer-events-auto" title="Expulsar de célula"
                                    >
                                        <XCircle className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('creative'); }} 
                                className="p-8 bg-indigo-500/5 border border-dashed border-indigo-500/10 rounded-3xl text-center group cursor-pointer hover:bg-indigo-500/10 transition-all pointer-events-auto"
                            >
                                <PlusIcon className="w-5 h-5 text-indigo-500/50 mx-auto mb-2 group-hover:text-indigo-400 transition-colors pointer-events-none" />
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest pointer-events-none mb-1">Iniciar Reclutamiento</p>
                                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest pointer-events-none">Vincular talento creativo local</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- CARTERA DE CLIENTES --- */}
                <div className="space-y-4 pt-6 border-t border-white/5 relative z-10 text-left">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center justify-between">
                        <span className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-400" /> Cartera de Clientes</span>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('client'); }} 
                            className="flex items-center gap-1 text-[9px] text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/50 cursor-pointer pointer-events-auto"
                        >
                            + Añadir
                        </button>
                    </p>
                    <div className="grid grid-cols-1 gap-2 max-h-[340px] overflow-y-auto custom-scrollbar pr-2">
                        {node.clients && node.clients.length > 0 ? (
                            node.clients.map((client, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-indigo-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black border border-blue-500/20">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-white uppercase">{client.name}</p>
                                            <p className="text-[8px] text-gray-500 font-bold uppercase">{client.industry || client.business_type || 'Empresa'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-emerald-400 tracking-tighter">${(Number(client.price) || 0).toLocaleString()}</p>
                                            <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Aporte</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Link 
                                                href={`/dashboard/strategy?client=${client.id}`}
                                                className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-md hover:bg-indigo-500 hover:text-white transition-all cursor-pointer pointer-events-auto"
                                                title="Ver Pizarra Estratgica"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Network className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUnassignClient(client.id); }} 
                                                className="p-1.5 bg-red-500/10 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white cursor-pointer pointer-events-auto" title="Quitar Cliente"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('client'); }} 
                                className="p-10 bg-blue-500/5 border border-dashed border-blue-500/20 rounded-[32px] text-center group cursor-pointer hover:bg-blue-500/10 transition-all pointer-events-auto flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-blue-500/5"
                            >
                                <Globe className="w-6 h-6 text-blue-500/40 mb-3 group-hover:scale-110 group-hover:text-blue-400 transition-all" />
                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest pointer-events-none mb-1">+ Asignar Empresa</p>
                                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest pointer-events-none italic">Sede sin cartera de clientes activa</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/5">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-1">Facturación</p>
                        <p className="text-sm font-black text-white">${node.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center">
                        <p className="text-[7px] font-black text-rose-500/60 uppercase tracking-widest mb-1">Gastos Op.</p>
                        <p className="text-sm font-black text-rose-400">${node.monthlyOpEx.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                        <p className="text-[7px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Margen Neto</p>
                        <p className="text-sm font-black text-emerald-400">${node.monthlyMargin.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4 relative z-10">
                <p className="text-left text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                    Director de Nodo
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAssigningRole('director'); }} 
                        className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/50 hover:bg-indigo-500 hover:text-white transition-all cursor-pointer pointer-events-auto"
                    >
                        + Modificar
                    </button>
                </p>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-[24px] border border-white/5 group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                            {node.director ? node.director.substring(0, 1) : '?'}
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-black text-white uppercase">{node.director || "PENDIENTE"}</div>
                            <div className="text-[9px] text-gray-500 font-bold uppercase">Gestor Regional Certificado</div>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        {node.director && node.director !== "Pendiente" && (
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAssignDirector("Pendiente"); }} 
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-auto" title="Remover Director"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        )}
                        <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>

            {/* ASSIGNMENT MODAL OVERLAY */}
            <AnimatePresence>
                {assigningRole && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-[#0A0A12]/95 backdrop-blur-md flex flex-col p-8"
                    >
                        <button onClick={() => setAssigningRole(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                            <XCircle className="w-6 h-6" />
                        </button>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Asignar Talento</h3>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-6">Puesto: {assigningRole}</p>
                        
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {availablePool.length > 0 ? availablePool.map((m, i) => (
                                <div key={m.id || i} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                                            {m.name.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-white uppercase">{m.name}</p>
                                            <p className="text-[9px] text-gray-400 uppercase">{(m.role || m.industry || 'Perfil')}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault(); e.stopPropagation();
                                            if (assigningRole === 'director') {
                                                onAssignDirector(m.name);
                                            } else if (assigningRole === 'client') {
                                                onAssignClient(m.id, node.city);
                                            } else {
                                                onAssign(m.id, node.city);
                                            }
                                            setAssigningRole(null);
                                        }} 
                                        className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20 pointer-events-auto"
                                    >
                                        Seleccionar
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <p className="text-sm font-bold text-gray-400">No hay personal libre con este perfil</p>
                                    <p className="text-[10px] text-gray-600 mt-2">Todos los talentos de este rol ya están asignados a esta u otra sede, o no existen en la base.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

function FlowStep({ n, icon: Icon, title, desc, color, highlight }) {
    const colors = {
        blue: "text-blue-400 border-blue-400/20 bg-blue-500/5",
        indigo: "text-indigo-400 border-indigo-400/20 bg-indigo-500/5",
        emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-500/5",
        pink: "text-pink-400 border-pink-400/20 bg-pink-500/5",
        purple: "text-purple-400 border-purple-400/20 bg-purple-500/5"
    };

    return (
        <div className={`p-8 rounded-[32px] border transition-all relative text-center group ${colors[color]} ${highlight ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105 z-20 bg-black/40' : 'hover:bg-white/[0.02]'}`}>
            <span className="absolute top-4 left-4 text-[40px] font-black opacity-5 pointer-events-none">{n}</span>
            <div className="inline-flex p-5 rounded-full bg-[#0A0A12] border border-inherit mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-3 leading-tight">{title}</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed font-bold">{desc}</p>
        </div>
    );
}

function EconomicCard({ label, value, desc, color }) {
    const colors = {
        white: "text-white border-white/10 bg-white/5",
        indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
    };
    return (
        <div className={`p-6 rounded-[32px] border text-center ${colors[color]}`}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">{label}</p>
            <p className="text-2xl font-black mb-1">{value}</p>
            <p className="text-[10px] font-bold opacity-40 uppercase">{desc}</p>
        </div>
    );
}

function ComparisonRow({ service, client, node, diic }) {
    return (
        <div className="flex justify-between items-center p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 transition-all">
            <span className="text-xs font-black text-white uppercase w-1/3">{service}</span>
            <div className="flex gap-8 text-right">
                <div>
                    <p className="text-[8px] font-black text-gray-500 uppercase">Cliente</p>
                    <p className="text-sm font-bold text-white">{client}</p>
                </div>
                <div>
                    <p className="text-[8px] font-black text-indigo-400 uppercase">Nodo</p>
                    <p className="text-sm font-bold text-indigo-400">{node}</p>
                </div>
                <div>
                    <p className="text-[8px] font-black text-emerald-400 uppercase">DIIC</p>
                    <p className="text-sm font-bold text-emerald-400">{diic}</p>
                </div>
            </div>
        </div>
    );
}

function BlindajeItem({ title, desc }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
                <CheckCircle2 className="w-4 h-4" />
                <h5 className="text-[10px] font-black uppercase tracking-widest">{title}</h5>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed font-bold ml-6">{desc}</p>
        </div>
    );
}

function StatBlock({ label, value, color }) {
    const colors = {
        indigo: "text-indigo-400 bg-indigo-400/10",
        amber: "text-amber-400 bg-amber-400/10"
    };
    return (
        <div className={`p-4 rounded-2xl ${colors[color]} text-center border border-white/5`}>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">{label}</p>
            <p className="text-xs font-black">{value}</p>
        </div>
    );
}

function PlusIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M12 5v14" /></svg>
    );
}
