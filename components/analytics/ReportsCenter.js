'use client';

import { motion } from 'framer-motion';
import { FileText, Download, Share2, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function ReportsCenter() {

    const REPORTS = [
        { id: 1, name: 'Reporte Mensual: Octubre', type: 'Completo', date: '01 Nov', size: '2.4 MB', status: 'ready' },
        { id: 2, name: 'Análisis de Campaña "Seguros"', type: 'Pauta', date: '25 Oct', size: '1.1 MB', status: 'ready' },
        { id: 3, name: 'Auditoría de Instagram', type: 'Redes', date: '15 Oct', size: '0.8 MB', status: 'ready' },
        { id: 4, name: 'Reporte Mensual: Noviembre', type: 'Completo', date: '---', size: '---', status: 'processing' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Centro de Reportes</h2>
                    <p className="text-gray-400 text-sm">Descarga tus análisis detallados y proyecciones.</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-colors">
                    <FileText className="w-4 h-4" /> Generar Nuevo
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {REPORTS.map(report => (
                    <div key={report.id} className="bg-[#0E0E18] p-5 rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-indigo-500/30 transition-all">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${report.status === 'ready' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gray-800 text-gray-500'
                            }`}>
                            <FileText className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate">{report.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 uppercase font-bold">{report.type}</span>
                                <span>• {report.size}</span>
                                <span>• {report.date}</span>
                            </div>
                        </div>

                        {report.status === 'ready' ? (
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Compartir">
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-indigo-400 hover:text-white border border-white/10 transition-colors" title="Descargar">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-bold rounded-lg border border-yellow-500/20 flex items-center gap-2">
                                <Clock className="w-3 h-3 animate-pulse" /> Generando...
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
