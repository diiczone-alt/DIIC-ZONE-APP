'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, Lock, FileText, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#050510] text-white p-6 md:p-16 flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl w-full bg-[#0A0A1F] border border-white/5 rounded-[3rem] p-8 md:p-16 space-y-12 relative z-10 shadow-2xl">
                
                {/* Header */}
                <div className="space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                    </Link>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                                Política de Privacidad
                            </h1>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">
                                DIIC ZONE • Última actualización: Junio 2026
                            </p>
                        </div>
                    </div>
                </div>

                <hr className="border-white/5" />

                {/* Content Section */}
                <div className="space-y-8 text-sm text-gray-300 leading-relaxed font-medium">
                    
                    {/* Section 1 */}
                    <div className="space-y-3">
                        <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2 italic">
                            <FileText className="w-4 h-4 text-indigo-400" /> 1. Introducción y Propietario
                        </h3>
                        <p>
                            La presente Política de Privacidad describe cómo **DIIC ZONE** recopila, utiliza y protege los datos de los usuarios de nuestra plataforma de automatización y gestión comercial. El responsable del tratamiento de los datos es DIIC ZONE, accesible mediante el correo electrónico de soporte <span className="text-indigo-400 font-bold">diiczone@gmail.com</span>.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-3">
                        <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2 italic">
                            <Eye className="w-4 h-4 text-indigo-400" /> 2. Datos Recopilados mediante Meta (Facebook)
                        </h3>
                        <p>
                            Al conectar sus canales oficiales a través de nuestro portal seguro de inicio de sesión de Meta (Facebook Login), nuestra aplicación solicita permisos específicos para prestar el servicio:
                        </p>
                        <ul className="list-disc list-inside pl-4 space-y-2 text-xs font-bold text-gray-400">
                            <li><span className="text-white">public_profile y email</span>: Para identificar su cuenta en la plataforma de forma segura.</li>
                            <li><span className="text-white">pages_show_list</span>: Para listar y seleccionar las páginas comerciales de Facebook que desea automatizar.</li>
                            <li><span className="text-white">instagram_basic y instagram_manage_insights</span>: Para obtener métricas, estadísticas e interacciones del perfil comercial de Instagram.</li>
                            <li><span className="text-white">ads_read</span>: Para leer estadísticas y rendimiento de sus campañas publicitarias de Meta Ads en tiempo real.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="space-y-3">
                        <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2 italic">
                            <Lock className="w-4 h-4 text-indigo-400" /> 3. Uso de los Datos y Seguridad
                        </h3>
                        <p>
                            Los datos recopilados se utilizan únicamente para mostrar informes de rendimiento publicitario, gestionar mensajes de clientes mediante chatbots autorizados y optimizar las campañas de marketing. **DIIC ZONE nunca almacena sus contraseñas**, no comparte información con terceros no autorizados y encripta todas las claves de acceso de la API (Access Tokens) con estándares de grado médico (GDPR).
                        </p>
                    </div>

                    {/* Section 4 */}
                    <div className="space-y-3">
                        <h3 className="text-white text-base font-black uppercase tracking-wider flex items-center gap-2 italic">
                            <Trash2 className="w-4 h-4 text-indigo-400" /> 4. Eliminación de Datos del Usuario
                        </h3>
                        <p>
                            Usted tiene control absoluto sobre sus datos. Puede retirar los accesos y eliminar su información en cualquier momento mediante las siguientes opciones:
                        </p>
                        <ol className="list-decimal list-inside pl-4 space-y-2 text-xs text-gray-400 font-bold">
                            <li>Desvinculando su cuenta en la sección de <span className="text-white">"Conectividad"</span> dentro de su panel de DIIC ZONE. Esto purgará automáticamente los tokens de acceso de nuestra base de datos.</li>
                            <li>Ingresando a su cuenta de Facebook personal &gt; **Configuración y Privacidad &gt; Aplicaciones y sitios web**, seleccionando **Asistente DIIC ZONE** y haciendo clic en **Eliminar**.</li>
                            <li>Enviando una solicitud directa por correo electrónico a <span className="text-white">diiczone@gmail.com</span> solicitando la eliminación de todos los registros de datos asociados a su cuenta. Responderemos en menos de 48 horas laborales.</li>
                        </ol>
                    </div>
                </div>

                <hr className="border-white/5" />

                {/* Footer Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    <span>DIIC ZONE © 2026</span>
                    <span>Cifrado SSL de 256 bits</span>
                </div>
            </div>
        </main>
    );
}
