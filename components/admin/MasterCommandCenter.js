'use client';
import { useState, useEffect } from 'react';
import { agencyService } from '@/services/agencyService';
import {
    Activity, Users, TrendingUp, DollarSign,
    AlertTriangle, Video, Layers, Award,
    BarChart3, User, Globe, Search, MoreVertical,
    Clock, CheckCircle, XCircle, ShieldCheck,
    Building2, Smartphone, Cpu, MapPin, BookOpen,
    ShieldAlert, Flame, Zap, BrainCircuit, Compass, Package, Calculator, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AdminFinancialCore from './AdminFinancialCore';
import AdminRiskControl from './AdminRiskControl';
import AdminOperationsCore from './AdminOperationsCore';
import AdminTeamReputation from './AdminTeamReputation';
import AdminQualityControl from './AdminQualityControl';
import AdminNodeManagement from './AdminNodeManagement';
import AdminDocumentation from './AdminDocumentation';
import AdminNodeTraining from './AdminNodeTraining';
import AdminContinuousImprovement from './AdminContinuousImprovement';
import AdminBusinessIntelligence from './AdminBusinessIntelligence';
import AdminMasterIntelligence from './AdminMasterIntelligence';
import AdminCapacitySystem from './AdminCapacitySystem';
import AdminDynamicPricing from './AdminDynamicPricing';
import AdminClientEvolution from './AdminClientEvolution';
import AdminOperationalGovernance from './AdminOperationalGovernance';
import AdminDualAudit from './AdminDualAudit';



export default function MasterCommandCenter() {
    const [clients, setClients] = useState([]);
    const [operationalData, setOperationalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('global');

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                setLoading(true);
                const [clientsData, intelligence] = await Promise.all([
                    agencyService.getClients(),
                    agencyService.getOperationalIntelligence()
                ]);
                setClients(clientsData);
                setOperationalData(intelligence);
            } catch (err) {
                console.error("MasterCommandCenter: Error fetching real data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMasterData();
    }, []);

    const handleFeatureClick = (feature) => {
        toast.info(`Accediendo a: ${feature}`, {
            description: "Esta sección está conectada al núcleo del sistema.",
            position: "top-center"
        });
    };

    const productionStats = operationalData?.productionStats || {
        editing: 0,
        design: 0,
        shooting: 0,
        bottlenecks: 0
    };

    const team = operationalData?.team || [];

    return (
        <div className="space-y-8 pb-20 p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Activity className="w-8 h-8 text-indigo-500" /> Centro de Comando
                    </h1>
                    <p className="text-gray-400">Visión Global de DIIC ZONE</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl mr-4 overflow-x-auto max-w-full md:max-w-none">
                        <button
                            onClick={() => setView('global')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'global' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Vista Global
                        </button>
                        <button
                            onClick={() => {
                                setView('finance');
                                toast.success("Accediendo a Finanzas Globales", { description: "Solo personal con nivel de acceso Admin Central." });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'finance' ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Finanzas Globales
                        </button>
                        <button
                            onClick={() => {
                                setView('risk');
                                toast.success("Accediendo a Gestión de Riesgos", { description: "Panel de Dirección Estratégica activo." });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'risk' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Gestión de Riesgos
                        </button>
                        <button
                            onClick={() => {
                                setView('governance');
                                toast.success("Accediendo a Gobernanza Operativa", { description: "Control total de tasas y costos activo." });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'governance' ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-400 border border-indigo-500/20 bg-indigo-500/10'}`}
                        >
                            Gobernanza
                        </button>
                        <button
                            onClick={() => {
                                setView('operations');
                                toast.success("Accediendo a Operaciones Globales", { description: "Control de Producción y Calidad." });
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'operations' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Operaciones Globales
                        </button>
                        <button
                            onClick={() => {
                                setView('team');
                                handleFeatureClick('Gestión de Talento');
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'team' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Gestión de Talento
                        </button>
                    </div>
                    <StatusBadge label="Sistemas Activos" status="online" />
                    <StatusBadge label="Alertas" count={operationalData?.risks?.length || 0} status={operationalData?.risks?.length > 0 ? 'alert' : 'online'} />
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <AnimatePresence mode="wait">
                {view === 'global' ? (
                    <motion.div
                        key="global"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        {/* 1. GLOBAL KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <KPICard icon={Users} title="Clientes Activos" value={clients.filter(c => c.status === 'active').length} sub={`${clients.length} totales`} color="indigo" />
                            <KPICard icon={Zap} title="Carga Global" value={`${operationalData?.globalMetrics?.globalLoad || 0}%`} sub="Promedio del Staff" color={operationalData?.globalMetrics?.globalLoad > 80 ? 'red' : 'emerald'} />
                            <KPICard icon={AlertTriangle} title="Amenazas" value={operationalData?.risks?.filter(r => r.severity === 'critical').length || 0} sub="Incidentes Críticos" color="red" />
                            <KPICard icon={DollarSign} title="Ingreso Mensual" value={`$${clients.reduce((acc, c) => acc + (Number(c.price) || 0), 0).toLocaleString()}`} sub="Facturación Proyectada" color="indigo" />
                        </div>

                        {/* 2. STRATEGIC MODULES (REDUNDANT NAV) */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <PillarCard
                                title="Finanzas"
                                desc="Flujo y Utilidad"
                                icon={DollarSign}
                                color="emerald"
                                onClick={() => setView('finance')}
                            />
                            <PillarCard
                                title="Riesgos"
                                desc="Centro de Rescate"
                                icon={ShieldAlert}
                                color="red"
                                onClick={() => setView('risk')}
                            />
                            <PillarCard
                                title="Operaciones"
                                desc="Producción Real"
                                icon={Activity}
                                color="blue"
                                onClick={() => setView('operations')}
                            />
                            <PillarCard
                                title="Equipo"
                                desc="Reputación & Carga"
                                icon={Award}
                                color="purple"
                                onClick={() => setView('team')}
                            />
                            <PillarCard
                                title="Capacidad"
                                desc="Límite TCS"
                                icon={Package}
                                color="blue"
                                onClick={() => setView('capacity')}
                            />
                            <PillarCard
                                title="Sedes"
                                desc="Vigilancia Nodos"
                                icon={MapPin}
                                color="indigo"
                                onClick={() => setView('nodes')}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* 2. CLIENT MAP */}
                            <div className="lg:col-span-2 bg-[#0A0A12] border border-white/10 rounded-3xl p-6">
                                <div className="flex justify-between items-center mb-6 text-left">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-indigo-400" /> Mapa de Clientes (LIVE)
                                    </h3>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Filtrar base..." className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-300 outline-none focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-5 text-xs font-bold text-gray-500 uppercase px-4 pb-2 text-left">
                                        <div className="col-span-2">Cliente</div>
                                        <div>Servicio</div>
                                        <div>Salud Ops</div>
                                        <div className="text-right">Ticket</div>
                                    </div>
                                    {clients.map(client => (
                                        <ClientRow key={client.id} data={{
                                            ...client,
                                            niche: client.type || 'Socio Estratégico',
                                            level: client.plan?.toLowerCase() === 'elite' ? 'Gold' : (client.plan?.toLowerCase() === 'pro' ? 'Active' : 'Basic'),
                                            health: client.status === 'active' ? 'excellent' : 'warning',
                                            income: `$${Number(client.price || 0).toLocaleString()}`
                                        }} />
                                    ))}
                                    {clients.length === 0 && !loading && (
                                        <div className="py-20 text-center text-gray-500 font-bold italic">
                                            No se encontraron clientes reales en la base de datos.
                                        </div>
                                    )}
                                    {loading && (
                                        <div className="py-2 text-gray-500 animate-pulse">Analizando nodos clientes...</div>
                                    )}
                                </div>
                            </div>

                            {/* 3. ALERTS & PRODUCTION */}
                            <div className="space-y-6">
                                <div className="bg-[#0A0A12] border border-red-500/20 rounded-3xl p-6 relative overflow-hidden text-left shadow-lg shadow-red-500/5">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
                                    <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                                        <ShieldAlert className="w-5 h-5 text-red-500" /> Salud Operativa
                                    </h3>
                                    <div className="space-y-4">
                                        <RiskHealthIndicator 
                                            label="Saturación Crítica" 
                                            status={operationalData?.risks?.filter(r => r.category === 'creative' && r.severity === 'critical').length > 0 ? 'CRÍTICO' : 'SEGURO'} 
                                            color={operationalData?.risks?.filter(r => r.category === 'creative' && r.severity === 'critical').length > 0 ? 'red' : 'emerald'} 
                                        />
                                        <RiskHealthIndicator 
                                            label="Retrasos Producción" 
                                            status={operationalData?.risks?.filter(r => r.category === 'project').length > 0 ? `${operationalData?.risks?.filter(r => r.category === 'project').length} VENCIDOS` : 'DÍA'} 
                                            color={operationalData?.risks?.filter(r => r.category === 'project').length > 0 ? 'red' : 'emerald'} 
                                        />
                                        <RiskHealthIndicator label="Calidad QA" status="OPTIMIZADO" color="emerald" />
                                        <RiskHealthIndicator 
                                            label="Nivel de Amenaza" 
                                            status={operationalData?.globalMetrics?.threatLevel?.toUpperCase() || 'ESTABLE'} 
                                            color={operationalData?.globalMetrics?.threatLevel === 'crítico' ? 'red' : 'emerald'} 
                                        />
                                    </div>
                                    <button
                                        onClick={() => setView('risk')}
                                        className="w-full mt-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all"
                                    >
                                        Neutralizar Riesgos
                                    </button>
                                </div>

                                <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 text-left">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Video className="w-5 h-5 text-indigo-400" /> Producción en Tiempo Real
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <StatBox label="Editando" value={productionStats.editing} color="blue" />
                                        <StatBox label="Diseñando" value={productionStats.design} color="purple" />
                                        <StatBox label="Rodajes" value={productionStats.shooting} color="green" />
                                        <StatBox label="Bloqueos" value={productionStats.bottlenecks} color="red" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 text-left">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-400" /> Monitor de Carga del Staff
                                    </h3>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest underline underline-offset-4 decoration-indigo-500">Capacidad: 40h/sem</span>
                                </div>
                                <div className="space-y-4">
                                    {(operationalData?.team || []).slice(0, 5).map((member, i) => (
                                        <TeamRow key={i} data={member} />
                                    ))}
                                    {(operationalData?.team || []).length > 5 && (
                                        <button onClick={() => setView('team')} className="w-full text-center text-[10px] text-gray-500 font-bold uppercase hover:text-white transition-colors py-2 border-t border-white/5 pt-4">
                                            Ver todos los {(operationalData?.team || []).length} miembros
                                        </button>
                                    )}
                                    {(!operationalData?.team || operationalData?.team?.length === 0) && (
                                        <div className="py-10 text-center text-gray-500 text-xs font-bold italic">No hay miembros registrados aún.</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 text-left">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-emerald-400" /> Próximos Eventos Críticos
                                </h3>
                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="py-4 text-gray-500 animate-pulse">Escaneando cronogramas...</div>
                                    ) : (
                                        <>
                                            {operationalData?.risks?.map((risk, index) => (
                                                <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                                    <div>
                                                        <div className="text-[10px] font-black text-gray-500 uppercase">{risk.category}</div>
                                                        <div className="text-xs font-bold text-white">{risk.message}</div>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-[10px] font-black ${risk.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                        {risk.severity === 'critical' ? 'CRÍTICO' : 'ATENCIÓN'}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!operationalData?.risks || operationalData?.risks?.length === 0) && (
                                                <div className="py-10 text-center text-gray-500 text-xs font-bold italic">
                                                    Sin alertas pendientes. El sistema está operando en niveles óptimos.
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#0A0A12] border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden text-left">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-emerald-500" /> Arquitectura del Sistema
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <PillarCard
                                        title="Operativa"
                                        desc="Manual del Nodo: Protocolos de campo."
                                        icon={Building2}
                                        color="blue"
                                        onClick={() => setView('docs')}
                                    />
                                    <PillarCard
                                        title="Legal"
                                        desc="Contrato de Representación: Blindaje oficial."
                                        icon={ShieldCheck}
                                        color="indigo"
                                        onClick={() => setView('docs')}
                                    />
                                    <PillarCard
                                        title="Estructura Red"
                                        desc="Manual Operativo Central: Gestión de Nodos."
                                        icon={Globe}
                                        color="purple"
                                        onClick={() => setView('nodes')}
                                    />
                                    <PillarCard
                                        title="Interna"
                                        desc="Organigrama: Jerarquía y responsabilidades."
                                        icon={Users}
                                        color="pink"
                                        onClick={() => setView('team')}
                                    />
                                    <PillarCard
                                        title="Financiera"
                                        desc="Modelo de Dinero: Flujo, Split y Utilidad."
                                        icon={DollarSign}
                                        color="emerald"
                                        highlight={true}
                                        onClick={() => setView('finance')}
                                    />
                                </div>
                            </div>

                            <div className="bg-[#0A0A12] border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden lg:col-span-2 text-left">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-indigo-500" /> Nodos & Red Territorial
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                                            <div>
                                                <div className="text-sm font-bold text-white">Nodo Guayaquil ( Nodo Oficial )</div>
                                                <div className="text-xs text-gray-500">Operador Regional • 12 Clientes Activos</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-emerald-400">$0/mes</div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold">Royalties Split</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                                            <div>
                                                <div className="text-sm font-bold text-white">Nodo Quito ( Nodo Oficial )</div>
                                                <div className="text-xs text-gray-500">Operador Regional • 8 Clientes Activos</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-emerald-400">$0/mes</div>
                                                <div className="text-[10px] text-gray-500 uppercase font-bold">Royalties Split</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleFeatureClick('Expansión de Nodos')}
                                            className="w-full mt-2 py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold rounded-xl hover:bg-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Globe className="w-4 h-4" /> Expandir a Nueva Ciudad / Nodo
                                        </button>
                                    </div>

                                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                                        <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">Estrategia de Margen</h4>
                                        <div className="space-y-4">
                                            <ProfitBento label="Plataforma (Escala)" value="60%" color="emerald" />
                                            <ProfitBento label="Producción (Operación)" value="25%" color="blue" />
                                            <ProfitBento label="Nodo (Presencia)" value="15%" color="indigo" />
                                            <div className="pt-2 text-[10px] text-gray-500 italic">
                                                * El margen real se calculará en base a la facturación de clientes ingresados.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0A0A12] border border-white/10 rounded-3xl p-6 lg:col-span-2 text-left">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-emerald-400" /> Rentabilidad DIIC ZONE
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-4 text-xs font-bold text-gray-500 uppercase px-2 pb-2">
                                        <div>Servicio</div>
                                        <div className="text-right">Ventas</div>
                                        <div className="text-right">Costo</div>
                                        <div className="text-right">Utilidad</div>
                                    </div>
                                    <div className="py-20 text-center text-gray-500 text-xs font-bold italic">Esperando ingreso de clientes reales para cálculo de rentabilidad.</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : view === 'finance' ? (
                    <motion.div
                        key="finance"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <AdminDualAudit />
                    </motion.div>
                ) : view === 'risk' ? (
                    <motion.div
                        key="risk"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminRiskControl />
                    </motion.div>
                ) : view === 'operations' ? (
                    <motion.div
                        key="operations"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminOperationsCore 
                            productionStats={productionStats} 
                            teamData={team} 
                            globalMetrics={operationalData?.globalMetrics}
                        />
                    </motion.div>
                ) : view === 'team' ? (
                    <motion.div
                        key="team"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminTeamReputation 
                            teamData={team} 
                            activeRisks={operationalData?.risks || []} 
                        />
                    </motion.div>
                ) : view === 'qa' ? (
                    <motion.div
                        key="qa"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminQualityControl />
                    </motion.div>
                ) : view === 'nodes' ? (
                    <motion.div
                        key="nodes"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminNodeManagement />
                    </motion.div>
                ) : view === 'docs' ? (
                    <motion.div
                        key="docs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminDocumentation />
                    </motion.div>
                ) : view === 'training' ? (
                    <motion.div
                        key="training"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminNodeTraining />
                    </motion.div>
                ) : view === 'improvement' ? (
                    <motion.div
                        key="improvement"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminContinuousImprovement />
                    </motion.div>
                ) : view === 'bi' ? (
                    <motion.div
                        key="bi"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminMasterIntelligence />
                    </motion.div>
                ) : view === 'capacity' ? (
                    <motion.div
                        key="capacity"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminCapacitySystem />
                    </motion.div>
                ) : view === 'pricing' ? (
                    <motion.div
                        key="pricing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminDynamicPricing />
                    </motion.div>
                ) : view === 'evolution' ? (
                    <motion.div
                        key="evolution"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <AdminClientEvolution />
                    </motion.div>
                ) : view === 'governance' ? (
                    <motion.div
                        key="governance"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <AdminOperationalGovernance />
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div >
    );
}

// --- HELPER COMPONENTS ---

function PillarCard({ title, desc, icon: Icon, color, highlight, onClick }) {
    const colors = {
        blue: "text-blue-400 border-blue-400/20 bg-blue-500/5",
        indigo: "text-indigo-400 border-indigo-400/20 bg-indigo-500/5",
        purple: "text-purple-400 border-purple-400/20 bg-purple-500/5",
        pink: "text-pink-400 border-pink-400/20 bg-pink-500/5",
        emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-500/5",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`p-4 rounded-xl border transition-all hover:bg-white/5 cursor-pointer ${colors[color]} ${highlight ? 'ring-1 ring-emerald-500/50' : ''}`}
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <div>
                    <div className="font-bold text-white text-sm">{title}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                </div>
            </div>
        </motion.div>
    );
}

function ProfitBento({ label, value, color }) {
    const barColors = {
        emerald: "bg-emerald-500",
        blue: "bg-blue-500",
        indigo: "bg-indigo-500",
    };
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-gray-400">{label}</span>
                <span className="text-white">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: value }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={`h-full rounded-full ${barColors[color]}`}
                />
            </div>
        </div>
    );
}

function KPICard({ icon: Icon, title, value, sub, color }) {
    const colors = {
        indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };

    return (
        <div className={`p-6 rounded-2xl border ${colors[color].replace('text-', 'border-')} bg-[#0A0A12] text-left`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {color === 'red' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            </div>
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="text-sm text-gray-400 font-medium">{title}</div>
            <div className="text-xs text-gray-500 mt-2">{sub}</div>
        </div>
    );
}

function ClientRow({ data }) {
    const healthColor = {
        excellent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        good: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        warning: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        critical: "text-red-400 bg-red-500/10 border-red-500/20",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01, x: 5 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => toast.info(`Detalles de: ${data.name}`)}
            className="grid grid-cols-5 items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all cursor-pointer group text-left"
        >
            <div className="col-span-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                    {data.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <div className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{data.name}</div>
                    <div className="text-xs text-gray-500">{data.niche}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-bold text-gray-300">Nivel {data.level}</span>
            </div>
            <div>
                <span className={`px-2 py-1 rounded text-xs font-bold border ${healthColor[data.health]}`}>
                    {data.health.toUpperCase()}
                </span>
            </div>
            <div className="text-right font-bold text-white text-sm">{data.income}</div>
        </motion.div>
    );
}

function AlertItem({ title, desc }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors cursor-pointer text-left">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse" />
            <div>
                <div className="font-bold text-white text-sm">{title}</div>
                <div className="text-xs text-gray-400">{desc}</div>
            </div>
        </div>
    );
}

function RiskHealthIndicator({ label, status, color }) {
    const colors = {
        red: "text-red-500 bg-red-500/10 border-red-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    };
    return (
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${colors[color]}`}>
                {status}
            </span>
        </div>
    );
}

function StatBox({ label, value, color }) {
    const colors = {
        blue: "text-blue-400",
        purple: "text-purple-400",
        green: "text-emerald-400",
        red: "text-red-400",
    };
    return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
            <div className={`text-2xl font-black ${colors[color]}`}>{value}</div>
            <div className="text-xs font-bold text-gray-500 uppercase">{label}</div>
        </div>
    );
}

function TeamRow({ data }) {
    const loadColor = {
        high: "bg-red-500",
        medium: "bg-yellow-500",
        low: "bg-emerald-500"
    };
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-left">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                    <User className="w-4 h-4" />
                </div>
                <div>
                    <div className="font-bold text-white text-sm">{data.name}</div>
                    <div className="text-xs text-gray-500">{data.role}</div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 mb-1">Carga</span>
                    <div className="flex gap-1">
                        <div className={`w-2 h-2 rounded-full ${loadColor[data.load]}`} />
                        <div className={`w-2 h-2 rounded-full ${data.load === 'high' ? 'bg-red-500' : 'bg-gray-700'}`} />
                        <div className={`w-2 h-2 rounded-full ${data.load === 'high' ? 'bg-red-500' : 'bg-gray-700'}`} />
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 mb-1">Obj</span>
                    <span className="text-sm font-bold text-green-400">{data.performance}%</span>
                </div>
            </div>
        </div>
    );
}

function ServiceRow({ data }) {
    return (
        <div className="grid grid-cols-4 items-center p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-left">
            <div className="font-bold text-white">{data.name}</div>
            <div className="text-right text-gray-300">{data.sales}</div>
            <div className="text-right text-red-300">-{data.cost}</div>
            <div className="text-right font-bold text-emerald-400">{data.profit}</div>
        </div>
    );
}

function StatusBadge({ label, count, status }) {
    const color = status === 'online' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20';
    return (
        <div className={`px-3 py-1.5 rounded-full border ${color} flex items-center gap-2 text-xs font-bold uppercase tracking-wider`}>
            <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
            {count && <span className="bg-white/10 px-1.5 rounded text-[10px]">{count}</span>}
            {label}
        </div>
    );
}
