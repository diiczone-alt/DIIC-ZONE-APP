'use client';

import React from 'react';
import { Printer, Download, FileText, Sparkles, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

export const generateResearchPdf = (research, clientName = 'Marca DIIC') => {
    if (!research) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Por favor habilita las ventanas emergentes (popups) para descargar el informe en PDF.');
        return;
    }

    const title = research.title || 'Dossier Estratégico de Investigación';
    const category = research.category || research.type || 'Auditoría de Nicho';
    const date = new Date(research.createdAt || Date.now()).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const tags = Array.isArray(research.tags) ? research.tags.join(', ') : '';

    // Parse data/content
    let contentHtml = '';
    if (typeof research.data === 'string') {
        contentHtml = `<p class="paragraph">${research.data.replace(/\n/g, '<br/>')}</p>`;
    } else if (research.data && typeof research.data === 'object') {
        const d = research.data;
        contentHtml = `
            ${d.summary ? `<div class="card bg-blue"><h3>Resumen Ejecutivo</h3><p>${d.summary}</p></div>` : ''}
            ${d.frictionPoints && d.frictionPoints.length > 0 ? `
                <div class="card bg-rose">
                    <h3>Puntos de Fricción & Dolores del Paciente / Cliente</h3>
                    <ul>
                        ${d.frictionPoints.map(f => `<li><strong>${typeof f === 'object' ? f.pain || f.title : f}</strong>: ${typeof f === 'object' ? f.description || '' : ''}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${d.hooks && d.hooks.length > 0 ? `
                <div class="card bg-purple">
                    <h3>Ganchos de Alta Retención & Ángulos de Contenido</h3>
                    <ul>
                        ${d.hooks.map(h => `<li>${typeof h === 'object' ? `<strong>${h.hook || h.title}:</strong> ${h.script || ''}` : h}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${d.competitors && d.competitors.length > 0 ? `
                <div class="card bg-amber">
                    <h3>Análisis de Competidores & Oportunidades</h3>
                    <ul>
                        ${d.competitors.map(c => `<li><strong>${c.name || c}:</strong> ${c.gap || c.weakness || ''}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${d.insights ? `<div class="card"><h3>Insights Adicionales</h3><p>${typeof d.insights === 'string' ? d.insights : JSON.stringify(d.insights)}</p></div>` : ''}
        `;
    } else if (research.summary) {
        contentHtml = `<p class="paragraph">${research.summary}</p>`;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>${title} - DIIC ZONE</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Plus Jakarta Sans', sans-serif;
                background-color: #ffffff;
                color: #0f172a;
                line-height: 1.6;
                padding: 40px;
                max-width: 900px;
                margin: 0 auto;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 2px solid #6366f1;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .brand-badge {
                font-size: 20px;
                font-weight: 800;
                background: linear-gradient(135deg, #4f46e5, #9333ea);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: -0.5px;
            }
            .dossier-tag {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #6366f1;
                background: #eef2ff;
                padding: 4px 10px;
                border-radius: 6px;
                display: inline-block;
                margin-top: 5px;
            }
            .meta-info {
                text-align: right;
                font-size: 12px;
                color: #64748b;
            }
            .meta-info strong {
                color: #1e293b;
            }
            h1 {
                font-size: 26px;
                font-weight: 800;
                color: #0f172a;
                margin-bottom: 12px;
                line-height: 1.3;
            }
            .tags {
                margin-bottom: 24px;
            }
            .tag {
                font-size: 11px;
                background: #f1f5f9;
                color: #475569;
                padding: 3px 8px;
                border-radius: 4px;
                margin-right: 6px;
                font-weight: 600;
            }
            .card {
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
            .card h3 {
                font-size: 15px;
                font-weight: 700;
                margin-bottom: 12px;
                color: #1e293b;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .card.bg-blue {
                background-color: #f8fafc;
                border-color: #cbd5e1;
            }
            .card.bg-rose {
                background-color: #fff1f2;
                border-color: #fecdd3;
            }
            .card.bg-rose h3 {
                color: #e11d48;
            }
            .card.bg-purple {
                background-color: #faf5ff;
                border-color: #e9d5ff;
            }
            .card.bg-purple h3 {
                color: #7e22ce;
            }
            .card.bg-amber {
                background-color: #fffbeb;
                border-color: #fde68a;
            }
            .card.bg-amber h3 {
                color: #b45309;
            }
            ul {
                list-style-type: none;
                padding-left: 0;
            }
            li {
                position: relative;
                padding-left: 20px;
                margin-bottom: 8px;
                font-size: 13px;
                color: #334155;
            }
            li::before {
                content: "•";
                position: absolute;
                left: 6px;
                color: #6366f1;
                font-weight: bold;
                font-size: 16px;
                line-height: 1;
            }
            .paragraph {
                font-size: 13px;
                color: #334155;
                white-space: pre-line;
            }
            .footer {
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: #94a3b8;
            }
            @media print {
                body {
                    padding: 0;
                }
                .no-print {
                    display: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <div class="brand-badge">DIIC ZONE • STRATEGY AI</div>
                <div class="dossier-tag">${category}</div>
            </div>
            <div class="meta-info">
                <div>Marca: <strong>${clientName}</strong></div>
                <div>Fecha de Emisión: <strong>${date}</strong></div>
                <div>ID Documento: <strong>${research.id || 'DOC-STRAT'}</strong></div>
            </div>
        </div>

        <h1>${title}</h1>
        ${tags ? `<div class="tags">${tags.split(', ').map(t => `<span class="tag">#${t}</span>`).join('')}</div>` : ''}

        <div class="content">
            ${contentHtml}
        </div>

        <div class="footer">
            <div>Generado con Inteligencia Estratégica DIIC ZONE</div>
            <div>Confidencial • Uso Exclusivo de Marketing y Crecimiento</div>
        </div>

        <script>
            window.onload = function() {
                window.print();
            };
        </script>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export default function ResearchPdfExporter({ research, clientName }) {
    return (
        <button
            onClick={() => generateResearchPdf(research, clientName)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all shadow-sm"
            title="Exportar Dossier Ejecutivo en PDF"
        >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>PDF Dossier</span>
        </button>
    );
}
