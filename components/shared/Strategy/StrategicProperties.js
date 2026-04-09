'use client';

import React from 'react';
import { X, ChevronDown, RotateCcw, Plus, Minus, Type, Grid, Palette, Sliders, Settings2, Zap, Rocket, BarChart3, Calendar, CheckCircle2, Link2, ExternalLink } from 'lucide-react';
import { NODE_TYPES } from './StrategyConstants';

export default function StrategicProperties({ selectedNode, selectedEdge, activeTab = 'general', onTabChange, onClose, onUpdateNode, onDeleteNode, onDeleteEdge }) {
  if (!selectedNode && !selectedEdge) return null;

  const isNode = !!selectedNode;
  const item = isNode ? selectedNode : selectedEdge;
  const isConversionNode = isNode && item?.type && NODE_TYPES[item.type]?.category === 'conversión';

  const tabs = [
      { id: 'general', label: 'General', icon: Settings2 },
      { id: 'planner', label: 'Planner', icon: Calendar },
      { id: 'metrics', label: 'Métricas', icon: BarChart3 }
  ];

  if (isConversionNode) {
      tabs.push({ id: 'crm', label: 'CRM Sync', icon: Link2 });
  }

  return (
    <div className="w-80 bg-[#0A0A0F] border-l border-white/5 flex flex-col h-full z-[70] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 flex justify-between items-center bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-10">
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">
          {isNode ? 'Node Settings' : 'Edge Settings'}
        </h2>
        <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {isNode && (
          <div className="flex px-4 pt-2 border-b border-white/5 shrink-0 overflow-x-auto custom-scrollbar">
              {tabs.map(tab => (
                  <button 
                      key={tab.id}
                      onClick={() => onTabChange?.(tab.id)}
                      className={`flex-1 flex flex-col items-center gap-1.5 pb-3 border-b-2 transition-all ${
                          activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-white/10'
                      }`}
                  >
                      <tab.icon className="w-4 h-4" />
                      <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
                  </button>
              ))}
          </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 pb-20">
        
        {/* General Tab Content */}
        {(!isNode || activeTab === 'general') && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* SECCIÓN 1: IDENTIDAD */}
            <section className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">1. Identidad</span>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Nombre del Nodo</label>
                  <input type="text" value={item.data?.title || ''} onChange={(e) => onUpdateNode(item.id, { ...item.data, title: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-indigo-500/30 transition-all font-bold" placeholder="Eje: Reel Educativo - Errores Comunes" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Fase (Embudo)</label>
                      <select value={item.data?.funnelPhase || 'conciencia'} onChange={(e) => onUpdateNode(item.id, { ...item.data, funnelPhase: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-gray-300 focus:outline-none font-medium appearance-none">
                          <option value="conciencia">Conciencia</option>
                          <option value="consideracion">Consideración</option>
                          <option value="decision">Decisión</option>
                          <option value="conversion">Conversión</option>
                          <option value="fidelizacion">Fidelización</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Color Label</label>
                      <div className="flex gap-2 p-2 bg-white/[0.03] rounded-xl border border-white/5 items-center justify-between my-auto h-full px-4">
                         {['#6366f1', '#f59e0b', '#ec4899', '#10b981', '#0ea5e9'].map(color => (
                            <div key={color} className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all ${item.data?.color === color ? 'border-2 border-white scale-125' : 'border border-transparent'}`} style={{ backgroundColor: color }} onClick={() => onUpdateNode(item.id, { ...item.data, color })} />
                         ))}
                      </div>
                   </div>
               </div>
            </section>

            {/* SECCIÓN 2: OBJETIVO ESTRATÉGICO */}
            <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">2. Objetivo Estratégico</span>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Qué busca lograr</label>
                  <textarea value={item.data?.objective || ''} onChange={(e) => onUpdateNode(item.id, { ...item.data, objective: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-gray-400 focus:outline-none focus:border-indigo-500/30 font-medium h-20 resize-none custom-scrollbar" placeholder="Ej: Atraer tráfico frío y generar autoridad..." />
               </div>
               <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Emoción</label>
                      <select value={item.data?.targetEmotion || ''} onChange={(e) => onUpdateNode(item.id, { ...item.data, targetEmotion: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-gray-300 focus:outline-none font-medium appearance-none">
                          <option value="">Seleccionar...</option>
                          <option value="curiosidad">Curiosidad</option>
                          <option value="dolor">Dolor / Frustración</option>
                          <option value="confianza">Confianza / Seguridad</option>
                          <option value="deseo">Deseo / Aspiración</option>
                          <option value="urgencia">Urgencia / FOMO</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Temp. Cliente</label>
                      <select value={item.data?.clientTemp || ''} onChange={(e) => onUpdateNode(item.id, { ...item.data, clientTemp: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-gray-300 focus:outline-none font-medium appearance-none">
                          <option value="">Seleccionar...</option>
                          <option value="frio">Frío (No conoce)</option>
                          <option value="tibio">Tibio (Conoce)</option>
                          <option value="caliente">Caliente (Listo)</option>
                      </select>
                   </div>
               </div>
            </section>

            {/* SECCIÓN 3: AUDIENCIA */}
            <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">3. Audiencia Core</span>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Problema Principal que Resuelve</label>
                  <input type="text" value={item.data?.mainProblem || ''} onChange={(e) => onUpdateNode(item.id, { ...item.data, mainProblem: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-white focus:outline-none focus:border-indigo-500/30 font-medium" placeholder="Ej: No saben cómo..." />
               </div>
            </section>

            {/* SECCIÓN 4 & 5: CONTENIDO Y ESTRUCTURA */}
            <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">4. Contenido & Estructura</span>
               </div>
               <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Formato Base</label>
                      <select value={item.data?.contentType || ''} onChange={(e) => onUpdateNode(item.id, { ...item.data, contentType: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-gray-300 focus:outline-none font-medium appearance-none">
                          <option value="">Seleccionar...</option>
                          <option value="reel">Reel / Sec. Corta</option>
                          <option value="video_largo">Video Largo</option>
                          <option value="carrusel">Carrusel</option>
                          <option value="diseno">Diseño Estático</option>
                          <option value="texto">Texto / Hilo</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Tipo de Guión</label>
                      <select value={item.data?.scriptType || ''} onChange={(e) => onUpdateNode(item.id, { ...item.data, scriptType: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-gray-300 focus:outline-none font-medium appearance-none">
                          <option value="">Seleccionar...</option>
                          <option value="educativo">Valor Educacional</option>
                          <option value="storytelling">Storytelling</option>
                          <option value="testimonio">Testimonial</option>
                          <option value="oferta">Oferta Directa</option>
                      </select>
                   </div>
               </div>
            </section>

            {/* SECCIÓN 6 & 7 & 8: EQUIPO Y PRODUCCIÓN */}
            <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">5. Equipo & Producción</span>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Roles Asignados</label>
                  <div className="flex flex-wrap gap-2">
                    {['Filmmaker', 'Editor', 'Diseñador', 'Copywriter'].map(role => {
                        const currentRoles = item.data?.teamRoles || [];
                        const isSelected = currentRoles.includes(role);
                        return (
                           <button key={role} onClick={() => {
                               const newRoles = isSelected ? currentRoles.filter(r => r !== role) : [...currentRoles, role];
                               onUpdateNode(item.id, { ...item.data, teamRoles: newRoles });
                           }} className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold tracking-wider transition-colors border ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/[0.02] border-white/10 text-gray-500 hover:text-white'}`}>
                               {role}
                           </button>
                        )
                    })}
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3 pt-2">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Cant. Output</label>
                      <input type="number" min="1" value={item.data?.outputCount || 1} onChange={(e) => onUpdateNode(item.id, { ...item.data, outputCount: parseInt(e.target.value) })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-white focus:outline-none focus:border-indigo-500/30 font-bold" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Duración/Talla</label>
                      <input type="text" value={item.data?.estDuration || ''} onChange={(e) => onUpdateNode(item.id, { ...item.data, estDuration: e.target.value })} className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[10px] text-white focus:outline-none focus:border-indigo-500/30 font-medium" placeholder="Ej: 30s / 5 slides" />
                   </div>
               </div>
            </section>

            {/* Action Buttons */}
            <section className="pt-6 mt-6 border-t border-white/5">
               <button 
                 onClick={() => isNode ? onDeleteNode(item.id) : onDeleteEdge(item.id)}
                 className="w-full py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/5 group flex items-center justify-center gap-2"
               >
                  <X className="w-3 h-3" /> Eliminar Nodo
               </button>
            </section>
          </div>
        )}

        {/* Planner Tab Content (Execution & Connection) */}
        {activeTab === 'planner' && isNode && (
             <section className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Ejecución & Planner</span>
                </div>
                
                {/* Send to Planner Action */}
                <button 
                   onClick={() => {
                        onUpdateNode(item.id, { ...item.data, plannerStatus: 'pending' });
                        alert(`Creando tareas para: ${item.data?.title || 'Nodo'}\n- Grabación\n- Edición\n- Publicación\n\nNODO ENVIADO AL PLANNER.`);
                   }}
                   className="w-full relative group overflow-hidden rounded-2xl p-[1px] shadow-2xl flex-shrink-0"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity bg-[length:200%_auto] animate-gradient-xy" />
                    <div className="relative bg-[#0A0A0F] rounded-2xl px-6 py-6 flex flex-col items-center justify-center gap-2 transition-all group-hover:bg-opacity-80">
                         <Calendar className="w-6 h-6 text-white animate-pulse" />
                         <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Enviar al Planner</span>
                         <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center mt-1">
                             Convierte este nodo en tareas asignables a tu equipo.
                         </span>
                    </div>
                </button>

                {/* Node Status (if in planner) */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Estado de Ejecución</span>
                    <div className="grid grid-cols-1 gap-2">
                         {['unassigned', 'pending', 'in_production', 'published'].map(status => {
                             const labels = { unassigned: 'No Iniciado', pending: 'Pendiente', in_production: 'En Producción', published: 'Publicado' };
                             const currentStatus = item.data?.plannerStatus || 'unassigned';
                             return (
                                 <button 
                                     key={status}
                                     onClick={() => onUpdateNode(item.id, { ...item.data, plannerStatus: status })}
                                     className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${currentStatus === status ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/[0.05]'}`}
                                 >
                                     {currentStatus === status ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-gray-600" />}
                                     <span className="text-[10px] font-bold uppercase tracking-widest">{labels[status]}</span>
                                 </button>
                             )
                         })}
                    </div>
                </div>
             </section>
        )}

        {/* Metrics Tab Content (Real Results vs Expected) */}
        {activeTab === 'metrics' && isNode && (
             <section className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Rendimiento (ROI)</span>
                </div>

                {/* Auto Score Logic */}
                {(() => {
                    const metricsScore = item.data?.metricsScore || 'none';
                    return (
                        <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center gap-2 ${
                            metricsScore === 'high' ? 'bg-emerald-500/10 border-emerald-500/30' :
                            metricsScore === 'mid' ? 'bg-amber-500/10 border-amber-500/30' :
                            metricsScore === 'low' ? 'bg-rose-500/10 border-rose-500/30' :
                            'bg-white/[0.02] border-white/5'
                        }`}>
                             <BarChart3 className={`w-6 h-6 ${
                                metricsScore === 'high' ? 'text-emerald-400' :
                                metricsScore === 'mid' ? 'text-amber-400' :
                                metricsScore === 'low' ? 'text-rose-400' :
                                'text-gray-500'
                             }`} />
                             <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mt-2 mb-1">
                                 {metricsScore === 'high' ? 'Alto Rendimiento' : metricsScore === 'mid' ? 'Optimizable' : metricsScore === 'low' ? 'Bajo Rendimiento' : 'Sin Datos de AI'}
                             </h4>
                             <p className="text-[9px] font-medium text-gray-400 text-center px-4">
                                {metricsScore === 'high' ? 'El nodo está generando conversiones por encima del objetivo esperado.' : 
                                 metricsScore === 'mid' ? 'Atrae volumen pero necesita mejorar llamados a la acción (CTA).' : 
                                 metricsScore === 'low' ? 'Requiere cambio urgente de hook o formato visual.' : 
                                 'Define tus objetivos y carga los datos reales para el análisis.'}
                             </p>
                        </div>
                    );
                })()}

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Expected vs Real</span>
                    
                    {['views', 'likes', 'leads', 'citas'].map(metric => {
                        const labels = { views: 'Views', likes: 'Interacciones', leads: 'Leads (Contactos)', citas: 'Citas (Calendario)' };
                        const obj = item.data?.metrics || {};
                        const expVal = obj[`${metric}_expected`] || 0;
                        const realVal = obj[`${metric}_real`] || 0;

                        return (
                            <div key={metric} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest pl-1">{labels[metric]}</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block pl-1 mb-1">Meta</label>
                                        <input 
                                           type="number" 
                                           value={expVal} 
                                           onChange={(e) => onUpdateNode(item.id, { ...item.data, metrics: { ...obj, [`${metric}_expected`]: parseInt(e.target.value) || 0 } })} 
                                           className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-[10px] text-white focus:outline-none focus:border-indigo-500" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest block pl-1 mb-1">Real</label>
                                        <input 
                                           type="number" 
                                           value={realVal} 
                                           onChange={(e) => onUpdateNode(item.id, { ...item.data, metrics: { ...obj, [`${metric}_real`]: parseInt(e.target.value) || 0 } })} 
                                           className="w-full bg-black/40 border border-indigo-500/30 rounded-xl py-2 px-3 text-[10px] text-white focus:outline-none focus:border-indigo-500" 
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <button 
                   onClick={() => {
                        // Demo Logic to trigger scoring
                        const m = item.data?.metrics || {};
                        const totalExp = (m.views_expected || 0) + (m.leads_expected || 0) + (m.citas_expected || 0);
                        const totalReal = (m.views_real || 0) + (m.leads_real || 0) + (m.citas_real || 0);
                        
                        let s = 'none';
                        if (totalExp > 0 && totalReal > 0) {
                            if (totalReal >= totalExp) s = 'high';
                            else if (totalReal >= totalExp * 0.5) s = 'mid';
                            else s = 'low';
                        } else {
                            alert("Por favor ingresa datos esperados y reales primero.");
                            return;
                        }

                        onUpdateNode(item.id, { ...item.data, metricsScore: s });
                   }}
                   className="w-full py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-indigo-500/5"
                >
                    Analizar Rendimiento
                </button>
             </section>
        )}

        {/* Memory Tab Content */}
        {activeTab === 'memory' && isNode && (
             <section className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Memory & Data</span>
                </div>

                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center hover:bg-amber-500/20 cursor-pointer transition-all shadow-inner">
                   <div className="w-10 h-10 bg-amber-500 flex items-center justify-center rounded-xl mx-auto mb-3 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                       <Grid className="w-5 h-5 text-white" />
                   </div>
                   <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1.5">Knowledge Base</h4>
                   <p className="text-[9px] text-amber-300 font-medium leading-relaxed">Sube documentos o enlaces para dar contexto a este nodo.</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block pl-2">Current Variables</label>
                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-[10px] font-mono text-gray-400 break-all">
                        <span className="text-pink-500">const</span> context = <span className="text-amber-500">{'{'}</span><br/>
                        &nbsp;&nbsp;<span className="text-cyan-400">"status"</span>: <span className="text-emerald-400">"uninitialized"</span><br/>
                        <span className="text-amber-500">{'}'}</span>;
                    </div>
                </div>
             </section>
        )}

        {/* CRM Integration Tab Content */}
        {activeTab === 'crm' && isConversionNode && (
             <section className="space-y-8 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Integración CRM</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link2 className="w-4 h-4 text-gray-400" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Activar Sync CRM</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={item.data?.crmActive || false}
                                onChange={(e) => onUpdateNode(item.id, { ...item.data, crmActive: e.target.checked })}
                            />
                            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                        </label>
                    </div>
                    {item.data?.crmActive && (
                        <p className="text-[9px] font-medium text-rose-300 leading-relaxed border-t border-white/5 pt-3">
                            Los leads generados por este nodo serán enviados automáticamente a tu embudo en Crecimiento Digital.
                        </p>
                    )}
                </div>

                {item.data?.crmActive && (
                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block pl-2">Tipo de Entrada (Origen)</label>
                            <select 
                                value={item.data?.crmSource || 'whatsapp'}
                                onChange={(e) => onUpdateNode(item.id, { ...item.data, crmSource: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-rose-500/50 appearance-none font-bold"
                            >
                                <option value="whatsapp">Mensaje WhatsApp</option>
                                <option value="form">Formulario Web</option>
                                <option value="dm">Mensaje Directo (IG/FB)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block pl-2">Pipeline de Destino</label>
                            <select 
                                value={item.data?.crmPipeline || 'ventas_principales'}
                                onChange={(e) => onUpdateNode(item.id, { ...item.data, crmPipeline: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-rose-500/50 appearance-none font-bold"
                            >
                                <option value="ventas_principales">Ventas Principales</option>
                                <option value="lanzamiento">Lanzamiento VIP</option>
                                <option value="servicios_high_ticket">High Ticket</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block pl-2">Etapa Inicial</label>
                            <select 
                                value={item.data?.crmStage || 'nuevo_lead'}
                                onChange={(e) => onUpdateNode(item.id, { ...item.data, crmStage: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-rose-500/50 appearance-none font-bold"
                            >
                                <option value="nuevo_lead">📥 Nuevo Lead</option>
                                <option value="contacto_iniciado">💬 Contacto Iniciado</option>
                                <option value="reunion_agendada">📅 Reunión Agendada</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block pl-2">Asignar Responsable</label>
                            <select 
                                value={item.data?.crmAssignee || 'auto'}
                                onChange={(e) => onUpdateNode(item.id, { ...item.data, crmAssignee: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 text-[11px] text-white focus:outline-none focus:border-rose-500/50 appearance-none font-bold"
                            >
                                <option value="auto">Rotación Automática</option>
                                <option value="equipo_ventas_1">Equipo Ventas 1</option>
                                <option value="cerrador_vip">Cerrador VIP</option>
                            </select>
                        </div>

                        <button 
                            onClick={() => alert(`Abriendo pipeline "${item.data?.crmPipeline || 'Ventas Principales'}" en el CRM filtrado por este nodo.`)}
                            className="w-full mt-6 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/5 group"
                        >
                            <span>Ver Leads en CRM</span>
                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                )}
             </section>
        )}

      </div>
      
      {/* Floating Tooltips or specific context helpers */}
      <div className="absolute bottom-6 left-6 right-6">
         <div className="bg-indigo-600 p-4 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest flex items-center justify-between shadow-2xl shadow-indigo-500/20">
            <span>AI Suggestion Active</span>
            <Zap className="w-3 h-3 fill-white" />
         </div>
      </div>
    </div>
  );
}
