import { Bell, Film, CheckCircle, Clock } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-background overflow-hidden">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative h-screen">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 left-0 w-full h-96 bg-primary/10 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 blur-[120px] pointer-events-none"></div>

                {/* Header */}
                <header className="flex items-center justify-between p-8 sticky top-0 md:bg-transparent z-40 backdrop-blur-sm md:backdrop-blur-none">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white">Bienvenido, Mike</h2>
                        <p className="text-muted-foreground">Aquí está el resumen de tu ecosistema creativo.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-300 hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <div className="absolute top-2 right-3 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        </button>
                        <button className="px-6 py-2 rounded-full bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all transform hover:scale-105">
                            + Nuevo Proyecto
                        </button>
                    </div>
                </header>

                {/* Dynamic Grid */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pb-20">

                    {/* Metric Card 1 */}
                    <div className="lg:col-span-3 glass rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all"></div>
                        <div className="text-muted-foreground text-sm font-medium mb-2">Total Seguidores</div>
                        <div className="text-3xl font-display font-bold text-white">24.5k</div>
                        <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2">
                            <span>+12% vs mes anterior</span>
                        </div>
                    </div>

                    {/* Metric Card 2 */}
                    <div className="lg:col-span-3 glass rounded-2xl p-6 relative overflow-hidden group hover:border-secondary/50 transition-colors">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-secondary/20 blur-2xl group-hover:bg-secondary/30 transition-all"></div>
                        <div className="text-muted-foreground text-sm font-medium mb-2">Alcance de Video</div>
                        <div className="text-3xl font-display font-bold text-white">850k</div>
                        <div className="flex items-center gap-1 text-emerald-400 text-sm mt-2">
                            <span>+28% Viral!</span>
                        </div>
                    </div>

                    {/* Metric Card 3 */}
                    <div className="lg:col-span-3 glass rounded-2xl p-6 relative overflow-hidden group hover:border-accent/50 transition-colors">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-accent/20 blur-2xl group-hover:bg-accent/30 transition-all"></div>
                        <div className="text-muted-foreground text-sm font-medium mb-2">Tareas Pendientes</div>
                        <div className="text-3xl font-display font-bold text-white">4</div>
                        <div className="text-gray-500 text-sm mt-2">
                            2 Revisiones Urgentes
                        </div>
                    </div>

                    {/* Add Metric Btn */}
                    <div className="lg:col-span-3 glass rounded-2xl p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-primary/50 transition-colors border-dashed border border-white/10 group">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                            <span className="text-2xl text-gray-400">+</span>
                        </div>
                        <div className="text-sm font-medium text-white">Añadir Métrica</div>
                    </div>

                    {/* Active Projects Section */}
                    <div className="lg:col-span-8 glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Producción en Curso</h3>
                            <button className="text-xs text-primary hover:text-primary/80">Ver Tablero Completo →</button>
                        </div>

                        <div className="space-y-4">
                            {/* Item 1 */}
                            <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer hover:bg-white/10">
                                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 mr-4">
                                    <Film className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium group-hover:text-primary transition-colors">Reel: Lanzamiento V2</h4>
                                    <p className="text-xs text-muted-foreground">Editado por Sarah • Hace 2h</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                    En Revisión
                                </span>
                            </div>

                            {/* Item 2 */}
                            <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer hover:bg-white/10">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 mr-4">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium group-hover:text-primary transition-colors">Carrusel Educativo: Tips IA</h4>
                                    <p className="text-xs text-muted-foreground">Diseño por Alex • Ayer</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    Aprobado
                                </span>
                            </div>

                            {/* Item 3 */}
                            <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer hover:bg-white/10">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500 mr-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium group-hover:text-primary transition-colors">Podcast Ep. 45 - Audio Raw</h4>
                                    <p className="text-xs text-muted-foreground">Subido por Mike • Hace 10m</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                    Pendiente
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Gamification / Goals */}
                    <div className="lg:col-span-4 glass rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Progreso de Meta</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Objetivo Mensual</span>
                                <span className="text-sm font-bold text-secondary">75%</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-6">
                                <div className="h-full bg-gradient-to-r from-primary to-secondary w-3/4 rounded-full relative">
                                    <div className="absolute right-0 top-0 h-full w-2 bg-white/50 animate-pulse"></div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-6">Faltan 5 publicaciones para desbloquear "Creator Badge Silver".</p>
                        </div>

                        <div className="p-4 rounded-xl gradient-border bg-white/5 group hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">🎓</div>
                                <div>
                                    <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">Lección Recomendada</div>
                                    <div className="text-xs text-gray-400">Cómo mejorar tu retención en 3 pasos</div>
                                </div>
                            </div>
                            <button className="mt-3 w-full py-2 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                                Ver Clase (5 min)
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
