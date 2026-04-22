'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    ReactFlow, 
    Controls, 
    Background, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge, 
    Handle, 
    Position, 
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Shield, Zap, Flame, User, Globe, DollarSign, Database } from 'lucide-react';
import { agencyService } from '@/services/agencyService';
import { toast } from 'sonner';

// ============================================
// CUSTOM NODE COMPONENT (Tarjeta Visual)
// ============================================
const MemberNode = ({ data, isConnectable }) => {
    const isEstratega = (data.role || '').toLowerCase().includes('estratega');
    const isCM = (data.role || '').toLowerCase().includes('community manager');

    return (
        <div className={`relative w-[280px] bg-[#0A0A14]/90 backdrop-blur-xl border ${isEstratega ? 'border-amber-500/30' : isCM ? 'border-indigo-500/30' : 'border-white/10'} rounded-[2rem] p-6 flex flex-col shadow-2xl group transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]`}>
            
            {/* Contenedor Interno para recortar las luces sin recortar los conectores (Handles) */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
                 <div className={`absolute -top-10 -right-10 w-32 h-32 ${isEstratega ? 'bg-amber-500/10' : 'bg-indigo-500/10'} blur-[50px] rounded-full group-hover:opacity-100 transition-all duration-1000`} />
            </div>

            {/* Top Handle: Entrada (Recibe instrucciones del lider) */}
            <Handle 
                type="target" 
                position={Position.Top} 
                isConnectable={isConnectable} 
                className={`w-6 h-6 -top-3 rounded-full border-[4px] border-[#0A0A14] ${isEstratega ? 'bg-amber-500' : 'bg-pink-500'} cursor-crosshair transition-transform hover:scale-125 shadow-[0_0_15px_rgba(236,72,153,0.5)] z-50`} 
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-pink-500 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">RECEPTOR</div>

            {/* Avatar & Identidad */}
            <div className="flex flex-col items-center mb-6 pt-2 relative z-10">
                <div className={`w-16 h-16 rounded-[1.2rem] bg-gradient-to-tr ${isEstratega ? 'from-amber-600 to-orange-600' : isCM ? 'from-indigo-600 to-purple-600' : 'from-emerald-500 to-teal-500'} p-0.5 shadow-2xl transition-transform duration-500`}>
                    <div className="w-full h-full rounded-[1.1rem] bg-[#050510] flex items-center justify-center text-2xl font-black text-white italic tracking-tighter">
                        {data.label ? data.label[0] : '?'}
                    </div>
                </div>
                <div className="text-center mt-4">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{data.label ? data.label.split(' ')[0] : 'Talento'}</h3>
                    <p className={`text-[7px] font-black ${isEstratega ? 'text-amber-400' : isCM ? 'text-indigo-400' : 'text-emerald-400'} uppercase tracking-[0.3em] mt-2 bg-white/5 py-1 px-3 rounded-full border border-white/5 inline-block`}>{data.role}</p>
                </div>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
                    <Globe className="w-3 h-3 text-gray-500 mb-1" />
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter truncate w-full text-center">{data.city || 'Remoto'}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
                    <DollarSign className="w-3 h-3 text-gray-500 mb-1" />
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter text-center">${data.salary || 0}</span>
                </div>
            </div>

            {/* Action Button */}
            <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    if(data.onAudit) data.onAudit(data.member); 
                }} 
                className="nodrag w-full py-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 font-black uppercase text-[8px] tracking-[0.4em] transition-all relative z-10 backdrop-blur-md"
            >
                Ver Detalles
            </button>
            
            {/* Bottom Handle: Salida (Lidera a otros) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                isConnectable={isConnectable} 
                className="w-8 h-8 -bottom-4 rounded-full border-[4px] border-[#0A0A14] bg-emerald-500 cursor-crosshair transition-transform hover:scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)] z-50 flex items-center justify-center" 
            >
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            </Handle>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase text-emerald-500 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">ARRASTRAR PARA LIDERAR</div>
        </div>
    );
};

const nodeTypes = { customMember: MemberNode };

// ============================================
// MAIN VISUAL BOARD
// ============================================
export default function SquadCanvasBoard({ team, allClients = [], onAudit, refreshTeam }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [activeSede, setActiveSede] = useState('Todas');

    // Initialize Layout with Persistent Memory
    useEffect(() => {
        if (!team || team.length === 0) return;

        const generatedNodes = [];
        const generatedEdges = [];
        const savedLayout = JSON.parse(localStorage.getItem('diiczone_squad_layout') || '{}');

        // Filter by Sede: based on CLIENT location AND Team Member resident location
        let filteredTeam = team;

        if (activeSede !== 'Todas') {
            // 1. Get businesses (clients) located in the activeSede (Normalised)
            const sedeClients = (allClients || []).filter(c => (c.city || '').toLowerCase().trim() === activeSede.toLowerCase().trim());
            
            // 2. Identify personnel actively attached to these businesses
            const activePersonnelNames = new Set(sedeClients.flatMap(c => [c.cm, c.editor, c.filmmaker]).filter(Boolean));
            
            // Core members actually working the brands OR actively assigned to the Node/City
            const coreMembers = team.filter(m => {
                const memberCity = (m.city || '').toLowerCase().trim();
                const targetSede = activeSede.toLowerCase().trim();
                
                const isResident = memberCity === targetSede;
                const hasLocalBrands = sedeClients.length > 0;

                // Solo incluimos residentes si la sede est activa con marcas
                // De lo contrario, solo incluimos a personal explcitamente asignado mediante brands
                return activePersonnelNames.has(m.name) || (isResident && hasLocalBrands);
            });
            
            const squadSet = new Set(coreMembers.map(m => m.id));

            // Include leaders (Estrategas/HQ) UP the chain
            let addedNew = true;
            while(addedNew) {
                addedNew = false;
                team.forEach(m => {
                    if (squadSet.has(m.id) && m.squad_lead_id && !squadSet.has(m.squad_lead_id)) {
                        squadSet.add(m.squad_lead_id);
                        addedNew = true;
                    }
                });
            }

            // Eliminamos la lógica "Down the chain" para no traer a creativos de otras ciudades
            // solo porque su líder esté asignado a esta ciudad.

            filteredTeam = team.filter(m => squadSet.has(m.id));
        }

        const strategists = filteredTeam.filter(m => (m.role || '').toLowerCase().includes('estratega'));
        const cms = filteredTeam.filter(m => (m.role || '').toLowerCase().includes('community manager'));
        const creatives = filteredTeam.filter(m => !(m.role || '').toLowerCase().includes('estratega') && !(m.role || '').toLowerCase().includes('community manager'));

        // Simple layouting math (Fallback)
        const LEVEL_Y = { ESTRATEGAS: 50, CMS: 400, CREATIVES: 800 };
        const X_SPACING = { ESTRATEGAS: 400, CMS: 350, CREATIVES: 300 };

        // Centering X coordinates
        const startX = (arr, spacing) => -((arr.length - 1) * spacing) / 2;

        const addMembersToNodes = (members, levelY, spacing) => {
            let start = startX(members, spacing);
            members.forEach((m, idx) => {
                generatedNodes.push({
                    id: m.id,
                    type: 'customMember',
                    position: savedLayout[m.id] || { x: start + (idx * spacing), y: levelY },
                    data: { label: m.name, role: m.role, city: m.city, salary: m.salary, member: m, onAudit }
                });

                // Reconstruct Edges if they have a leader
                if (m.squad_lead_id) {
                    generatedEdges.push({
                        id: `e-${m.squad_lead_id}-${m.id}`,
                        source: m.squad_lead_id,
                        target: m.id,
                        animated: true,
                        style: { stroke: '#818cf8', strokeWidth: 3 }, // Indigo glow
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
                    });
                }
            });
        };

        addMembersToNodes(strategists, LEVEL_Y.ESTRATEGAS, X_SPACING.ESTRATEGAS);
        addMembersToNodes(cms, LEVEL_Y.CMS, X_SPACING.CMS);
        addMembersToNodes(creatives, LEVEL_Y.CREATIVES, X_SPACING.CREATIVES);

        setNodes(generatedNodes);
        setEdges(generatedEdges);
    }, [team, allClients, onAudit, activeSede]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onNodeDragStop = useCallback((event, node) => {
        // Save coordinates persistently when the user stops dragging
        const currentSaved = JSON.parse(localStorage.getItem('diiczone_squad_layout') || '{}');
        currentSaved[node.id] = node.position;
        localStorage.setItem('diiczone_squad_layout', JSON.stringify(currentSaved));
    }, []);

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(async (params) => {
        // params: { source, target, sourceHandle, targetHandle }
        console.log("🔗 New Edge Connecting:", params);
        
        // Optimistic UI updates
        const newEdge = { 
            ...params, 
            id: `e-${params.source}-${params.target}`, 
            animated: true, 
            style: { stroke: '#10b981', strokeWidth: 4, filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.8))' }, 
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }
        };
        
        setEdges((eds) => addEdge(newEdge, eds));
        
        // Remove prior edges that target the same node (a person can only have 1 direct squad_lead_id)
        setEdges((eds) => eds.filter(e => e.target !== params.target || e.source === params.source));

        try {
            // Update Database: target member now reports to source member
            await agencyService.updateTeamMember(params.target, { squad_lead_id: params.source });
            toast.success("Vínculo de Mando Actualizado ✨", {
                description: "La estructura jerárquica ha sido sincronizada en la base central."
            });
            if (refreshTeam) refreshTeam();
        } catch (error) {
            console.error("Link update failed:", error);
            toast.error("Error al establecer el mando");
        }
    }, [refreshTeam]);

    const onEdgeDoubleClick = useCallback(async (event, edge) => {
        // Disconnect behavior
        try {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            await agencyService.updateTeamMember(edge.target, { squad_lead_id: null });
            toast.success("Vínculo Desconectado", {
                description: "La unidad vuelve a ser independiente."
            });
            if (refreshTeam) refreshTeam();
        } catch (e) {
            toast.error("Error al desconectar");
        }
    }, [refreshTeam]);

    return (
        <div className="w-full h-[800px] bg-[#05050A] rounded-[3rem] border border-white/5 overflow-hidden group/board relative shadow-2xl">
            {/* HUD OVERLAY */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
                <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-indigo-500 animate-pulse" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.5em] italic">Squad Canvas</h3>
                </div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-2 ml-8 mb-6">Sistema Conexión Dinámica</p>
                
                {/* Sede Selectors */}
                <div className="flex flex-col gap-3 ml-8 pointer-events-auto">
                    {['Todas', 'Santo Domingo', 'Quito', 'Manta'].map(sede => (
                        <button 
                            key={sede}
                            onClick={() => setActiveSede(sede)}
                            className={`px-5 py-3 text-left rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all backdrop-blur-md ${activeSede === sede ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-[#0A0A14]/80 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}
                        >
                            <span className={`inline-block w-2 h-2 rounded-full mr-3 ${activeSede === sede ? 'bg-indigo-400 animate-pulse' : 'bg-gray-700'}`}></span>
                            {sede === 'Todas' ? 'Directorio Global' : `Sede ${sede}`}
                        </button>
                    ))}
                </div>
            </div>
            <div className="absolute top-8 right-8 z-10 pointer-events-none text-right">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-4 py-2 border border-indigo-500/20 rounded-full">
                    Arrastra el conector de 🟢 Salida hacia 🔴 Entrada
                </p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">
                    Doble clic en la línea para Desvincular
                </p>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onNodeDragStop={onNodeDragStop}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeDoubleClick={onEdgeDoubleClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 1 }}
                minZoom={0.2}
                maxZoom={1.5}
                className="custom-flow-theme"
            >
                <Background color="#ffffff" gap={32} size={1} opacity={0.03} />
                <Controls 
                    className="bg-[#0A0A14] border border-white/10 rounded-2xl p-2 shadow-2xl fill-white" 
                    showInteractive={false} // clean look
                />
            </ReactFlow>

            {/* Custom CSS overrides for React Flow inner elements to match DIIC Zone aesthetic */}
            <style dangerouslySetInnerHTML={{__html: `
                .react-flow__controls-button {
                    background-color: transparent !important;
                    border: none !important;
                    fill: #9ca3af !important;
                }
                .react-flow__controls-button:hover {
                    fill: #ffffff !important;
                }
                .react-flow__pane {
                    cursor: grab;
                }
                .react-flow__pane:active {
                    cursor: grabbing;
                }
            `}} />
        </div>
    );
}
