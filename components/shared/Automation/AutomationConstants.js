import { 
    Zap, MessageSquare, SplitSquareHorizontal, UserCheck, Bot, UserPlus, PlayCircle, Plus,
    Instagram, Facebook, Globe, Box, Clock, BarChart3, Calendar, History, Smartphone,
    Mic, Send, ShieldCheck, Mail, Slack, Disc, Github, Database, Layout, Mailbox
} from 'lucide-react';

export const AUTO_NODE_TYPES = {
    // 🎯 Triggers (Events)
    trigger_whatsapp: { category: 'trigger', label: 'Mensaje WhatsApp', icon: MessageSquare, color: '#22c55e', desc: 'Disparado por mensaje entrante de WA.' },
    trigger_insta_dm: { category: 'trigger', label: 'Instagram DM', icon: Instagram, color: '#e4405f', desc: 'Disparado por mensaje directo específico.' },
    trigger_insta_story: { category: 'trigger', label: 'Reacción Story', icon: History, color: '#f97316', desc: 'Mención o reacción a historia de Instagram.' },
    trigger_fb_comment: { category: 'trigger', label: 'Facebook Comment', icon: Facebook, color: '#1877f2', desc: 'Disparado por palabra clave en comentario.' },
    trigger_lead_crm: { category: 'trigger', label: 'Nuevo Lead (CRM)', icon: UserPlus, color: '#14b8a6', desc: 'Sincronización automática con el CRM.' },
    trigger_webhook: { category: 'trigger', label: 'Webhook Externo', icon: Globe, color: '#6366f1', desc: 'Recibe datos de apps externas (Zapier/Make).' },
    trigger_page_visit: { category: 'trigger', label: 'Visita Página Opt-in', icon: Globe, color: '#3b82f6', desc: 'Rastreo de pixel en landing page.' },

    // 💬 Acciones (Mensajes y Bots)
    msg_quick_reply: { category: 'action', label: 'Respuesta Rápida', icon: Zap, color: '#3b82f6', desc: 'Mensaje automático instantáneo.' },
    msg_ai_gpt: { category: 'action', label: 'Asistente IA (Soporte)', icon: Bot, color: '#8b5cf6', desc: 'IA responde dudas basadas en tu base de conocimiento.' },
    msg_ai_voice: { category: 'action', label: 'Audio AI Realista', icon: PlayCircle, color: '#f43f5e', desc: 'Genera y envía un audio humano personalizado.' },
    msg_email: { category: 'action', label: 'Enviar Email Pro', icon: Mail, color: '#4f46e5', desc: 'Envío de correo electrónico con diseño HTML.' },
    action_send_pdf: { category: 'action', label: 'Enviar Recurso (PDF)', icon: Box, color: '#10b981', desc: 'Entrega automática de guías o catálogos.' },
    action_whatsapp_vcard: { category: 'action', label: 'Enviar V-Card', icon: UserPlus, color: '#22c55e', desc: 'Envía contacto para guardar en agenda.' },

    // 🔀 Lógica y Control
    logic_options: { category: 'logic', label: 'Menú de Opciones', icon: SplitSquareHorizontal, color: '#ec4899', desc: 'Ramifica el flujo según la elección del lead.' },
    logic_delay: { category: 'logic', label: 'Retraso / Delay', icon: Clock, color: '#64748b', desc: 'Espera X minutos o horas antes de seguir.' },
    logic_ab_test: { category: 'logic', label: 'A/B Split Testing', icon: BarChart3, color: '#f59e0b', desc: 'Prueba 2 versiones del flujo simultáneamente.' },
    logic_condition: { category: 'logic', label: 'Condicional (Si/No)', icon: ShieldCheck, color: '#10b981', desc: 'Filtra según etiquetas o historial del lead.' },

    // 🤝 Sistema y CRM
    system_pipeline: { category: 'system', label: 'Mover Pipeline', icon: UserCheck, color: '#14b8a6', desc: 'Actualiza el estado del lead en el CRM.' },
    system_calendar: { category: 'system', label: 'Agendar Cita', icon: Calendar, color: '#f97316', desc: 'Envía invitación de Calendly o similar.' },
    system_tag: { category: 'system', label: 'Etiquetar Lead', icon: Plus, color: '#6366f1', desc: 'Agrega tags para segmentación avanzada.' },
    system_notify_admin: { category: 'system', label: 'Notificar Asesor', icon: Send, color: '#f43f5e', desc: 'Alerta inmediata por WhatsApp al equipo de ventas.' },

    // 🚀 Integraciones Externas (n8n Power)
    ext_slack: { category: 'integration', label: 'Slack Connect', icon: Slack, color: '#4a154b', desc: 'Sincroniza canales y mensajes de equipo.' },
    ext_discord: { category: 'integration', label: 'Discord Bot', icon: MessageSquare, color: '#5865f2', desc: 'Gestión de comunidades y roles.' },
    ext_gmail: { category: 'integration', label: 'Gmail Tool', icon: Mail, color: '#ea4335', desc: 'Envío y lectura de correos automatizada.' },
    ext_airtable: { category: 'integration', label: 'Airtable Sync', icon: Database, color: '#18bfff', desc: 'Base de datos dinámica para leads y contenido.' },
    ext_github: { category: 'integration', label: 'Github Agent', icon: Github, color: '#ffffff', desc: 'Gestión de tickets y repositorios.' }
};

export const PRESET_FLOWS = {
    'Cita Agendada -> Calendar': {
        nodes: [
            { id: 'n1', type: 'trigger_whatsapp', position: { x: 50, y: 150 }, data: { label: 'WhatsApp: "Cita"', keyword: 'cita' } },
            { id: 'n2', type: 'msg_ai_gpt', position: { x: 400, y: 150 }, data: { label: 'AI: Calificador', prompt: 'Verifica disponibilidad del usuario.' } },
            { id: 'n3', type: 'system_calendar', position: { x: 750, y: 50 }, data: { label: 'Agendar Google', calendarId: 'primary' } },
            { id: 'n4', type: 'ext_gmail', position: { x: 1100, y: 150 }, data: { label: 'Confirmar Email', subject: 'Cita Confirmada ✓' } },
            { id: 'n5', type: 'system_notify_admin', position: { x: 750, y: 250 }, data: { label: 'Alerta Asesor', message: 'Nueva cita agendada 🚀' } }
        ],
        edges: [
            { id: 'e1', source: 'n1', target: 'n2', outlet: 'default' },
            { id: 'e2', source: 'n2', target: 'n3', outlet: 'default' },
            { id: 'e3', source: 'n2', target: 'n5', outlet: 'default' },
            { id: 'e4', source: 'n3', target: 'n4', outlet: 'default' }
        ]
    },
    'Lead Entrante -> CRM': {
        nodes: [
            { id: 'l1', type: 'trigger_webhook', position: { x: 50, y: 150 }, data: { label: 'Meta Ads Webhook' } },
            { id: 'l2', type: 'system_pipeline', position: { x: 400, y: 150 }, data: { label: 'Crear en Pipeline', stage: 'new' } },
            { id: 'l3', type: 'system_tag', position: { x: 750, y: 150 }, data: { label: 'Tag: "Facebook Lead"' } }
        ],
        edges: [
            { id: 'el1', source: 'l1', target: 'l2', outlet: 'default' },
            { id: 'el2', source: 'l2', target: 'l3', outlet: 'default' }
        ]
    }
};
