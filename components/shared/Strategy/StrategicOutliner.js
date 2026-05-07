'use client';

import React from 'react';
import { Search, ChevronDown, ChevronRight, Hash, Globe, Target, Rocket, Zap, MessageSquare, Database, ListTree, FolderTree, Binary, Eye, EyeOff, Folder, Video, Instagram, Type as TypeIcon, Layout, Music, Mic, Youtube } from 'lucide-react';
import { NODE_TYPES, NODE_CATEGORIES, getNodeLaneId } from './StrategyConstants';

export default function StrategicOutliner({ nodes, activeNodeId, onNodeSelect, onUpdateNode, theme = 'dark' }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [collapsedGroups, setCollapsedGroups] = React.useState({});

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const toggleVisibility = (e, node) => {
    e.stopPropagation();
    onUpdateNode(node.id, { 
      ...node.data, 
      isHidden: !node.data?.isHidden 
    });
  };

  // Detailed Grouping by Type/Format and Sub-type
  const formatGroups = {
    'hub_videos': { id: 'hub_videos', label: 'VIDEOS', icon: Video, color: '#f43f5e', nodes: [] },
    'hub_posts': { id: 'hub_posts', label: 'POSTS', icon: Layout, color: '#818cf8', nodes: [] },
    'hub_stories': { id: 'hub_stories', label: 'STORIES', icon: Instagram, color: '#f97316', nodes: [] },
    'hub_reels': { id: 'hub_reels', label: 'REELS', icon: PlayCircle, color: '#10b981', nodes: [] },
    'hub_tiktok': { id: 'hub_tiktok', label: 'TIK TOK', icon: Music, color: '#22d3ee', nodes: [] },
    'hub_crm': { id: 'hub_crm', label: 'FLUJOS CRM', icon: Database, color: '#10b981', nodes: [] },
    'hub_forms': { id: 'hub_forms', label: 'FORMS', icon: Target, color: '#22d3ee', nodes: [] },
    'otros': { id: 'otros', label: 'OTROS RECURSOS', icon: Binary, color: '#94a3b8', nodes: [] }
  };

  nodes.forEach(node => {
    if (searchTerm && !(node.data?.title || '').toLowerCase().includes(searchTerm.toLowerCase())) return;
    
    // Use the same logic as the canvas to identify the hub
    const laneId = getNodeLaneId(node);
    let target = 'otros';

    if (laneId) {
        // Map laneIds to outliner groups
        const laneToGroup = {
            'v_youtube': 'hub_videos',
            'i_post': 'hub_posts',
            'i_historias': 'hub_stories',
            'v_historias': 'hub_stories',
            'v_reels': 'hub_reels',
            'v_tiktok': 'hub_tiktok',
            'l3_crm_email': 'hub_crm',
            'r_form': 'hub_forms'
        };
        target = laneToGroup[laneId] || 'otros';
    } else {
        const type = (node.type || "").toLowerCase();
        if (type === 'label' || type === 'sticky') target = 'otros';
    }

    if (formatGroups[target]) {
        formatGroups[target].nodes.push(node);
    } else {
        formatGroups['otros'].nodes.push(node);
    }
  });

  return (
    <div className={`w-64 border-r flex flex-col h-full z-[70] shadow-2xl relative overflow-hidden group/outliner transition-all duration-700 ${theme === 'dark' ? 'bg-[#050511] border-white/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/20'}`}>
      {/* Subtle Glow Background */}
      <div className={`absolute top-0 left-0 w-full h-[300px] pointer-events-none ${theme === 'dark' ? 'bg-gradient-to-b from-indigo-500/5 to-transparent' : 'bg-gradient-to-b from-slate-100 to-transparent'}`} />

      {/* Header Area - Increased Spacing for breathing room */}
      <div className="p-5 pt-9 space-y-7 relative z-10">
        <div className="flex justify-between items-end px-1">
          <h2 className={`text-[12px] font-black italic uppercase tracking-[0.4em] leading-none transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Outliner
          </h2>
          <span className={`text-[9px] font-black uppercase tracking-widest leading-none transition-colors duration-500 ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`}>
            {nodes.length} Nodes
          </span>
        </div>
        
        <div className="relative group/search">
          <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/[0.02] group-hover/search:bg-white/[0.04]' : 'bg-slate-50 border border-slate-200'}`} />
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 group-focus-within/search:text-indigo-500 transition-colors ${theme === 'dark' ? 'text-gray-700' : 'text-slate-400'}`} />
          <input 
            type="text" 
            placeholder="Search strategy..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-transparent border border-transparent rounded-2xl py-3 pl-11 pr-4 text-[11px] placeholder:text-gray-700 focus:outline-none focus:border-indigo-500/20 transition-all font-bold tracking-tight ${theme === 'dark' ? 'text-gray-400' : 'text-slate-900'}`}
          />
        </div>
      </div>

      {/* Main Content: Tree View */}
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-1 custom-scrollbar relative z-10">
        
        {/* Strategy Root - More distinct heading */}
        <div className={`flex items-center gap-3 px-3 py-4 mt-4 cursor-default group/root border-b mb-2 transition-all ${theme === 'dark' ? 'text-indigo-400/80 border-indigo-500/5' : 'text-indigo-600 border-indigo-100'}`}>
           <FolderTree className="w-4 h-4 group-hover:scale-110 transition-transform text-indigo-500" />
           <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${theme === 'dark' ? 'text-indigo-400/90' : 'text-indigo-600'}`}>Main Strategy</span>
        </div>
        
        {/* Render Formats */}
        {Object.values(formatGroups).map((group) => {
          if (group.nodes.length === 0 && !searchTerm) return null;
          const isCollapsed = collapsedGroups[group.id];
          
          let hasAnyVisible = false;
          group.nodes.forEach(n => {
            if (!n.data?.isHidden) hasAnyVisible = true;
          });
          const allHidden = !hasAnyVisible && group.nodes.length > 0;

          const toggleGroupVisibility = (e) => {
            e.stopPropagation();
            const targetState = !allHidden;
            group.nodes.forEach(node => {
                onUpdateNode(node.id, { ...node.data, isHidden: targetState });
            });
          };

          const Icon = group.icon;

          return (
            <div key={group.id} className="space-y-0.5">
              {/* Format Header */}
              <div 
                onClick={() => toggleGroup(group.id)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer group/week transition-all rounded-xl border transition-all duration-300 ${
                    theme === 'dark' 
                    ? 'text-gray-400 hover:text-white bg-white/[0.01] border-transparent hover:border-white/5' 
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-100 hover:border-slate-200'
                } ${group.id === 'recursos' && theme === 'dark' ? 'bg-indigo-500/[0.03] border-indigo-500/10' : ''} ${group.id === 'recursos' && theme === 'light' ? 'bg-indigo-50/50 border-indigo-100' : ''}`}
              >
                <div className="shrink-0 transition-transform duration-300">
                    {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
                <div className="flex flex-col flex-1 gap-0.5">
                    <span className={`text-[9px] font-black uppercase tracking-[0.25em] transition-colors duration-500 ${group.id === 'recursos' ? 'text-indigo-500' : theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{group.label}</span>
                    <span className={`text-[6.5px] font-black uppercase tracking-widest transition-colors duration-500 ${theme === 'dark' ? 'text-gray-800' : 'text-slate-300'}`}>{group.nodes.length} Elementos</span>
                </div>
                
                <button 
                  onClick={toggleGroupVisibility}
                  className={`p-1.5 rounded-lg transition-all ${allHidden ? 'text-rose-400 opacity-100' : 'text-gray-700 opacity-0 group-hover/week:opacity-100'}`}
                >
                   {allHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Nodes within Format */}
              {!isCollapsed && (
                <div className="ml-3 border-l border-white/5 pl-2 space-y-0.5 mt-1 py-1">
                  {group.nodes.map(node => {
                    const isSelected = activeNodeId === node.id;
                    const typeConfig = NODE_TYPES[node.type] || { icon: Binary };
                    const NodeIcon = typeConfig.icon || group.icon;
                    const isHidden = node.data?.isHidden;
                    
                    return (
                      <div 
                        key={node.id} 
                        onClick={() => onNodeSelect(node.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all relative group/item ${
                          isSelected 
                          ? (theme === 'dark' ? 'bg-white/5 text-white shadow-lg' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20') 
                          : (theme === 'dark' ? 'text-gray-600 hover:text-gray-300' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50')
                        } ${isHidden ? 'opacity-40 grayscale' : ''}`}
                      >
                        {isSelected && (
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3.5 rounded-full ${theme === 'dark' ? 'bg-indigo-500' : 'bg-white'}`} />
                        )}
                        
                        <NodeIcon className={`w-3 h-3 ${isSelected ? 'opacity-100' : 'opacity-30 group-hover/item:opacity-70'} ${isSelected && theme === 'dark' ? 'text-indigo-400' : ''}`} />
                        
                        <span className={`text-[9.2px] font-bold truncate flex-1 tracking-tight transition-colors duration-500 ${isSelected ? 'text-white' : (theme === 'dark' ? 'text-gray-500 group-hover/item:text-gray-400' : 'text-slate-600 group-hover/item:text-slate-900')}`}>
                           {node.data?.title || typeConfig.label}
                        </span>

                        <button 
                          onClick={(e) => toggleVisibility(e, node)}
                          className={`p-1 rounded-md transition-all ${isHidden ? 'text-rose-400 bg-rose-500/10' : 'text-gray-700 hover:text-indigo-400 hover:bg-white/5'} opacity-0 group-hover/item:opacity-100`}
                        >
                          {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Removed Logical Groups section as requested */}
      </div>

      {/* Footer Branding */}
      <div className={`p-6 pt-4 border-t relative z-10 transition-colors duration-500 ${theme === 'dark' ? 'border-white/5 bg-black/40 backdrop-blur-md' : 'border-slate-100 bg-white'}`}>
         <div className="flex justify-between items-center opacity-60">
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
               <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
               <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-700' : 'text-slate-300'}`}>System v2.1</span>
         </div>
      </div>
    </div>
  );
}

