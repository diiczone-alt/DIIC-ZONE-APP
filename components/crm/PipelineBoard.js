'use client';

import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, ChevronLeft, ChevronRight, Filter, Search, Sparkles } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import LeadCard from './LeadCard';
import LeadProfileView from './LeadProfileView';

const COLUMN_CONFIG = {
    'incoming': { id: 'incoming', title: 'LEADS ENTRANTES', color: 'border-red-500', glow: 'shadow-[0_0_15px_#ef444430]' },
    'contact': { id: 'contact', title: 'CONTACTO INICIAL', color: 'border-blue-500', glow: 'shadow-[0_0_15px_#3b82f630]' },
    'rebound': { id: 'rebound', title: 'REPESCA 15 DÍAS', color: 'border-orange-500', glow: 'shadow-[0_0_15px_#f9731630]' },
    'identified': { id: 'identified', title: 'CURSO INTERÉS ID', color: 'border-yellow-500', glow: 'shadow-[0_0_15px_#eab30830]' },
    'negotiation': { id: 'negotiation', title: 'NEGOCIACIÓN', color: 'border-indigo-500', glow: 'shadow-[0_0_15px_#6366f130]' },
    'won': { id: 'won', title: 'CERRADO - VENTA', color: 'border-emerald-500', glow: 'shadow-[0_0_15px_#10b98130]' },
};

const COLUMN_ORDER = ['incoming', 'contact', 'rebound', 'identified', 'negotiation', 'won'];

export default function PipelineBoard({ leads = [] }) {
    const [isBrowser, setIsBrowser] = useState(false);
    const [data, setData] = useState({
        columns: COLUMN_CONFIG,
        columnOrder: COLUMN_ORDER,
        leads: {},
        columnsData: {
            'incoming': [], 'contact': [], 'rebound': [], 'identified': [], 'negotiation': [], 'won': []
        }
    });

    useEffect(() => {
        setIsBrowser(true);
        if (leads.length > 0) {
            const leadsMap = {};
            const colsData = {
                'incoming': [], 'contact': [], 'rebound': [], 'identified': [], 'negotiation': [], 'won': []
            };

            leads.forEach(lead => {
                const id = lead.id;
                leadsMap[id] = {
                    ...lead,
                    name: lead.full_name,
                    value: Number(lead.price_estimated || 0),
                    status: lead.status?.toLowerCase() || 'incoming'
                };
                
                const colKey = lead.status?.toLowerCase() || 'incoming';
                if (colsData[colKey]) {
                    colsData[colKey].push(id);
                } else {
                    colsData['incoming'].push(id);
                }
            });

            setData(prev => ({
                ...prev,
                leads: leadsMap,
                columnsData: colsData
            }));
        }
    }, [leads]);
    const [selectedLead, setSelectedLead] = useState(null);
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = data.columnsData[source.droppableId];
        const finish = data.columnsData[destination.droppableId];

        if (start === finish) {
            const newLeadIds = Array.from(start);
            newLeadIds.splice(source.index, 1);
            newLeadIds.splice(destination.index, 0, draggableId);

            const newColumnsData = {
                ...data.columnsData,
                [source.droppableId]: newLeadIds,
            };

            setData({ ...data, columnsData: newColumnsData });
        } else {
            const startLeadIds = Array.from(start);
            startLeadIds.splice(source.index, 1);
            const newStart = startLeadIds;

            const finishLeadIds = Array.from(finish);
            finishLeadIds.splice(destination.index, 0, draggableId);
            const newFinish = finishLeadIds;

            const newColumnsData = {
                ...data.columnsData,
                [source.droppableId]: newStart,
                [destination.droppableId]: newFinish,
            };

            setData({ ...data, columnsData: newColumnsData });
        }
    };

    if (!isBrowser) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#050511] text-gray-500 gap-4">
                <div className="w-8 h-8 rounded-full border-r-2 border-t-2 border-indigo-500 animate-spin"></div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Cargando Motor de Pipeline...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-[#050511] relative overflow-hidden">
            
            {/* --- PIPELINE NAV BANNER --- */}
            <div className="flex-none px-8 py-5 border-b border-white/5 bg-[#0A0A12]/80 backdrop-blur-md z-20 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-6">
                    <h2 className="text-white font-bold tracking-widest uppercase flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                        Flujo de Ventas
                    </h2>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="flex items-center gap-3 bg-[#151520] rounded-xl px-3 py-1.5 border border-white/5">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Buscar lead..." className="bg-transparent border-none text-xs text-white focus:outline-none w-48" />
                    </div>
                    <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                        <Filter className="w-3.5 h-3.5" /> Filtros
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-[#151520] rounded-xl border border-white/5 overflow-hidden">
                        <button onClick={scrollLeft} className="px-4 py-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border-r border-white/5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            <ChevronLeft className="w-4 h-4" /> Desplazar
                        </button>
                        <button onClick={scrollRight} className="px-4 py-2 hover:bg-indigo-600 hover:text-white bg-indigo-500/10 text-indigo-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            Desplazar <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- PIPELINE CANVAS --- */}
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-x-hidden overflow-y-hidden p-3 relative"
            >
                {/* Ambient Background Glow */}
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-2 h-full w-full relative z-10">
                        {data.columnOrder.map((columnId) => {
                        const column = data.columns[columnId];
                        const leads = data.columnsData[columnId].map(leadId => data.leads[leadId]);

                        return (
                            <div key={column.id} className="flex-1 min-w-[160px] flex flex-col bg-[#0A0A12]/80 backdrop-blur-xl rounded-2xl border border-white/5 h-full max-h-full shadow-xl relative group/col isolate overflow-hidden">
                                {/* Glowing Header Top Border */}
                                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${column.color.replace('border-', 'text-')} group-hover/col:opacity-100 transition-opacity`}></div>

                                {/* Column Header */}
                                <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02] rounded-t-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] ${column.color.replace('border-', 'bg-')} ${column.color.replace('border-', 'text-')}`}></div>
                                        <h3 className="font-black text-white text-xs uppercase tracking-widest">{column.title}</h3>
                                        <span className="bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-md">{leads.length}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            title="Acciones en Masa"
                                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-gray-500 hover:text-indigo-400 flex items-center justify-center transition-all border border-transparent hover:border-indigo-500/30"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                        </button>
                                        <button className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 p-2 overflow-y-auto custom-scrollbar space-y-2 transition-all duration-300 ${snapshot.isDraggingOver ? 'bg-indigo-500/5' : ''}`}
                                        >
                                            {leads.length > 0 ? leads.map((lead, index) => (
                                                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{ ...provided.draggableProps.style }}
                                                        >
                                                            <LeadCard lead={lead} isDragging={snapshot.isDragging} onClick={() => setSelectedLead(lead)} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )) : (
                                                <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 pointer-events-none">
                                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 mb-4" />
                                                    <p className="text-[8px] font-black uppercase tracking-widest">Sin Leads</p>
                                                </div>
                                            )}
                                            {provided.placeholder}

                                            {/* Quick Add Button */}
                                            <button className="w-full py-2 flex items-center justify-center gap-2 text-gray-500 hover:bg-white/5 hover:text-gray-300 rounded-xl border border-dashed border-white/10 transition-colors text-sm">
                                                <Plus className="w-4 h-4" /> Añadir
                                            </button>
                                        </div>
                                    )}
                                </Droppable>

                                {/* Column Footer (Total Value) */}
                                <div className="p-3 border-t border-white/5 bg-[#050511]/80 rounded-b-2xl flex flex-col gap-1 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.5)]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] uppercase font-black tracking-widest text-gray-600">V. Total Columna</span>
                                        <span className={`text-[11px] font-black font-display tracking-tight ${leads.reduce((sum, item) => sum + (item.value || 0), 0) > 0 ? 'text-emerald-400' : 'text-gray-700'}`}>
                                            ${leads.reduce((sum, item) => sum + (item.value || 0), 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center opacity-40">
                                        <span className="text-[7px] uppercase font-bold text-gray-700">Conversión Est.</span>
                                        <span className="text-[8px] font-black text-gray-600">14%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
            </div>

            {/* Profile Drawer Overlay */}
            <AnimatePresence>
                {selectedLead && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                            onClick={() => setSelectedLead(null)}
                        ></div>
                        {/* Drawer */}
                        <LeadProfileView lead={selectedLead} onClose={() => setSelectedLead(null)} />
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
