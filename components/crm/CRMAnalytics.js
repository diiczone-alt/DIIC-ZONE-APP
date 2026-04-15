'use client';

import { 
    BarChart2, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, 
    Target, Users, DollarSign, BrainCircuit, Activity, Award, User
} from 'lucide-react';

export default function CRMAnalytics() {
    return (
        <div className="flex-1 w-full h-full bg-[#050511] overflow-y-auto custom-scrollbar p-8 relative isolate">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Activity className="w-8 h-8 text-purple-500" />
                        Centro de Inteligencia Analítica
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm font-medium">Radiografía completa de rendimiento, cuellos de botella y proyecciones.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-bold bg-[#151520] hover:bg-white/5 transition-all">Últimos 7 días</button>
                    <button className="px-4 py-2 rounded-xl border border-indigo-500/30 text-indigo-400 text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 transition-all">Este Mes</button>
                    <button className="px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-bold bg-[#151520] hover:bg-white/5 transition-all">Este Año</button>
                </div>
            </div>

            {/* Master KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    label="Ingresos Proyectados" 
                    value="$42,500" 
                    trend="+15%" 
                    trendLabel="vs mes pasado" 
                    icon={DollarSign} 
                    color="emerald" 
                />
                <MetricCard 
                    label="Tasa de Cierre Global" 
                    value="12.4%" 
                    trend="+2.1%" 
                    trendLabel="vs mes pasado" 
                    icon={Target} 
                    color="indigo" 
                />
                <MetricCard 
                    label="Costo Adq. Cliente (CAC)" 
                    value="$15.20" 
                    trend="-5.4%" 
                    trendLabel="vs mes pasado" 
                    icon={TrendingUp} 
                    color="purple" 
                    positive={true} // Decreasing cost is positive
                />
                <MetricCard 
                    label="Leads Generados" 
                    value="1,402" 
                    trend="+45" 
                    trendLabel="nuevos hoy" 
                    icon={Users} 
                    color="blue" 
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Visual Funnel Chart (Col 1 & 2) */}
                <div className="lg:col-span-2 bg-[#0E0E18]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-indigo-400" /> Conversión del Embudo (Pipeline)
                    </h3>
                    
                    <div className="space-y-4 relative z-10 p-2">
                        <FunnelBar stage="Total Leads (Tráfico Frío)" count={1402} percentage={100} color="bg-blue-500" drop="0%" dropType="neutral" />
                        <FunnelBar stage="Contactados (Apertura de Chat)" count={850} percentage={60} color="bg-indigo-500" drop="-40%" dropType="negative" />
                        <FunnelBar stage="Cotización Enviada (Propuestas)" count={340} percentage={24} color="bg-purple-500" drop="-60%" dropType="negative" />
                        <FunnelBar stage="Negociación Activa (Calientes)" count={120} percentage={8} color="bg-pink-500" drop="-64%" dropType="warning" />
                        <FunnelBar stage="Ganados (Clientes Cerrados)" count={174} percentage={12} color="bg-emerald-500" drop="+45%" dropType="positive" />
                    </div>

                    {/* Funnel Insight Summary */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-sm">
                        <p className="text-gray-400"><span className="text-white font-bold">128</span> propuestas pendientes de revisión.</p>
                        <p className="text-indigo-400 font-bold flex items-center gap-1">Velocidad de Cierre: 4.2 Días <TrendingUp className="w-4 h-4" /></p>
                    </div>
                </div>

                {/* AI & Copilot Panel (Col 3) */}
                <div className="bg-[#151520]/80 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(99,102,241,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><BrainCircuit className="w-24 h-24 text-indigo-500" /></div>
                    
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BotIcon /> Copiloto Analítico IA
                    </h3>

                    <div className="space-y-4 relative z-10">
                        {/* Alert 1 */}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <h4 className="text-red-400 text-xs font-bold uppercase mb-1">Cuello de Botella Detectado</h4>
                            <p className="text-sm text-red-100">Tienes <strong>$5,200 USD</strong> en leads estancados en "Cotización" por más de 5 días.</p>
                            <button className="mt-3 text-[10px] uppercase font-bold text-red-300 hover:text-white bg-red-500/20 px-3 py-1.5 rounded-lg w-full transition-colors border border-red-500/30">Lanzar Secuencia de Reactivación</button>
                        </div>

                        {/* Alert 2 */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                            <h4 className="text-emerald-400 text-xs font-bold uppercase mb-1">Rendimiento Óptimo</h4>
                            <p className="text-sm text-emerald-100">La fuente <strong>Instagram Ads</strong> está convirtiendo al 18% (6% arriba del promedio).</p>
                            <button className="mt-3 text-[10px] uppercase font-bold text-emerald-300 hover:text-white bg-emerald-500/20 px-3 py-1.5 rounded-lg w-full transition-colors border border-emerald-500/30">Ver Desglose de Orígenes</button>
                        </div>

                        {/* Alert 3 */}
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                            <h4 className="text-indigo-400 text-xs font-bold uppercase mb-1">Sugerecia Estratégica</h4>
                            <p className="text-sm text-indigo-100">Detecto una caída del 60% entre 'Contactado' y 'Cotización'. Revisa el guión del Bot IA en el Nodo de Decisión.</p>
                            <button className="mt-3 text-[10px] uppercase font-bold text-indigo-300 hover:text-white bg-indigo-500/20 px-3 py-1.5 rounded-lg w-full transition-colors border border-indigo-500/30">Abrir Editor de Flujos</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Performance */}
                <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 shadow-2xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" /> Leaderboard del Equipo (Top Closers)
                    </h3>
                    
                    <div className="space-y-1">
                        <TeamMember rank={1} name="Carlos Admin" role="Sales Manager" leads={340} closed={85} rate="25%" revenue="$12,500" />
                        <TeamMember rank={2} name="María IA Bot" role="Agente Automático" leads={1062} closed={89} rate="8%" revenue="$8,900" />
                        <TeamMember rank={3} name="Laura Asistente" role="Account Executive" leads={210} closed={30} rate="14%" revenue="$4,500" />
                    </div>
                </div>

                {/* Trajectory Area (Placeholder for actual chart integration) */}
                <div className="bg-gradient-to-tr from-[#0E0E18] to-[#151520] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                    <PieChart className="w-16 h-16 text-indigo-500/20 mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:text-indigo-500/50" />
                    <h4 className="text-white font-bold text-lg mb-2">Proyección Financiera Avanzada</h4>
                    <p className="text-sm text-gray-500 text-center max-w-sm">Conecta la pasarela de pagos en Conectividades para desbloquear gráficas de calor y pronósticos LTV.</p>
                    <button className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">Configurar Pasarelas</button>
                </div>
            </div>

        </div>
    )
}

function MetricCard({ label, value, trend, trendLabel, icon: Icon, color, positive = true }) {
    const colorStyles = {
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        blue:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };

    const isUp = trend.startsWith('+');
    const isGood = positive ? isUp : !isUp;

    return (
        <div className="bg-[#0E0E18] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${colorStyles[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${isGood ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">{label}</p>
                <h3 className="text-4xl font-black text-white font-display tracking-tight">{value}</h3>
                <p className="text-[10px] text-gray-600 mt-2 font-medium">{trendLabel}</p>
            </div>
        </div>
    )
}

function FunnelBar({ stage, count, percentage, color, drop, dropType }) {
    return (
        <div className="group">
            <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">{stage}</span>
                <span className="text-xs font-mono text-gray-400">{count} leads</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1 bg-[#151520] h-6 rounded-full overflow-hidden shadow-inner relative border border-white/5">
                    <div 
                        className={`h-full ${color} bg-opacity-80 rounded-full transition-all duration-1000 ease-out relative`}
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                    </div>
                </div>
                <div className="w-20 text-right shrink-0 flex flex-col items-end justify-center">
                    <span className="text-sm font-black text-white">{percentage}%</span>
                    {dropType !== 'neutral' && (
                        <span className={`text-[9px] font-bold px-1.5 py-[1px] rounded flex items-center gap-0.5 ${
                            dropType === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                            dropType === 'negative' ? 'bg-red-500/10 text-red-400' :
                            'bg-yellow-500/10 text-yellow-400'
                        }`}>
                            {drop}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function TeamMember({ rank, name, role, leads, closed, rate, revenue }) {
    return (
        <div className="grid grid-cols-12 gap-4 p-4 hover:bg-white/[0.02] rounded-2xl transition-colors items-center border border-transparent hover:border-white/5">
            <div className="col-span-1 text-center font-bold text-gray-600">#{rank}</div>
            <div className="col-span-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold border ${rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-[#151520] border-white/10'}`}>
                    {rank === 1 ? <Award className="w-5 h-5 text-white" /> : name.charAt(0)}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">{name}</h4>
                    <span className="text-[10px] text-gray-500">{role}</span>
                </div>
            </div>
            <div className="col-span-2 flex flex-col items-center">
                <span className="text-xs text-gray-500">Volumen</span>
                <span className="text-sm font-bold text-white">{leads}</span>
            </div>
            <div className="col-span-2 flex flex-col items-center">
                <span className="text-xs text-gray-500">Cierres</span>
                <span className="text-sm font-bold text-emerald-400">{closed} ({rate})</span>
            </div>
            <div className="col-span-3 flex flex-col items-end">
                <span className="text-xs text-gray-500">Ingresos</span>
                <span className="text-base font-black text-white">{revenue}</span>
            </div>
        </div>
    )
}

function BotIcon() {
    return <BrainCircuit className="w-5 h-5" />;
}
