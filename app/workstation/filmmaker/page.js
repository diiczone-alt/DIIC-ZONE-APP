'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Calendar as CalendarIcon, MapPin, Camera, UploadCloud,
    CheckSquare, Clock, Film, MoreVertical, Search, Filter,
    ArrowRight, Bell, MessageSquare, PlayCircle, Plus,
    Layout, List, Inbox, Video, FileText, Download,
    MoreHorizontal, CheckCircle, AlertCircle, ChevronLeft, ChevronRight,
    Sparkles, Grid as GridIcon, X, Users, Send
} from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// --- HELPERS ---
const parseAssets = (assets) => {
    const defaultVal = {
        equipment: [],
        script_url: '',
        materials_url: '',
        description: '',
        script_blocks: [],
        assigned_team: [],
        checklist: {}
    };
    if (!assets) return defaultVal;
    if (Array.isArray(assets)) {
        return { ...defaultVal, equipment: assets };
    }
    if (typeof assets === 'object') {
        return {
            equipment: Array.isArray(assets.equipment) ? assets.equipment : [],
            script_url: assets.script_url || '',
            materials_url: assets.materials_url || '',
            description: assets.description || '',
            script_blocks: Array.isArray(assets.script_blocks) ? assets.script_blocks : [],
            assigned_team: Array.isArray(assets.assigned_team) ? assets.assigned_team : [],
            checklist: assets.checklist || {}
        };
    }
    return defaultVal;
};

const getThumbForClient = (clientName) => {
    if (!clientName) return 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=60';
    const lower = clientName.toLowerCase();
    if (lower.includes('novaclinica') || lower.includes('clinica') || lower.includes('hospital') || lower.includes('rey')) {
        return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60';
    }
    if (lower.includes('pizza') || lower.includes('vito')) {
        return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60';
    }
    if (lower.includes('agro') || lower.includes('campo') || lower.includes('finca')) {
        return 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=60';
    }
    return 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=60';
};

const getRelativeDayName = (dateStr) => {
    if (!dateStr) return '--';
    try {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const [year, month, day] = dateStr.split('-');
        const targetDate = new Date(year, month - 1, day);
        targetDate.setHours(0,0,0,0);
        
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Mañana';
        if (diffDays === -1) return 'Ayer';
        
        return targetDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });
    } catch (e) {
        return dateStr;
    }
};

const COLUMNS = [
    { id: 'pre-pro', label: 'Pre-Pro', color: 'border-blue-500', bg: 'bg-blue-500/5' },
    { id: 'shooting', label: 'En Rodaje', color: 'border-red-500', bg: 'bg-red-500/5' },
    { id: 'post-pro', label: 'Edición', color: 'border-purple-500', bg: 'bg-purple-500/5' },
    { id: 'review', label: 'Revisión', color: 'border-amber-500', bg: 'bg-amber-500/5' },
    { id: 'done', label: 'Finalizado', color: 'border-emerald-500', bg: 'bg-emerald-500/5' }
];

export default function FilmmakerDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('board');
    const [projects, setProjects] = useState([]);
    const [inbox, setInbox] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [selectedProject, setSelectedProject] = useState(null);
    const [dailyNotes, setDailyNotes] = useState({});
    const [dailyTasks, setDailyTasks] = useState({});

    // Load notes and tasks from localStorage on mount
    useEffect(() => {
        const storedNotes = localStorage.getItem('filmmaker_daily_notes');
        if (storedNotes) {
            try {
                setDailyNotes(JSON.parse(storedNotes));
            } catch (e) {
                console.error('Error parsing daily notes:', e);
            }
        }
        const storedTasks = localStorage.getItem('filmmaker_daily_tasks');
        if (storedTasks) {
            try {
                setDailyTasks(JSON.parse(storedTasks));
            } catch (e) {
                console.error('Error parsing daily tasks:', e);
            }
        }
    }, []);

    const saveDailyNote = (dateStr, text) => {
        const updated = {
            ...dailyNotes,
            [dateStr]: text
        };
        setDailyNotes(updated);
        localStorage.setItem('filmmaker_daily_notes', JSON.stringify(updated));
    };

    const toggleDailyTask = (dateStr, taskIdx) => {
        const dayTasks = dailyTasks[dateStr] || [];
        const updatedDayTasks = dayTasks.map((t, idx) => 
            idx === taskIdx ? { ...t, completed: !t.completed } : t
        );
        const updated = {
            ...dailyTasks,
            [dateStr]: updatedDayTasks
        };
        setDailyTasks(updated);
        localStorage.setItem('filmmaker_daily_tasks', JSON.stringify(updated));
    };

    const addDailyTask = (dateStr, text) => {
        if (!text.trim()) return;
        const dayTasks = dailyTasks[dateStr] || [];
        const updatedDayTasks = [...dayTasks, { text: text.trim(), completed: false }];
        const updated = {
            ...dailyTasks,
            [dateStr]: updatedDayTasks
        };
        setDailyTasks(updated);
        localStorage.setItem('filmmaker_daily_tasks', JSON.stringify(updated));
    };

    const removeDailyTask = (dateStr, taskIdx) => {
        const dayTasks = dailyTasks[dateStr] || [];
        const updatedDayTasks = dayTasks.filter((_, idx) => idx !== taskIdx);
        const updated = {
            ...dailyTasks,
            [dateStr]: updatedDayTasks
        };
        setDailyTasks(updated);
        localStorage.setItem('filmmaker_daily_tasks', JSON.stringify(updated));
    };

    // Script Modal State
    const [selectedScriptEvent, setSelectedScriptEvent] = useState(null);
    const [showScriptModal, setShowScriptModal] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .or('assigned_role.eq.FILMMAKER,title.ilike.%Rodaje%');
                
            if (error) throw error;
            
            // Also fetch the real team list from database
            const { data: teamData } = await supabase
                .from('team')
                .select('*')
                .order('name', { ascending: true });
            if (teamData) {
                setTeamMembers(teamData);
            }

            const loadedTasks = data || [];
            
            // Map requests (pending status)
            const solicitudes = loadedTasks
                .filter(t => t.status === 'pending')
                .map(t => {
                    const parts = t.notes ? t.notes.split(' | Contacto: ') : [];
                    const contact = parts[1] || 'No especificado';
                    return {
                        id: t.id.toString(),
                        from: `${contact} (${t.client})`,
                        client: t.client,
                        title: t.title,
                        desc: t.assets?.description || t.notes || 'Sin descripción o briefing aún.',
                        date: getRelativeDayName(t.deadline),
                        deadline: t.deadline,
                        assets: t.assets?.equipment?.length || 0,
                        rawAssets: t.assets || {},
                        duration: t.duration || 'Hora no definida',
                        notes: t.notes,
                        type: t.title.toLowerCase().includes('reel') ? 'Redes' : t.title.toLowerCase().includes('corporativo') ? 'Corporativo' : 'Producción',
                        priority: t.priority || 'medium'
                    };
                });
                
            // Map board projects (statuses other than pending or cancelled)
            const boardProjects = loadedTasks
                .filter(t => t.status !== 'pending' && t.status !== 'cancelled')
                .map(t => {
                    let mappedStatus = t.status;
                    if (mappedStatus === 'confirmed') {
                        mappedStatus = 'pre-pro'; // Default confirmed to Pre-Pro on the board
                    }
                    
                    let progress = 20;
                    if (mappedStatus === 'shooting') progress = 40;
                    else if (mappedStatus === 'post-pro') progress = 60;
                    else if (mappedStatus === 'review') progress = 80;
                    else if (mappedStatus === 'done') progress = 100;
                    
                    return {
                        id: t.id.toString(),
                        client: t.client,
                        title: t.title,
                        type: t.title.toLowerCase().includes('reel') ? 'Redes' : t.title.toLowerCase().includes('corporativo') ? 'Corporativo' : 'Producción',
                        deadline: t.deadline,
                        status: mappedStatus,
                        priority: t.priority || 'medium',
                        thumb: getThumbForClient(t.client),
                        progress: progress,
                        notes: t.notes,
                        assets: t.assets,
                        duration: t.duration || 'Hora no definida'
                    };
                });
                
            setInbox(solicitudes);
            setProjects(boardProjects);
        } catch (err) {
            console.error('[Dashboard] Error fetching tasks:', err);
            toast.error('Error al sincronizar las producciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // --- ACTIONS ---
    const moveTaskToBoard = async (taskId) => {
        try {
            const task = inbox.find(t => t.id === taskId);
            if (!task) return;
            
            const { error } = await supabase
                .from('tasks')
                .update({ status: 'pre-pro' })
                .eq('id', parseInt(taskId));
                
            if (error) throw error;
            
            toast.success('¡Solicitud aceptada y movida al tablero de producción!');
            
            // Move locally
            const newProject = {
                id: task.id,
                client: task.client || 'Nuevo Cliente',
                title: task.title,
                type: task.type || 'General',
                deadline: task.deadline,
                status: 'pre-pro',
                priority: task.priority || 'medium',
                thumb: getThumbForClient(task.client),
                progress: 20,
                duration: task.duration || 'Hora no definida',
                notes: task.notes || '',
                assets: task.rawAssets || {}
            };
            setProjects(prev => [...prev.filter(p => p.id !== task.id), newProject]);
            setInbox(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            console.error('[Dashboard] Error accepting task:', err);
            toast.error('No se pudo aceptar la solicitud.');
        }
    };

    const rejectTask = async (taskId) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ status: 'cancelled' })
                .eq('id', parseInt(taskId));
                
            if (error) throw error;
            
            toast.error('Solicitud rechazada/cancelada.');
            setInbox(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            console.error('[Dashboard] Error rejecting task:', err);
            toast.error('No se pudo rechazar la solicitud.');
        }
    };

    const handleDragStart = (e, projectId) => {
        e.dataTransfer.setData('projectId', projectId);
    };

    const handleDrop = async (e, status) => {
        const projectId = e.dataTransfer.getData('projectId');
        if (projectId) {
            // Update locally first for immediate feedback
            setProjects(prev => prev.map(p => {
                if (p.id === projectId) {
                    let progress = 20;
                    if (status === 'shooting') progress = 40;
                    else if (status === 'post-pro') progress = 60;
                    else if (status === 'review') progress = 80;
                    else if (status === 'done') progress = 100;
                    return { ...p, status, progress };
                }
                return p;
            }));
            
            try {
                const { error } = await supabase
                    .from('tasks')
                    .update({ status })
                    .eq('id', parseInt(projectId));
                    
                if (error) throw error;
                toast.success('Estado de producción actualizado.');
            } catch (err) {
                console.error('[Dashboard] Error updating drop status:', err);
                toast.error('No se pudo guardar el nuevo estado.');
                fetchTasks();
            }
        }
    };

    const updateProjectStatus = async (projectId, newStatus) => {
        try {
            // Update locally for instant responsiveness
            setProjects(prev => prev.map(p => {
                if (p.id === projectId) {
                    let progress = 20;
                    if (newStatus === 'shooting') progress = 40;
                    else if (newStatus === 'post-pro') progress = 60;
                    else if (newStatus === 'review') progress = 80;
                    else if (newStatus === 'done') progress = 100;
                    return { ...p, status: newStatus, progress };
                }
                return p;
            }));
            
            // If the selectedProject is currently open, update it too
            setSelectedProject(prev => {
                if (prev && prev.id === projectId) {
                    return { ...prev, status: newStatus };
                }
                return prev;
            });

            const { error } = await supabase
                .from('tasks')
                .update({ status: newStatus })
                .eq('id', parseInt(projectId));
                
            if (error) throw error;
            toast.success('Estado de producción actualizado.');
        } catch (err) {
            console.error('[Dashboard] Error updating status:', err);
            toast.error('No se pudo actualizar el estado.');
            fetchTasks();
        }
    };

    const toggleChecklistItem = async (projectId, itemLabel) => {
        try {
            const project = projects.find(p => p.id === projectId);
            if (!project) return;
            
            const assetsData = parseAssets(project.assets);
            const currentChecklist = assetsData.checklist;
            
            const updatedChecklist = {
                ...currentChecklist,
                [itemLabel]: !currentChecklist[itemLabel]
            };
            
            const updatedAssets = {
                ...assetsData,
                checklist: updatedChecklist
            };
            
            // Update locally
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, assets: updatedAssets } : p));
            setSelectedProject(prev => prev && prev.id === projectId ? { ...prev, assets: updatedAssets } : prev);
            
            // Update Supabase
            const { error } = await supabase
                .from('tasks')
                .update({ assets: updatedAssets })
                .eq('id', parseInt(projectId));
                
            if (error) throw error;
            toast.success('Checklist actualizado.');
        } catch (err) {
            console.error('[Dashboard] Error updating checklist:', err);
            toast.error('No se pudo actualizar el checklist.');
            fetchTasks();
        }
    };

    const onAddTeamMember = async (projectId, memberId) => {
        try {
            const project = projects.find(p => p.id === projectId);
            if (!project) return;
            
            const assetsData = parseAssets(project.assets);
            const currentTeam = assetsData.assigned_team;
            
            if (currentTeam.includes(memberId)) return;
            const updatedTeam = [...currentTeam, memberId];
            
            const updatedAssets = {
                ...assetsData,
                assigned_team: updatedTeam
            };
            
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, assets: updatedAssets } : p));
            setSelectedProject(prev => prev && prev.id === projectId ? { ...prev, assets: updatedAssets } : prev);
            
            const { error } = await supabase
                .from('tasks')
                .update({ assets: updatedAssets })
                .eq('id', parseInt(projectId));
                
            if (error) throw error;
            toast.success('Miembro de equipo asignado.');
        } catch (err) {
            console.error('[Dashboard] Error assigning team member:', err);
            toast.error('No se pudo asignar al miembro.');
            fetchTasks();
        }
    };

    const onRemoveTeamMember = async (projectId, memberId) => {
        try {
            const project = projects.find(p => p.id === projectId);
            if (!project) return;
            
            const assetsData = parseAssets(project.assets);
            const currentTeam = assetsData.assigned_team;
            
            const updatedTeam = currentTeam.filter(id => id !== memberId);
            
            const updatedAssets = {
                ...assetsData,
                assigned_team: updatedTeam
            };
            
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, assets: updatedAssets } : p));
            setSelectedProject(prev => prev && prev.id === projectId ? { ...prev, assets: updatedAssets } : prev);
            
            const { error } = await supabase
                .from('tasks')
                .update({ assets: updatedAssets })
                .eq('id', parseInt(projectId));
                
            if (error) throw error;
            toast.error('Miembro de equipo removido.');
        } catch (err) {
            console.error('[Dashboard] Error removing team member:', err);
            toast.error('No se pudo remover al miembro.');
            fetchTasks();
        }
    };

    const onAddEquipment = async (projectId, equipmentName) => {
        try {
            const project = projects.find(p => p.id === projectId);
            if (!project) return;
            
            const assetsData = parseAssets(project.assets);
            const currentEquipment = assetsData.equipment;
            
            if (currentEquipment.includes(equipmentName)) return;
            const updatedEquipment = [...currentEquipment, equipmentName];
            
            const updatedAssets = {
                ...assetsData,
                equipment: updatedEquipment
            };
            
            // Update locally
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, assets: updatedAssets } : p));
            setSelectedProject(prev => prev && prev.id === projectId ? { ...prev, assets: updatedAssets } : prev);
            
            // Update Supabase
            const { error } = await supabase
                .from('tasks')
                .update({ assets: updatedAssets })
                .eq('id', parseInt(projectId));
                
            if (error) throw error;
            toast.success('Equipo añadido al rodaje.');
        } catch (err) {
            console.error('[Dashboard] Error adding equipment:', err);
            toast.error('No se pudo añadir el equipo.');
            fetchTasks();
        }
    };

    const onRemoveEquipment = async (projectId, equipmentName) => {
        try {
            const project = projects.find(p => p.id === projectId);
            if (!project) return;
            
            const assetsData = parseAssets(project.assets);
            const currentEquipment = assetsData.equipment;
            
            const updatedEquipment = currentEquipment.filter(item => item !== equipmentName);
            
            const updatedAssets = {
                ...assetsData,
                equipment: updatedEquipment
            };
            
            // Update locally
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, assets: updatedAssets } : p));
            setSelectedProject(prev => prev && prev.id === projectId ? { ...prev, assets: updatedAssets } : prev);
            
            // Update Supabase
            const { error } = await supabase
                .from('tasks')
                .update({ assets: updatedAssets })
                .eq('id', parseInt(projectId));
                
            if (error) throw error;
            toast.error('Equipo removido del rodaje.');
        } catch (err) {
            console.error('[Dashboard] Error removing equipment:', err);
            toast.error('No se pudo remover el equipo.');
            fetchTasks();
        }
    };

    const onOpenScript = (project) => {
        setSelectedScriptEvent(project);
        setShowScriptModal(true);
    };

    const handleDragOver = (e) => e.preventDefault();

    // --- CALENDAR HELPERS ---
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#050511] h-screen">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div id="page-root-wrapper" className="flex-1 flex flex-col h-full overflow-hidden bg-[#050511]">
            {/* Styles injection for Print Layout ( window.print() ) */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    /* Hide sidebar, topbar and other layout non-prints */
                    aside, header, nav, button, .no-print, [role="navigation"] {
                        display: none !important;
                    }
                    
                    /* Force base pages flow for printing */
                    html, body {
                        background: white !important;
                        color: black !important;
                        height: auto !important;
                        overflow: visible !important;
                    }
                    
                    /* Ensure scrollable wrappers show all printed contents */
                    div, main {
                        display: block !important;
                        height: auto !important;
                        overflow: visible !important;
                        position: static !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    /* Hide everything inside page root wrapper except the print model */
                    #page-root-wrapper > *:not(#print-script-modal) {
                        display: none !important;
                    }
                    
                    /* Clean courier script alignment */
                    #print-script-modal {
                        display: block !important;
                        visibility: visible !important;
                        position: relative !important;
                        width: 100% !important;
                        background: white !important;
                        color: black !important;
                        padding: 30px !important;
                        font-family: 'Courier New', Courier, monospace !important;
                        font-size: 12pt !important;
                        line-height: 1.5 !important;
                    }
                    
                    #print-script-modal * {
                        color: black !important;
                        background: transparent !important;
                        border-color: #d1d5db !important;
                    }
                }
            `}} />
            {/* Toolbar */}
            <div className="flex items-center justify-between px-8 py-4 bg-black/10 border-b border-white/5 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex bg-[#0E0E18] p-1 rounded-lg border border-white/10">
                        <button onClick={() => setActiveTab('board')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'board' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Layout className="w-3.5 h-3.5" /> Tablero
                        </button>
                        <button onClick={() => setActiveTab('inbox')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${activeTab === 'inbox' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Inbox className="w-3.5 h-3.5" /> Solicitudes
                            {inbox.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                        </button>
                        <button onClick={() => setActiveTab('calendar')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'calendar' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <CalendarIcon className="w-3.5 h-3.5" /> Agenda
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-white/10">
                        <Plus className="w-3.5 h-3.5" /> Nuevo Proyecto
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {/* --- KANBAN BOARD --- */}
                    {activeTab === 'board' && (
                        <motion.div key="board" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex gap-6 p-8 overflow-x-auto">
                            {COLUMNS.map(col => (
                                <div
                                    key={col.id}
                                    className={`min-w-[300px] flex flex-col h-full rounded-2xl transition-colors ${col.bg}`}
                                    onDrop={(e) => handleDrop(e, col.id)}
                                    onDragOver={handleDragOver}
                                >
                                    <div className={`flex items-center justify-between mb-4 p-4 border-b-2 ${col.color}`}>
                                        <h3 className="font-bold text-white text-sm">{col.label}</h3>
                                        <span className="text-xs text-gray-500 font-mono bg-black/20 px-2 py-0.5 rounded-full">{projects.filter(p => p.status === col.id).length}</span>
                                    </div>
                                    <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 custom-scrollbar">
                                        {projects.filter(p => p.status === col.id).map(project => (
                                            <div
                                                key={project.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, project.id)}
                                                onClick={() => setSelectedProject(project)}
                                                className="cursor-pointer active:cursor-grabbing"
                                            >
                                                <ProjectCard project={project} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* --- INBOX --- */}
                    {activeTab === 'inbox' && (
                        <motion.div key="inbox" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full p-8 max-w-5xl mx-auto overflow-y-auto custom-scrollbar">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-cyan-600/20 rounded-lg text-cyan-400"><Inbox className="w-6 h-6" /></div>
                                Solicitudes de Producción
                            </h2>
                            <div className="space-y-4">
                                {inbox.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500"><CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" /><p>¡Todo al día!</p></div>
                                ) : (
                                    inbox.map(task => (
                                        <div key={task.id} className="bg-[#0E0E18] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">{task.from.substring(0, 2)}</div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">{task.title}</h3>
                                                        <p className="text-xs text-cyan-400 font-medium">De: {task.from} • {task.date}</p>
                                                    </div>
                                                </div>
                                                <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">Deadline: {task.deadline}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-6 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{task.desc}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1 hover:text-white cursor-pointer"><FileText className="w-4 h-4" /> {task.assets} Equipos</span>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => rejectTask(task.id)} className="px-4 py-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">Rechazar</button>
                                                    <button onClick={() => moveTaskToBoard(task.id)} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/40 transition-all flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Aceptar</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'calendar' && (
                        <motion.div key="calendar" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full flex gap-6 p-8 overflow-hidden">
                            {/* Calendar Grid Container (Left) */}
                            <div className="flex-1 bg-gradient-to-br from-[#0E0E18]/90 to-[#050511] relative p-6 rounded-[2rem] border border-cyan-500/10 flex flex-col shadow-2xl overflow-hidden shadow-cyan-900/5">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-2xl font-black text-white capitalize tracking-tight">
                                            {currentDate.toLocaleString('es-ES', { month: 'long' })}{' '}
                                            <span className="text-cyan-400/50 text-lg font-light">{currentDate.getFullYear()}</span>
                                        </h2>
                                        <div className="flex gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1 hover:bg-cyan-500/10 rounded-full text-white transition-all cursor-pointer flex items-center justify-center w-6 h-6"><ChevronLeft className="w-4 h-4" /></button>
                                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1 hover:bg-cyan-500/10 rounded-full text-white transition-all cursor-pointer flex items-center justify-center w-6 h-6"><ChevronRight className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {COLUMNS.map(col => {
                                            const dotColor = col.id === 'pre-pro' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]' :
                                                             col.id === 'shooting' ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                                                             col.id === 'post-pro' ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.6)]' :
                                                             col.id === 'review' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
                                                             'bg-lime-400 shadow-[0_0_8px_rgba(132,204,22,0.6)]';
                                            return (
                                                <div key={col.id} className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span> {col.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex-1" style={{ gridTemplateRows: 'auto repeat(6, 1fr)' }}>
                                    {DAYS.map(d => <div key={d} className="bg-black/40 py-2.5 text-center text-[10px] font-black text-gray-500 uppercase tracking-wider">{d}</div>)}
                                    {Array(getFirstDayOfMonth(currentDate)).fill(null).map((_, i) => <div key={`blank-${i}`} className="bg-black/20 opacity-30 border border-white/[0.02]"></div>)}
                                    {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1).map(day => {
                                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const dayProjects = projects.filter(p => p.deadline === dateStr);
                                        const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                                        const isSelected = selectedDay === day;

                                        return (
                                            <div 
                                                key={day} 
                                                onClick={() => setSelectedDay(day)} 
                                                className={`relative p-2 h-full cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                                                    isSelected 
                                                    ? 'bg-cyan-500/10 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] z-10' 
                                                    : isToday 
                                                        ? 'bg-indigo-500/20 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]' 
                                                        : 'bg-black/40 hover:bg-white/5 border border-white/5 hover:border-cyan-500/20'
                                                }`}
                                            >
                                                <span className={`text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full ${
                                                    isToday 
                                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                                                    : isSelected 
                                                        ? 'text-cyan-400 font-black' 
                                                        : 'text-gray-500'
                                                }`}>{day}</span>
                                                
                                                <div className="space-y-1 mt-1 max-h-[50px] overflow-hidden">
                                                    {dayProjects.map(p => {
                                                        const colorClass = p.status === 'pre-pro' ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)] hover:bg-cyan-500/20' :
                                                                           p.status === 'shooting' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)] hover:bg-rose-500/20' :
                                                                           p.status === 'post-pro' ? 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30 shadow-[0_0_8px_rgba(232,121,249,0.2)] hover:bg-fuchsia-500/20' :
                                                                           p.status === 'review' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_8px_rgba(234,179,8,0.2)] hover:bg-yellow-500/20' :
                                                                           'text-lime-400 bg-lime-500/10 border-lime-500/30 shadow-[0_0_8px_rgba(132,204,22,0.2)] hover:bg-lime-500/20';
                                                        return (
                                                            <div 
                                                                key={p.id} 
                                                                className={`text-[8px] font-black px-1.5 py-0.5 rounded border truncate transition-all ${colorClass}`}
                                                                title={p.title}
                                                            >
                                                                {p.title.replace('Rodaje: ', '')}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* Trailing blank cells to complete the 42 day slots grid */}
                                    {Array(42 - getFirstDayOfMonth(currentDate) - getDaysInMonth(currentDate)).fill(null).map((_, i) => (
                                        <div key={`blank-trail-${i}`} className="bg-black/10 opacity-20 border border-white/[0.02]"></div>
                                    ))}
                                </div>
                            </div>

                            {/* Side Notes & Day Details Panel (Right) */}
                            <div className="w-80 bg-[#0E0E18]/80 border border-white/5 rounded-[2rem] p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                                {selectedDay ? (() => {
                                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                                    const dayProjects = projects.filter(p => p.deadline === dateStr);
                                    const formattedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

                                    return (
                                        <>
                                            {/* Panel Header */}
                                            <div className="shrink-0">
                                                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" /> Agenda Diaria
                                                </div>
                                                <h3 className="text-md font-bold text-white capitalize leading-tight">{formattedDate}</h3>
                                            </div>

                                            {/* Projects on this day */}
                                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-1">
                                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Rodajes del Día ({dayProjects.length})</div>
                                                {dayProjects.length > 0 ? (
                                                    dayProjects.map(proj => {
                                                        const colMatch = COLUMNS.find(c => c.id === proj.status) || { label: proj.status };
                                                        const badgeStyle = proj.status === 'pre-pro' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.2)]' :
                                                                           proj.status === 'shooting' ? 'border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-[0_0_8px_rgba(244,63,94,0.2)]' :
                                                                           proj.status === 'post-pro' ? 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_8px_rgba(232,121,249,0.2)]' :
                                                                           proj.status === 'review' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                                                           'border-lime-500/30 text-lime-400 bg-lime-500/10 shadow-[0_0_8px_rgba(132,204,22,0.2)]';
                                                        return (
                                                            <div 
                                                                key={proj.id} 
                                                                onClick={() => setSelectedProject(proj)}
                                                                className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-cyan-500/30 transition-all cursor-pointer group"
                                                            >
                                                                <div className="flex justify-between items-start mb-1.5">
                                                                    <span className="text-[9px] font-black uppercase text-cyan-400">{proj.duration || 'Hora no definida'}</span>
                                                                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                                                                        {colMatch.label}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{proj.title}</h4>
                                                                <p className="text-[10px] text-gray-500 mt-1">{proj.client}</p>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-xs text-gray-600 italic bg-white/[0.01] p-4 rounded-xl border border-dashed border-white/5 text-center">No hay producciones agendadas.</div>
                                                )}

                                                {/* Daily Notes (Google Calendar style) */}
                                                <div className="pt-4 border-t border-white/5">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notas de Producción</span>
                                                        <span className="text-[8px] text-cyan-400 font-mono">Autoguardado</span>
                                                    </div>
                                                    <textarea
                                                        value={dailyNotes[dateStr] || ''}
                                                        onChange={(e) => saveDailyNote(dateStr, e.target.value)}
                                                        placeholder="Escribe notas operativas, recordatorios o detalles logísticos..."
                                                        className="w-full h-24 bg-black/40 border border-white/5 focus:border-cyan-500/40 rounded-xl p-3 text-xs text-gray-300 placeholder-gray-600 outline-none resize-none transition-all leading-relaxed"
                                                    />
                                                </div>

                                                {/* Daily Tasks / Checklist */}
                                                <div className="pt-4 border-t border-white/5 space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tareas Logísticas</span>
                                                        <span className="text-[8px] text-indigo-400 font-mono">Autoguardado</span>
                                                    </div>
                                                    
                                                    {/* Task input */}
                                                    <form 
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            const form = e.currentTarget;
                                                            const input = form.elements.namedItem('newTask');
                                                            if (input.value.trim()) {
                                                                addDailyTask(dateStr, input.value.trim());
                                                                input.value = '';
                                                            }
                                                        }}
                                                        className="flex gap-2"
                                                    >
                                                        <input 
                                                            type="text" 
                                                            name="newTask"
                                                            placeholder="Nueva tarea logistica..." 
                                                            className="flex-1 bg-black/40 border border-white/5 focus:border-indigo-500/50 rounded-lg px-3 py-1.5 text-xs text-white outline-none placeholder-gray-600 transition-colors"
                                                        />
                                                        <button 
                                                            type="submit"
                                                            className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                        >
                                                            +
                                                        </button>
                                                    </form>

                                                    {/* Task list */}
                                                    <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                                                        {(dailyTasks[dateStr] || []).length > 0 ? (
                                                            (dailyTasks[dateStr] || []).map((t, idx) => (
                                                                <div 
                                                                    key={idx}
                                                                    className="flex items-center justify-between gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-lg group/task"
                                                                >
                                                                    <button
                                                                        onClick={() => toggleDailyTask(dateStr, idx)}
                                                                        className="flex items-center gap-2 text-left flex-1 cursor-pointer"
                                                                    >
                                                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                                                                            t.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-600 hover:border-indigo-500'
                                                                        }`}>
                                                                            {t.completed && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                                                                        </div>
                                                                        <span className={`text-[11px] transition-all ${t.completed ? 'text-gray-500 line-through opacity-55' : 'text-gray-300'}`}>
                                                                            {t.text}
                                                                        </span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => removeDailyTask(dateStr, idx)}
                                                                        className="opacity-0 group-hover/task:opacity-100 p-0.5 text-gray-500 hover:text-red-400 rounded transition-all cursor-pointer"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-[10px] text-gray-600 italic py-1">Sin tareas para hoy.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })() : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                                        <CalendarIcon className="w-10 h-10 text-gray-600 mb-3 opacity-30 animate-pulse" />
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Selecciona un Día</p>
                                        <p className="text-[10px] text-gray-600 mt-1">Haz clic en cualquier celda para ver el itinerario y redactar notas.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* --- PROJECT DETAIL MODAL --- */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailModal 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                        onUpdateStatus={updateProjectStatus}
                        teamMembers={teamMembers}
                        onAddTeamMember={onAddTeamMember}
                        onRemoveTeamMember={onRemoveTeamMember}
                        onToggleChecklist={toggleChecklistItem}
                        onOpenScript={onOpenScript}
                        onAddEquipment={onAddEquipment}
                        onRemoveEquipment={onRemoveEquipment}
                        onOpenChat={(clientName) => {
                            router.push(`/workstation/filmmaker/messages?client=${encodeURIComponent(clientName)}`);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Script Details Modal */}
            <AnimatePresence>
                {showScriptModal && selectedScriptEvent && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            onClick={() => setShowScriptModal(false)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                            className="relative w-full max-w-3xl bg-[#0E0E18] border border-white/10 rounded-3xl p-8 shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6 shrink-0 no-print">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <FileText className="w-3.5 h-3.5" /> Guión Técnico de Producción
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedScriptEvent.title}</h3>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                                        Cliente: <span className="text-gray-300">{selectedScriptEvent.client}</span> • Duración: {selectedScriptEvent.duration}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <button 
                                        onClick={() => window.print()}
                                        className="px-4 py-2 bg-white text-black hover:bg-gray-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-white/5 cursor-pointer"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Exportar PDF
                                    </button>
                                    <button 
                                        onClick={() => setShowScriptModal(false)}
                                        className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Script Content */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 no-print">
                                {parseAssets(selectedScriptEvent.assets).script_blocks?.length > 0 ? (
                                    <div className="space-y-4">
                                        {parseAssets(selectedScriptEvent.assets).script_blocks.map((block, idx) => (
                                            <div 
                                                key={idx} 
                                                className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all space-y-4"
                                            >
                                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                                                            {idx + 1}
                                                        </span>
                                                        {block.scene || block.type}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-bold text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" /> {block.time}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Audio / Voiceover */}
                                                    <div className="space-y-1.5">
                                                        <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                                            🗣️ Audio / Locución
                                                        </h5>
                                                        <p className="text-xs text-gray-300 leading-relaxed bg-black/25 p-3 rounded-xl border border-white/5 font-medium whitespace-pre-wrap">
                                                            {block.text}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Video / Visuals */}
                                                    <div className="space-y-1.5">
                                                        <h5 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                                                            🎥 Video / Visual Sugerido
                                                        </h5>
                                                        <p className="text-xs text-gray-400 leading-relaxed bg-black/25 p-3 rounded-xl border border-white/5 font-medium whitespace-pre-wrap">
                                                            {block.visual}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                        <FileText className="w-12 h-12 text-gray-600 mb-3 opacity-30" />
                                        <p className="text-sm font-bold text-gray-400">Sin guión estructurado localmente</p>
                                        <p className="text-xs text-gray-600 mt-1 mb-6 max-w-sm">Este rodaje cuenta con un enlace de guión externo para su consulta.</p>
                                        {parseAssets(selectedScriptEvent.assets).script_url && (
                                            <a 
                                                href={parseAssets(selectedScriptEvent.assets).script_url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="px-6 py-2.5 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all font-sans"
                                            >
                                                Abrir Guión en Documento Externo
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hidden Print Container for A4 formatting */}
            <div id="print-script-modal" className="hidden bg-white text-black p-10">
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight text-black">{selectedScriptEvent?.title}</h1>
                <p className="text-sm font-bold text-gray-600 uppercase mb-8 border-b pb-2">
                    Cliente: {selectedScriptEvent?.client} • Duración: {selectedScriptEvent?.duration} • Fecha: {selectedScriptEvent?.deadline}
                </p>
                <div className="space-y-8">
                    {selectedScriptEvent && parseAssets(selectedScriptEvent.assets).script_blocks?.map((block, idx) => (
                        <div key={idx} className="border-b border-gray-200 pb-6 space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-black uppercase">{idx + 1}. {block.scene || block.type}</span>
                                <span className="text-gray-500">{block.time}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6 text-xs">
                                <div>
                                    <h4 className="font-bold text-gray-700 uppercase mb-1">🗣️ Audio / Locución:</h4>
                                    <p className="text-black leading-relaxed whitespace-pre-wrap">{block.text}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-700 uppercase mb-1">🎥 Video / Visual Sugerido:</h4>
                                    <p className="text-black leading-relaxed whitespace-pre-wrap">{block.visual}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProjectCard({ project }) {
    return (
        <motion.div layoutId={project.id} whileHover={{ y: -2 }} className="bg-[#0E0E18] border border-white/5 rounded-xl p-3 hover:border-white/20 transition-all shadow-lg group">
            <div className="relative h-28 mb-3 rounded-lg overflow-hidden">
                <img src={project.thumb} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10">{project.type}</div>
                {project.priority === 'critical' && <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-md"><AlertCircle className="w-3 h-3" /> URGENTE</div>}
            </div>
            <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">{project.title}</h4>
            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2">
                <span>{project.client}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {project.deadline}</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{ width: `${project.progress}%` }} />
            </div>
        </motion.div>
    );
}

function ProjectDetailModal({ 
    project, onClose, onUpdateStatus, teamMembers, 
    onAddTeamMember, onRemoveTeamMember, onToggleChecklist, onOpenScript,
    onAddEquipment, onRemoveEquipment, onOpenChat 
}) {
    const [showAssignDropdown, setShowAssignDropdown] = useState(false);

    // Extract real assigned team members from state
    const assetsData = parseAssets(project.assets);
    const assignedIds = assetsData.assigned_team || [];
    const equipmentList = assetsData.equipment || [];
    const assignedMembers = assignedIds.map(id => {
        return teamMembers.find(t => t.id === id) || { 
            id, 
            name: id === 'TEAM-9690' ? 'Dicson' : id === 'tea-004' ? 'Reyshell' : 'Colaborador', 
            role: id === 'TEAM-9690' ? 'Filmmaker' : 'Estratega' 
        };
    });
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#0E0E18] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-48 relative shrink-0">
                    <img src={project.thumb} alt={project.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E18] via-[#0E0E18]/50 to-transparent" />
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors z-10"><X className="w-5 h-5" /></button>

                    <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{project.type}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${project.priority === 'critical' ? 'border-red-500/50 text-red-400' : 'border-gray-500/50 text-gray-400'}`}>{project.priority}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-1">{project.title}</h2>
                            <p className="text-gray-400 flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-blue-500" /> {project.client}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Deadline</div>
                            <div className="text-xl font-bold text-white flex items-center gap-2 justify-end"><Clock className="w-5 h-5 text-red-500" /> {project.deadline}</div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Main Info */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-white/5 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-500" /> Descripción / Briefing</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Este proyecto consiste en la producción de {project.title.toLowerCase()} para {project.client}.
                                El objetivo principal es capturar la esencia de la marca con un estilo dinámico y moderno.
                                Se requiere especial atención a la iluminación y el audio directo. Entregables en formato 16:9 y 9:16.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-gray-500" /> Checklist de Producción</h3>
                            <div className="space-y-2">
                                {['Guión Aprobado', 'Locaciones Confirmadas', 'Equipo Técnico Reservado', 'Casting / Talento', 'Plan de Rodaje Creado'].map((item, i) => {
                                    const assetsData = parseAssets(project.assets);
                                    const isChecked = !!assetsData.checklist[item];
                                    return (
                                        <button 
                                            key={i} 
                                            onClick={() => onToggleChecklist(project.id, item)}
                                            className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/5 transition-colors cursor-pointer text-left group"
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                                isChecked ? 'bg-cyan-600 border-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-gray-600 group-hover:border-cyan-500'
                                            }`}>
                                                {isChecked && <CheckCircle className="w-3.5 h-3.5 text-white fill-cyan-600" />}
                                            </div>
                                            <span className={`text-sm transition-all ${isChecked ? 'text-cyan-400 line-through opacity-60' : 'text-gray-300'}`}>{item}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-gray-500" /> Equipo Requerido
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {equipmentList.length > 0 ? (
                                    equipmentList.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold"
                                        >
                                            <span>{item}</span>
                                            <button 
                                                onClick={() => onRemoveEquipment(project.id, item)}
                                                className="hover:text-red-400 transition-colors cursor-pointer"
                                                title="Remover equipo"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-gray-500 py-1">No hay equipos asignados para esta producción.</div>
                                )}
                            </div>
                            
                            {/* Quick Add Professional Equipments */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Sugerencias de Equipos</div>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {['Sony FX3', 'GoPro', 'Insta 360', 'Teléfono / Mobile', 'Luz LED Aputure', 'Iluminación RGB', 'Micrófonos Inalámbricos', 'Trípode Sachtler', 'Pantalla Verde', 'Telas de Difusión', 'Drone DJI Mavic 3 Pro', 'Lentes Cine', 'Filtros ND'].map((suggested) => {
                                        const isAlreadyAdded = equipmentList.some(item => item.toLowerCase().includes(suggested.toLowerCase()));
                                        if (isAlreadyAdded) return null;
                                        return (
                                            <button
                                                key={suggested}
                                                type="button"
                                                onClick={() => onAddEquipment(project.id, suggested)}
                                                className="px-2 py-1 bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/20 rounded-md text-[10px] text-gray-400 hover:text-cyan-400 transition-all font-semibold flex items-center gap-1 cursor-pointer"
                                            >
                                                <Plus className="w-2.5 h-2.5" /> {suggested}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Custom input add */}
                                <form 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.currentTarget;
                                        const input = form.elements.namedItem('customEquip');
                                        if (input.value.trim()) {
                                            onAddEquipment(project.id, input.value.trim());
                                            input.value = '';
                                        }
                                    }}
                                    className="flex gap-2"
                                >
                                    <input 
                                        type="text" 
                                        name="customEquip"
                                        placeholder="Agregar otro equipo personalizado..." 
                                        className="flex-1 bg-black/40 border border-white/5 focus:border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs text-white outline-none placeholder-gray-600 transition-colors"
                                    />
                                    <button 
                                        type="submit"
                                        className="px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        Agregar
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><UploadCloud className="w-5 h-5 text-gray-500" /> Archivos & Assets</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Guión Card */}
                                <button 
                                    onClick={() => onOpenScript(project)}
                                    className="p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-left w-full transition-all cursor-pointer group"
                                >
                                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform"><FileText className="w-5 h-5" /></div>
                                    <div>
                                        <div className="text-white text-sm font-bold group-hover:text-red-400 transition-colors">Guión de Producción</div>
                                        <div className="text-[10px] text-gray-500 font-medium">Haz clic para revisar el guión</div>
                                    </div>
                                </button>
                                
                                {/* Materials Card */}
                                {project.assets?.materials_url ? (
                                    <a 
                                        href={project.assets.materials_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3 text-left w-full transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform"><UploadCloud className="w-5 h-5" /></div>
                                        <div>
                                            <div className="text-white text-sm font-bold group-hover:text-blue-400 transition-colors">Materiales / Recursos</div>
                                            <div className="text-[10px] text-gray-500 font-medium font-sans">Carpeta de Drive externa</div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3 text-left w-full opacity-60">
                                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400"><UploadCloud className="w-5 h-5" /></div>
                                        <div>
                                            <div className="text-gray-400 text-sm font-bold">Sin Materiales Adjuntos</div>
                                            <div className="text-[10px] text-gray-500 font-medium">No hay carpeta vinculada</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="w-80 bg-[#13131f] p-6 flex flex-col gap-6 overflow-y-auto">
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Estado del Proyecto</h4>
                            <div className="p-1 bg-black/20 rounded-xl border border-white/5">
                                {COLUMNS.map(col => (
                                    <button
                                        key={col.id}
                                        onClick={() => onUpdateStatus(project.id, col.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold mb-1 transition-all flex items-center justify-between ${project.status === col.id ? `${col.bg} ${col.color.replace('border', 'text')} border border-current` : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {col.label}
                                        {project.status === col.id && <CheckCircle className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Equipo Asignado</h4>
                            <div className="space-y-3">
                                {assignedMembers.map((member, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 p-2.5 rounded-xl group/member">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br ${
                                                idx % 2 === 0 ? 'from-amber-400 to-orange-500' : 'from-purple-400 to-pink-500'
                                            }`}>
                                                {member.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-white text-xs font-bold">{member.name}</div>
                                                <div className="text-[10px] text-gray-500">{member.role || 'Colaborador'}</div>
                                            </div>
                                        </div>
                                        {/* Remove member button */}
                                        <button 
                                            onClick={() => onRemoveTeamMember(project.id, member.id)}
                                            className="opacity-0 group-hover/member:opacity-100 p-1 hover:bg-white/5 text-gray-500 hover:text-red-400 rounded transition-all cursor-pointer"
                                            title="Remover Miembro"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                
                                {/* Assign Member Button */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                                        className="w-full py-2 border border-dashed border-gray-700 hover:border-cyan-500 rounded-lg text-xs text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer"
                                    >
                                        + Asignar Miembro
                                    </button>
                                    
                                    {/* Dropdown list of unassigned members */}
                                    {showAssignDropdown && (
                                        <div className="absolute left-0 right-0 mt-1 bg-[#13131f] border border-white/10 rounded-xl p-2 shadow-2xl z-20 max-h-48 overflow-y-auto custom-scrollbar">
                                            {teamMembers.filter(t => !assignedIds.includes(t.id)).length > 0 ? (
                                                teamMembers.filter(t => !assignedIds.includes(t.id)).map(member => (
                                                    <button
                                                        key={member.id}
                                                        onClick={() => {
                                                            onAddTeamMember(project.id, member.id);
                                                            setShowAssignDropdown(false);
                                                        }}
                                                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        {member.name} ({member.role || 'Miembro'})
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="text-center text-[10px] text-gray-600 py-2">Todos asignados</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button 
                                onClick={() => onOpenChat && onOpenChat(project.client)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <MessageSquare className="w-4 h-4" /> Abrir Chat de Proyecto
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
