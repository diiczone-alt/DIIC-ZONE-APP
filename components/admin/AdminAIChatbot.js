'use client';

import { useState, useRef, useEffect } from 'react';
import { 
    MessageCircle, Send, Bot, User, Sparkles, 
    Clock, Cpu, Settings, RefreshCw, Layers,
    Briefcase, Target, Zap, BrainCircuit, Mic,
    Image as ImageIcon, MoreHorizontal, Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminAIChatbot({ clientMode = false, clientContext = null }) {
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            role: 'assistant', 
            content: clientMode 
                ? `¡Hola! Soy el Agente de Inteligencia especializado para ${clientContext?.name || 'la marca'}. Estoy listo para potenciar nuestra estrategia comercial. ¿En qué trabajamos hoy?`
                : '¡Hola! Soy el Agente de Inteligencia Proactiva de DIIC ZONE. Estoy listo para ayudarte a gestionar cierres, responder dudas de clientes y aprender de cada interacción. ¿Qué estrategia desplegamos hoy?',
            time: '12:00 PM',
            type: 'text'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeBot, setActiveBot] = useState('DIIC-AI-V1'); // 'DIIC-AI-V1', 'CLOSER-PRO', 'SUPPORT-BOT'
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            role: 'user',
            content: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulación de respuesta de IA avanzada
        setTimeout(() => {
            const aiResponse = {
                id: messages.length + 2,
                role: 'assistant',
                content: generateAIResponse(inputValue),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'text',
                isAI: true
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAIResponse = (input) => {
        const query = input.toLowerCase();
        if (query.includes('contrato')) return 'He analizado la boveda legal. El contrato para el Plan Élite de Dental Pro está listo para firma. ¿Quieres que lo envíe por WhatsApp ahora?';
        if (query.includes('vender') || query.includes('venta')) return 'Mi motor predictivo sugiere atacar el nicho de Real Estate este mes. He detectado una tasa de conversión 24% más alta en campañas de Reels para ese sector.';
        if (query.includes('hola')) return '¡Hola de nuevo! Mis redes neuronales están optimizadas al 100%. ¿Necesitas un análisis de sentimientos de los últimos leads o prefieres que redacte una propuesta de cierre?';
        return 'Entendido. Estoy procesando esa información con el contexto del cliente. Mi sistema de aprendizaje está ajustando la respuesta comercial para maximizar el ROI. ¿Deseas que conecte con un consultor humano para este punto específico?';
    };

    return (
        <div className={`flex bg-[#0A0A12] border border-white/5 rounded-[3rem] overflow-hidden ${clientMode ? 'min-h-[600px]' : 'min-h-[750px]'} shadow-2xl relative`}>
            
            {/* SIDEBAR BOTS - HIDE IN CLIENT MODE */}
            {!clientMode && (
                <div className="w-80 border-r border-white/5 bg-[#0E0E18] flex flex-col p-6">
                    <div className="mb-8 pl-2">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Cerebros IA</h3>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Nodos de Respuesta Activos</p>
                    </div>

                    <div className="space-y-3 flex-1">
                        <BotSelector 
                            id="DIIC-AI-V1"
                            name="DIIC Master AI"
                            desc="Inteligencia General & BI"
                            icon={BrainCircuit}
                            active={activeBot === 'DIIC-AI-V1'}
                            onClick={() => setActiveBot('DIIC-AI-V1')}
                            color="indigo"
                        />
                        <BotSelector 
                            id="CLOSER-PRO"
                            name="Closer Pro"
                            desc="Optimización de Ventas"
                            icon={Target}
                            active={activeBot === 'CLOSER-PRO'}
                            onClick={() => setActiveBot('CLOSER-PRO')}
                            color="emerald"
                        />
                        <BotSelector 
                            id="SUPPORT-BOT"
                            name="Support Agent"
                            desc="Atención Inmediata"
                            icon={Zap}
                            active={activeBot === 'SUPPORT-BOT'}
                            onClick={() => setActiveBot('SUPPORT-BOT')}
                            color="rose"
                        />
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Estado del Aprendizaje</h4>
                        <div className="space-y-4 px-2">
                            <LearningMetric label="Comprensión Contextual" value="98%" color="indigo" />
                            <LearningMetric label="Personalización Lead" value="94%" color="emerald" />
                            <LearningMetric label="Velocidad de Respuesta" value="< 2s" color="rose" />
                        </div>
                    </div>
                </div>
            )}

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col relative bg-gradient-to-b from-[#0A0A1F] to-[#0A0A12]">
                
                {/* CHAT HEADER */}
                <div className="px-10 py-6 border-b border-white/5 bg-[#0A0A12]/50 backdrop-blur-xl flex justify-between items-center z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                            <Bot className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-white tracking-tight uppercase italic">{activeBot}</h4>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Online & Aprendiendo</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* MESSAGES SCRATCHPAD */}
                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                        >
                            <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${
                                    msg.role === 'user' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div className="space-y-2">
                                    <div className={`px-6 py-4 rounded-[2rem] text-sm leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-white text-black font-bold italic' 
                                        : 'bg-[#151520] text-gray-200 border border-white/5'}`}>
                                        {msg.content}
                                    </div>
                                    <div className={`text-[9px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.time} {msg.isAI && <span className="text-indigo-400 flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" /> IA DIIC</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-[#151520] px-6 py-4 rounded-full border border-white/5 flex gap-2">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT BAR */}
                <div className="p-8 border-t border-white/5 bg-[#0A0A12]/50 backdrop-blur-3xl z-10">
                    <div className="max-w-4xl mx-auto flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-[2.5rem] shadow-2xl focus-within:border-indigo-500/50 transition-all">
                        <button className="p-4 text-gray-500 hover:text-white transition-colors"><Smile className="w-6 h-6" /></button>
                        <button className="p-4 text-gray-500 hover:text-white transition-colors border-r border-white/5 mr-2"><ImageIcon className="w-6 h-6" /></button>
                        
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Habla con tu motor de IA..."
                            className="bg-transparent border-none outline-none flex-1 text-white text-sm font-medium placeholder:text-gray-600"
                        />

                        <button className="p-4 text-gray-500 hover:text-indigo-400 transition-colors"><Mic className="w-6 h-6" /></button>
                        <button 
                            onClick={handleSendMessage}
                            className="bg-white text-black p-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                        >
                            <Send className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-center text-[9px] text-gray-600 mt-4 uppercase tracking-[0.3em] font-black">
                        DIIC ZONE CONVERSATIONAL ENGINE // APRENDIENDO DE CADA PALABRA
                    </p>
                </div>
            </div>
            {/* FLOATING CONTEXT SIDEBAR - HIDE IN CLIENT MODE */}
            {!clientMode && (
                <div className="w-80 border-l border-white/5 bg-[#0E0E18] flex flex-col p-6 overflow-y-auto custom-scrollbar">
                    <div className="mb-8 pl-2">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Memoria Viva</h3>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Contexto del Cliente Actual</p>
                    </div>

                    <div className="space-y-6">
                        <ContextCard 
                            title="Historial de Ventas"
                            data={[
                                { label: 'Última Compra', value: 'Plan Growth' },
                                { label: 'Ticket Medio', value: '$350 USD' },
                                { label: 'Lealtad', value: 'High' }
                            ]}
                        />
                        <ContextCard 
                            title="Temas de Interés"
                            data={[
                                { label: 'Ads', value: '92%' },
                                { label: 'Reels', value: '85%' },
                                { label: 'Web', value: '40%' }
                            ]}
                        />
                        
                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-[2rem] space-y-4">
                            <div className="flex items-center gap-3 text-indigo-400">
                            <BrainCircuit className="w-5 h-5" />
                            <h4 className="text-xs font-black uppercase tracking-widest">Predicción IA</h4>
                            </div>
                            <p className="text-[11px] text-indigo-200 leading-relaxed italic">
                                "El cliente muestra patrones de readiness para un upsell a Plan Élite. Se recomienda mencionar el ahorro anual en la próxima respuesta."
                            </p>
                        </div>

                        <button 
                            onClick={() => toast.success("Intervención Humana Solicitada")}
                            className="w-full py-5 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3"
                        >
                            <User className="w-4 h-4" /> Conectar con Humano
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function BotSelector({ id, name, desc, icon: Icon, active, onClick, color }) {
    const colors = {
        indigo: "text-indigo-400 bg-indigo-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        rose: "text-rose-400 bg-rose-500/10"
    };

    return (
        <button 
            onClick={onClick}
            className={`w-full p-4 rounded-[2rem] border transition-all text-left flex items-center gap-4 ${
                active 
                ? 'bg-white/10 border-white/20 shadow-xl' 
                : 'bg-transparent border-transparent hover:bg-white/5 text-gray-500'}`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${active ? colors[color] : 'bg-white/5'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
                <div className={`text-xs font-black uppercase tracking-tight truncate ${active ? 'text-white' : 'text-gray-500'}`}>{name}</div>
                <div className="text-[9px] font-medium text-gray-600 truncate">{desc}</div>
            </div>
        </button>
    );
}

function LearningMetric({ label, value, color }) {
    const barColors = {
        indigo: "bg-indigo-500",
        emerald: "bg-emerald-500",
        rose: "bg-rose-500"
    };

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-600">
                <span>{label}</span>
                <span className="text-white">{value}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: value }}
                    transition={{ duration: 2 }}
                    className={`h-full rounded-full ${barColors[color]}`} 
                />
            </div>
        </div>
    );
}

function ContextCard({ title, data }) {
    return (
        <div className="space-y-3">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">{title}</h4>
            <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 space-y-3">
                {data.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-500 uppercase italic">{item.label}</span>
                        <span className="font-black text-white italic">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
