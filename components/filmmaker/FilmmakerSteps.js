import { motion } from 'framer-motion';
import {
    Video, Clapperboard, MonitorPlay, Users,
    Calendar, MapPin, UploadCloud, ArrowRight, Check, X,
    Camera, FileText, Lightbulb, Package, CreditCard, CheckCircle, Info,
    Smartphone, Megaphone, Clock, Star, Music, Link as LinkIcon,
    Youtube, ShoppingBag, User, GraduationCap, Mic
} from 'lucide-react';
import { useState } from 'react';

// --- SHARED / COMMON STEPS ---

export function StepTypeSelection({ onSelect }) {
    const TYPES = [
        { id: 'corp', label: 'Video Corporativo', icon: Users, desc: 'Presentación de empresa, cultura y valores.', color: 'from-blue-500 to-indigo-600' },
        { id: 'promo', label: 'Video Promocional', icon: Megaphone, desc: 'Anuncios, spots y lanzamientos.', color: 'from-orange-500 to-red-600' },
        { id: 'social', label: 'Redes Sociales', icon: Smartphone, desc: 'Reels, TikToks y contenido vertical.', color: 'from-pink-500 to-rose-500' },
        { id: 'event', label: 'Cobertura de Evento', icon: Calendar, desc: 'Conferencias, fiestas y activaciones.', color: 'from-purple-500 to-violet-600' },
        { id: 'testimonial', label: 'Testimoniales', icon: Mic, desc: 'Entrevistas y casos de éxito.', color: 'from-teal-400 to-teal-600' },
        { id: 'education', label: 'Video Educativo', icon: GraduationCap, desc: 'Cursos, tutoriales y formación.', color: 'from-yellow-400 to-yellow-600' },
        { id: 'product', label: 'Video de Producto', icon: ShoppingBag, desc: 'Showcase, demos y reviews.', color: 'from-emerald-400 to-green-600' },
        { id: 'youtube', label: 'Video para YouTube', icon: Youtube, desc: 'Vlogs, podcast en video y series.', color: 'from-red-500 to-red-700' },
        { id: 'personal', label: 'Marca Personal', icon: User, desc: 'Branding y posicionamiento de experto.', color: 'from-cyan-400 to-blue-500' },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-8">
            <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-3">¿Qué vamos a producir hoy?</h3>
                <p className="text-gray-400">Selecciona el tipo de producción para activar su flujo especializado.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => onSelect(type.label)}
                        className="group p-6 rounded-2xl bg-[#0F0F1A] border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-left flex flex-col gap-4 relative overflow-hidden"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-300">
                            <type.icon className="w-6 h-6 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-lg mb-1">{type.label}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{type.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

export function StepPayment({ price, deposit, onClose }) {
    const [success, setSuccess] = useState(false);

    if (success) return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 h-full flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">¡Solicitud Recibida!</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Tu producción ha sido agendada correctamente. Un productor te contactará en breve para coordinar los detalles.</p>
            <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">
                Ir al Dashboard
            </button>
        </motion.div>
    );

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Confirmación y Pago</h3>
                <p className="text-gray-400">Total Estimado del Proyecto</p>
                <div className="text-4xl font-bold text-white mt-4">${price ? price.toLocaleString() : '0.00'}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div onClick={() => setSuccess(true)} className="p-8 rounded-2xl bg-[#0F0F1A] border border-white/10 hover:border-orange-500 cursor-pointer group transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                        <CreditCard className="w-12 h-12 text-orange-500" />
                    </div>
                    <div className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-2">Opción Flexible</div>
                    <div className="text-2xl font-bold text-white mb-1">Reservar Turno</div>
                    <div className="text-3xl font-bold text-orange-500 mb-4">${deposit ? deposit.toLocaleString() : '0.00'}</div>
                    <p className="text-sm text-gray-400">Paga el 50% ahora para bloquear la fecha y el resto contra entrega del material final.</p>
                    <div className="mt-6 py-2 px-4 bg-orange-500/10 text-orange-500 rounded-lg text-sm font-bold inline-block border border-orange-500/20">Seleccionar</div>
                </div>

                <div onClick={() => setSuccess(true)} className="p-8 rounded-2xl bg-gradient-to-br from-[#0F0F1A] to-green-900/10 border border-white/10 hover:border-green-500 cursor-pointer group transition-all relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-md mb-2">AHORRA 5%</div>
                    <div className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-2">Pago Único</div>
                    <div className="text-2xl font-bold text-white mb-1">Pago Total</div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <div className="text-3xl font-bold text-white">${price ? (price * 0.95).toLocaleString() : '0.00'}</div>
                        <div className="text-lg line-through text-gray-600">${price ? price.toLocaleString() : '0.00'}</div>
                    </div>
                    <p className="text-sm text-gray-400">Paga el total por adelantado y obtén un descuento preferencial en tu producción.</p>
                    <div className="mt-6 py-2 px-4 bg-green-500/10 text-green-500 rounded-lg text-sm font-bold inline-block border border-green-500/20">Seleccionar</div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
                <Info className="w-4 h-4" />
                <span>Pagos procesados de forma segura vía Stripe / Kushki</span>
            </div>
        </motion.div>
    );
}

export function StepCommonLogistics({ data, onChange, title = "Logística de Grabación" }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="text-gray-400">¿Cuándo y dónde realizaremos la producción?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Fecha Tentativa</label>
                    <input type="date" value={data.date} onChange={e => onChange({ date: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Hora</label>
                    <input type="time" value={data.time} onChange={e => onChange({ time: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-400">Ubicación / Dirección</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-orange-500 outline-none"
                            placeholder="Ej: Oficinas Centrales, Av. Principal 123"
                            value={data.location}
                            onChange={e => onChange({ location: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-400">Responsable en Sitio</label>
                    <input
                        type="text"
                        className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none"
                        placeholder="Nombre de quien nos recibirá"
                        value={data.contactPerson}
                        onChange={e => onChange({ contactPerson: e.target.value })}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// --- 1. CORPORATE STEPS ---

export function StepCorpBrief({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 mb-4"><Users className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Brief Corporativo</h3>
                <p className="text-gray-400">Definamos la identidad del proyecto.</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Nombre del Proyecto</label>
                    <input type="text" placeholder="Ej: Video Institucional 2025" value={data.title} onChange={e => onChange({ title: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Objetivo Principal</label>
                    <select value={data.objective} onChange={e => onChange({ objective: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none">
                        <option value="">Seleccionar objetivo...</option>
                        <option value="branding">Posicionamiento de Marca</option>
                        <option value="sales">Ventas / Comercial</option>
                        <option value="internal">Comunicación Interna</option>
                        <option value="recruiting">Reclutamiento / Cultura</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Mensaje Clave</label>
                    <textarea placeholder="¿Qué es lo más importante que debe transmitir el video?" value={data.message} onChange={e => onChange({ message: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-4 text-white min-h-[100px] focus:border-blue-500 outline-none" />
                </div>
            </div>
        </motion.div>
    );
}

// --- 2. PROMO STEPS ---

export function StepPromoDetails({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 mb-4"><Megaphone className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Detalles de la Promoción</h3>
                <p className="text-gray-400">¿Qué vamos a vender al mundo?</p>
            </div>
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-medium">Tipo de Promoción</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {['Producto', 'Servicio', 'Evento', 'Oferta'].map(t => (
                            <button key={t} onClick={() => onChange({ promoType: t })} className={`p-2 rounded-lg text-sm border transition-all ${data.promoType === t ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-medium">Nombre del Producto / Servicio</label>
                    <input type="text" value={data.productName} onChange={(e) => onChange({ productName: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none" placeholder="Ej: Nueva Colección Verano" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-medium">Llamado a la Acción (CTA)</label>
                    <input type="text" value={data.cta} onChange={(e) => onChange({ cta: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none" placeholder="Ej: Compra ahora, Regístrate, Visítanos" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-medium">Formato Principal</label>
                    <div className="flex gap-3">
                        {['Vertical (Reels/TikTok)', 'Horizontal (YouTube/Web)', 'Cuadrado (Feed)'].map(f => (
                            <label key={f} className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center justify-center text-center text-xs ${data.promoFormat === f ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                                <input type="radio" name="promoFormat" value={f} checked={data.promoFormat === f} onChange={() => onChange({ promoFormat: f })} className="hidden" />
                                {f}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function StepPromoStyle({ data, onChange }) {
    const STYLES = [
        { id: 'energetic', label: 'Energético', desc: 'Rápido, cortes dinámicos, música potente.', icon: ZapIcon },
        { id: 'elegant', label: 'Elegante', desc: 'Cinemático, suave, lujoso.', icon: Star },
        { id: 'minimal', label: 'Minimalista', desc: 'Limpio, enfocado en el producto, sin distracciones.', icon: LayoutIcon },
    ];
    // Mock icons for internal use if not imported
    function ZapIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> }
    function LayoutIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg> }

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Estilo Visual</h3>
                <p className="text-gray-400">Define la vibra de tu video.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STYLES.map(s => (
                    <button key={s.id} onClick={() => onChange({ promoStyle: s.id })} className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${data.promoStyle === s.id ? 'bg-orange-500/10 border-orange-500' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.promoStyle === s.id ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                            <s.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className={`font-bold text-lg mb-1 ${data.promoStyle === s.id ? 'text-white' : 'text-gray-300'}`}>{s.label}</div>
                            <div className="text-xs text-gray-500">{s.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
            {/* References Area */}
            <div className="bg-[#0F0F1A] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <LinkIcon className="w-5 h-5 text-gray-400" />
                    <label className="text-sm font-bold text-white">Referencias (Opcional)</label>
                </div>
                <textarea
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white h-24 focus:border-orange-500 outline-none"
                    placeholder="Pega links de videos que te gusten o describe el estilo visual que buscas (ej: colores, ritmo, iluminación)..."
                    value={data.promoReferences}
                    onChange={e => onChange({ promoReferences: e.target.value })}
                />
            </div>
        </motion.div>
    );
}

// --- 3. SOCIAL STEPS ---

export function StepSocialStrategy({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-500/10 text-pink-500 mb-4"><Smartphone className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Estrategia de Contenido</h3>
                <p className="text-gray-400">Selecciona tu pack mensual o puntual.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { count: '5', label: 'Starter', price: '$400', desc: 'Ideal para mantener presencia.' },
                    { count: '10', label: 'Growth', price: '$700', desc: 'Crecimiento constante.' },
                    { count: '20', label: 'Dominance', price: '$1200', desc: 'Máximo alcance diario.' }
                ].map((pack) => (
                    <button key={pack.count} onClick={() => onChange({ packSize: pack.count })} className={`p-6 rounded-2xl border text-left transition-all group relative overflow-hidden ${data.packSize === pack.count ? 'bg-pink-600 border-pink-500' : 'bg-white/5 border-white/10 hover:border-pink-500/50'}`}>
                        <div className="text-3xl font-bold text-white mb-1">{pack.count} Videos</div>
                        <div className={`text-sm mb-4 font-medium ${data.packSize === pack.count ? 'text-pink-100' : 'text-gray-400'}`}>{pack.label}</div>
                        <div className={`font-mono font-bold text-lg mb-2 ${data.packSize === pack.count ? 'text-white' : 'text-pink-400'}`}>{pack.price}</div>
                        <div className={`text-xs ${data.packSize === pack.count ? 'text-pink-200' : 'text-gray-500'}`}>{pack.desc}</div>
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4" /> Plataformas Objetivo
                </label>
                <div className="flex gap-3">
                    {['Instagram Reels', 'TikTok', 'YouTube Shorts'].map(p => {
                        const isSelected = data.platforms?.includes(p);
                        return (
                            <button
                                key={p}
                                onClick={() => {
                                    const newPlatforms = isSelected
                                        ? data.platforms.filter(pl => pl !== p)
                                        : [...(data.platforms || []), p];
                                    onChange({ platforms: newPlatforms });
                                }}
                                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${isSelected ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-pink-500 border-pink-500' : 'border-gray-500'}`}>
                                    {isSelected && <Check className="w-3 h-3 text-black" />}
                                </div>
                                <span className="text-sm font-medium">{p}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

// --- 4. EVENT STEPS ---

export function StepEventDetails({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 mb-4"><Calendar className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Detalles del Evento</h3>
                <p className="text-gray-400">Información clave para la cobertura.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-400">Tipo de Evento</label>
                    <div className="flex gap-2 bg-[#0F0F1A] p-1 rounded-xl border border-white/10 overflow-x-auto">
                        {['Corporativo', 'Social', 'Concierto', 'Feria', 'Académico'].map(t => (
                            <button key={t} onClick={() => onChange({ eventType: t })} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${data.eventType === t ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-400">Nombre del Evento</label>
                    <input type="text" value={data.eventName} onChange={e => onChange({ eventName: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                </div>
            </div>
        </motion.div>
    );
}

export function StepEventScope({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Alcance de Cobertura</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Duración Estimada</label>
                    <select value={data.duration} onChange={e => onChange({ duration: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none">
                        <option>Media Jornada (4h)</option>
                        <option>Jornada Completa (8h)</option>
                        <option>Día Extendido (12h)</option>
                        <option>Múltiples Días</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Asistentes Aprox.</label>
                    <select value={data.attendees} onChange={e => onChange({ attendees: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none">
                        <option>{'<'} 50 personas</option>
                        <option>50 - 200 personas</option>
                        <option>200 - 1000 personas</option>
                        <option>{'>'} 1000 personas</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-bold text-white">Entregables Requeridos</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Aftermovie (Resumen)', 'Reels para Redes', 'Cobertura de Charlas Completa', 'Fotografía', 'Entrevistas a Asistentes'].map(item => {
                        const isSelected = data.deliverables?.includes(item);
                        return (
                            <button
                                key={item}
                                onClick={() => {
                                    const newItems = isSelected
                                        ? data.deliverables.filter(i => i !== item)
                                        : [...(data.deliverables || []), item];
                                    onChange({ deliverables: newItems });
                                }}
                                className={`p-3 rounded-xl border text-left text-sm transition-all ${isSelected ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-white/5 border-white/10 text-gray-400'}`}
                            >
                                {item}
                            </button>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    )
}

// --- 5. TESTIMONIAL STEPS ---

export function StepTestimonialDetails({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 mb-4"><Mic className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Configuración de Testimoniales</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Cantidad de Entrevistados</label>
                    <input type="number" min="1" value={data.interviewCount} onChange={e => onChange({ interviewCount: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-teal-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Tipo de Perfil</label>
                    <select value={data.intervieweeType} onChange={e => onChange({ intervieweeType: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-teal-500 outline-none">
                        <option>Clientes</option>
                        <option>Empleados (Employer Branding)</option>
                        <option>Directivos</option>
                        <option>Pacientes (Salud)</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Preguntas Clave / Temas a Tratar</label>
                <textarea placeholder="Lista breve de temas o preguntas sugeridas..." value={data.questions} onChange={e => onChange({ questions: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-4 text-white min-h-[120px] focus:border-teal-500 outline-none" />
            </div>
        </motion.div>
    );
}

// --- 6. EDUCATION STEPS ---

export function StepEducationalDetails({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 mb-4"><GraduationCap className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Contenido Educativo</h3>
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Tema del Curso / Video</label>
                <input type="text" value={data.title} onChange={e => onChange({ title: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500 outline-none" placeholder="Ej: Curso de Finanzas Personales" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Formato</label>
                    <select value={data.eduFormat} onChange={e => onChange({ eduFormat: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500 outline-none">
                        <option>Clase Magistral</option>
                        <option>Tutorial Pantalla + Rostro</option>
                        <option>Entrevista Educativa</option>
                        <option>Workshop / Taller</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Número de Clases/Módulos</label>
                    <input type="number" min="1" value={data.moduleCount} onChange={e => onChange({ moduleCount: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500 outline-none" />
                </div>
            </div>
        </motion.div>
    );
}

// --- 7. PRODUCT STEPS ---

export function StepProductDetails({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mb-4"><ShoppingBag className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Video de Producto</h3>
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Producto(s) a filmar</label>
                <input type="text" value={data.productName} onChange={e => onChange({ productName: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none" placeholder="Ej: Nueva Línea de Skincare" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Tipo de Video</label>
                    <div className="flex flex-col gap-2">
                        {['Comercial Estético', 'Demo Funcional (How-to)', 'Review / Unboxing', '360 Turnaround'].map(t => (
                            <label key={t} className={`p-3 rounded-lg border cursor-pointer text-sm ${data.productVideoType === t ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                                <input type="radio" name="productVideoType" value={t} checked={data.productVideoType === t} onChange={() => onChange({ productVideoType: t })} className="hidden" />
                                {t}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Cantidad de Productos</label>
                    <input type="number" min="1" className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none" />
                    <div className="p-3 bg-blue-500/10 rounded-lg mt-2">
                        <p className="text-xs text-blue-300">Tip: Asegúrate de tener muestras limpias y listas para el día de rodaje.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- 8. YOUTUBE STEPS ---

export function StepYouTubeDetails({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mb-4"><Youtube className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Producción para YouTube</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                    <label className="text-sm text-gray-400">Tema del Video</label>
                    <input type="text" value={data.title} onChange={e => onChange({ title: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Formato</label>
                    <select value={data.ytFormat} onChange={e => onChange({ ytFormat: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-red-500 outline-none">
                        <option>Vlog</option>
                        <option>Talking Head (Sentado)</option>
                        <option>Podcast de Video</option>
                        <option>Documental</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Duración Objetivo</label>
                    <select className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-red-500 outline-none">
                        <option>8 - 12 mins</option>
                        <option>12 - 20 mins</option>
                        <option>20+ mins</option>
                    </select>
                </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-sm font-bold text-white">Servicios Adicionales</label>
                <div className="flex gap-4">
                    {['Diseño de Miniatura', 'Optimización SEO (Título/Desc)', 'Cortes para Shorts'].map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-600 bg-transparent text-red-500 focus:ring-red-500" />
                            <span className="text-sm text-gray-400">{s}</span>
                        </label>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// --- 9. PERSONAL BRAND STEPS ---

export function StepPersonalBrandDetails({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-500 mb-4"><User className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white">Marca Personal</h3>
                <p className="text-gray-400">Construye autoridad y conexión.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Objetivo de Comunicación</label>
                    <input type="text" placeholder="Ej: Posicionarme como experto en FinTech" value={data.objective} onChange={e => onChange({ objective: e.target.value })} className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Tono de Voz</label>
                        <select className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none">
                            <option>Autoridad / Serio</option>
                            <option>Cercano / Amigable</option>
                            <option>Inspiracional / Motivador</option>
                            <option>Disruptivo / Polémico</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Plataforma Principal</label>
                        <select className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-3 text-white focus:border-cyan-500 outline-none">
                            <option>LinkedIn</option>
                            <option>Instagram</option>
                            <option>YouTube</option>
                            <option>Twitter / X</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Pilares de Contenido</label>
                    <textarea placeholder="Temas principales (ej: Liderazgo, Tecnología, Estilo de vida...)" className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-4 text-white min-h-[100px] focus:border-cyan-500 outline-none" />
                </div>
            </div>
        </motion.div>
    );
}

// --- 10. REMAINING CORPORATE SPECIFIC STEPS ---

export function StepContentGuide({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Guía de Contenido</h3>
                <p className="text-gray-400">Estructura básica del video.</p>
            </div>
            <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <h4 className="text-blue-400 font-bold mb-2 text-sm">Estructura Sugerida</h4>
                    <p className="text-gray-300 text-sm">1. Intro (Logo + Gancho) <br /> 2. Problema / Contexto <br /> 3. Solución (Tu Empresa) <br /> 4. Propuesta de Valor <br /> 5. Cierre + Call to Action</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-300">Puntos Clave a Cubrir</label>
                    <textarea
                        className="w-full bg-[#0F0F1A] border border-white/10 rounded-xl p-4 text-white min-h-[150px] focus:border-blue-500 outline-none"
                        placeholder="Lista de temas, entrevistas o tomas específicas que no pueden faltar..."
                        value={data.contentGuide}
                        onChange={e => onChange({ contentGuide: e.target.value })}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export function StepResources({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Recursos Disponibles</h3>
            </div>
            <div className="space-y-4">
                <div className="bg-[#0F0F1A] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center border-dashed hover:border-blue-500 transition-colors cursor-pointer">
                    <UploadCloud className="w-10 h-10 text-gray-500 mb-3" />
                    <p className="text-white font-bold">Subir Logo y Manual de Marca</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, AI, PDF (Max 50MB)</p>
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-bold text-white">¿Tenemos material de archivo?</label>
                    <div className="flex gap-4">
                        {['Sí, tengo videos previos', 'Sí, tengo fotos', 'No, grabar todo desde cero'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="resources" checked={data.resources === opt} onChange={() => onChange({ resources: opt })} className="bg-transparent border-gray-600 text-blue-500 focus:ring-blue-500" />
                                <span className="text-sm text-gray-400">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function StepEquipment({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Nivel de Producción</h3>
                <p className="text-gray-400">Selecciona el equipamiento técnico para el rodaje.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'basic', label: 'Esencial', price: 'Standard', desc: 'Cámara 4K, Trípode, Audio Básico.', icon: Camera, color: 'gray' },
                    { id: 'pro', label: 'Profesional', price: '+ $300', desc: 'Cámara Cine (FX3/C70), Iluminación 3 Puntos, Audio Pro.', icon: Clapperboard, color: 'blue' },
                    { id: 'cinema', label: 'Cinema', price: '+ $800', desc: 'RED/Arri, Crew Completo, Dolly, Iluminación Avanzada.', icon: MonitorPlay, color: 'orange' }
                ].map(level => (
                    <button key={level.id} onClick={() => onChange({ productionLevel: level.id })} className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden group ${data.productionLevel === level.id ? `bg-${level.color}-500/10 border-${level.color}-500 ring-1 ring-${level.color}-500` : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${data.productionLevel === level.id ? `bg-${level.color}-500 text-white` : 'bg-white/10 text-gray-400'}`}>
                            <level.icon className="w-6 h-6" />
                        </div>
                        <h4 className={`text-xl font-bold mb-1 ${data.productionLevel === level.id ? 'text-white' : 'text-gray-300'}`}>{level.label}</h4>
                        <div className={`text-sm font-bold mb-3 ${data.productionLevel === level.id ? 'text-white' : 'text-gray-500'}`}>{level.price}</div>
                        <p className="text-xs text-gray-400 leading-relaxed">{level.desc}</p>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}

export function StepDeliverables({ data, onChange }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Entregables Finales</h3>
            </div>
            <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                    {['Video Principal (16:9) - Full HD', 'Video Principal (16:9) - 4K', 'Versión Corta / Teaser (1 min)', 'Adaptación Vertical (9:16)', 'Subtítulos Quemados', 'Paquete de Fotografías (30 fotos)'].map(item => {
                        const isSelected = data.deliverables?.includes(item);
                        return (
                            <button
                                key={item}
                                onClick={() => {
                                    const newItems = isSelected
                                        ? data.deliverables.filter(i => i !== item)
                                        : [...(data.deliverables || []), item];
                                    onChange({ deliverables: newItems });
                                }}
                                className={`p-4 rounded-xl border text-left text-sm transition-all flex justify-between items-center ${isSelected ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400'}`}
                            >
                                <span>{item}</span>
                                {isSelected && <Check className="w-4 h-4" />}
                            </button>
                        )
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export function StepCommonSummary({ data, totalPrice }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">Resumen del Proyecto</h3>
                <p className="text-gray-400">Revisa los detalles antes de confirmar.</p>
            </div>

            <div className="bg-[#0F0F1A] border border-white/10 rounded-2xl p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-bl-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start border-b border-white/5 pb-6">
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Tipo de Producción</div>
                        <h4 className="text-2xl font-bold text-white">{data.type}</h4>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    {/* General Info */}
                    <div className="space-y-4">
                        <h5 className="font-bold text-gray-300 border-b border-white/5 pb-2">Información General</h5>
                        {data.title && <div className="flex justify-between"><span className="text-gray-500">Título:</span> <span className="text-white font-medium">{data.title}</span></div>}
                        <div className="flex justify-between"><span className="text-gray-500">Objetivo:</span> <span className="text-white font-medium">{data.objective || data.promoType || 'N/A'}</span></div>
                        {data.packSize && <div className="flex justify-between"><span className="text-gray-500">Pack:</span> <span className="text-white font-medium">{data.packSize} Videos</span></div>}
                    </div>

                    {/* Logistics */}
                    <div className="space-y-4">
                        <h5 className="font-bold text-gray-300 border-b border-white/5 pb-2">Logística</h5>
                        <div className="flex justify-between"><span className="text-gray-500">Fecha:</span> <span className="text-white font-medium">{data.date || 'Por definir'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Lugar:</span> <span className="text-white font-medium text-right max-w-[150px] truncate">{data.location || 'Por definir'}</span></div>
                    </div>

                    {/* Deliverables / Specs */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <h5 className="font-bold text-gray-300 border-b border-white/5 pb-2">Especificaciones</h5>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {data.productionLevel && <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Nivel: {data.productionLevel}</span>}
                            {data.promoStyle && <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Estilo: {data.promoStyle}</span>}
                            {data.platforms && data.platforms.map(p => <span key={p} className="px-2 py-1 bg-pink-500/10 text-pink-400 rounded text-xs">{p}</span>)}
                            {data.deliverables && data.deliverables.map(d => <span key={d} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">{d}</span>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center bg-[#0F0F1A] p-6 rounded-xl border border-white/10">
                <span className="text-gray-400 font-medium">Presupuesto Estimado</span>
                <span className="text-3xl font-bold text-white">${totalPrice ? totalPrice.toLocaleString() : '1,200'}</span>
            </div>
        </motion.div>
    );
}

