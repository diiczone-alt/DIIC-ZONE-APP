'use client';

import { MessageCircle, Calendar, UserPlus, Clock, Zap, DollarSign } from 'lucide-react';
import RecipeCard from './RecipeCard';

export default function AutomationGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RecipeCard
                title="Asistente de Citas"
                description="Responde automáticamente disponibilidad y agenda en Calendar."
                trigger="Mensaje WhatsApp"
                action="Evento Calendar"
                icon={Calendar}
                active={true}
            />
            <RecipeCard
                title="Captura de Leads"
                description="Guarda contacto nuevo cuando alguien pregunta precios."
                trigger="Mensaje Instagram"
                action="Crear Lead CRM"
                icon={UserPlus}
                active={true}
            />
            <RecipeCard
                title="Seguimiento 24h"
                description="Si un lead no responde en 24h, envía un mensaje suave."
                trigger="Sin respuesta (24h)"
                action="Enviar Mensaje"
                icon={Clock}
                active={false}
            />
            <RecipeCard
                title="Cierre de Venta"
                description="Mueve el deal a 'Ganado' cuando se confirma el pago."
                trigger="Pago Confirmado"
                action="Actualizar Deal"
                icon={DollarSign}
                active={false}
            />
            <RecipeCard
                title="Bienvenida Nuevo Cliente"
                description="Envía kit de bienvenida y formulario de onboarding."
                trigger="Deal Ganado"
                action="Email + WhatsApp"
                icon={Zap}
                active={true}
            />
        </div>
    );
}
