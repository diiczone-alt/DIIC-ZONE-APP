/**
 * Quality Control (QC) Service
 * The "Gatekeeper" that ensures standards are met before delivery.
 */

class QCService {

    constructor() {
        this.checks = {
            // 1️⃣ QC 0 — VALIDACIÓN DE INSUMOS
            'QC_INPUT': {
                title: 'QC 0: Validación de Insumos',
                description: 'Verificación de materiales antes de producir.',
                items: [
                    { id: 'logo', label: 'Logo en alta resolución (PNG/AI)' },
                    { id: 'brief', label: 'Brief completo y claro' },
                    { id: 'assets', label: 'Material visual suficiente (Fotos/Videos)' },
                    { id: 'brand_guide', label: 'Manual de marca disponible' }
                ]
            },

            // 2️⃣ QC 1 — REVISIÓN TÉCNICA (VIDEO)
            'QC_TECH_VIDEO': {
                title: 'QC 1: Revisión Técnica (Video)',
                description: 'Estándares de exportación y calidad audiovisual.',
                items: [
                    { id: 'res', label: 'Resolución correcta (9:16 o 16:9)' },
                    { id: 'fps', label: 'FPS consistentes (24/30/60)' },
                    { id: 'audio', label: 'Audio normalizado (-6dB a -14dB)' },
                    { id: 'safe_area', label: 'Safe Area respetada (Títulos/Subtítulos)' },
                    { id: 'color', label: 'Color Grading aplicado y coherente' }
                ]
            },

            // 2️⃣ QC 1 — REVISIÓN TÉCNICA (DISEÑO)
            'QC_TECH_DESIGN': {
                title: 'QC 1: Revisión Técnica (Diseño)',
                description: 'Estándares gráficos y de exportación.',
                items: [
                    { id: 'dim', label: 'Dimensiones correctas (1080x1080 / 1080x1920)' },
                    { id: 'export', label: 'Formato válido (PNG/JPG High)' },
                    { id: 'readability', label: 'Contraste y legibilidad de textos' },
                    { id: 'grid', label: 'Alienación y Márgenes correctos' }
                ]
            },

            // 3️⃣ QC 2 — REVISIÓN DE MARCA
            'QC_BRAND': {
                title: 'QC 2: Revisión de Marca',
                description: 'Alineación con la identidad del cliente.',
                items: [
                    { id: 'colors', label: 'Uso correcto de Paleta de Colores' },
                    { id: 'fonts', label: 'Tipografías oficiales utilizadas' },
                    { id: 'tone', label: 'Tono de comunicación adecuado (Formal/Cercano)' },
                    { id: 'style', label: 'Estilo visual acorde al nicho' }
                ]
            },

            // 4️⃣ QC 3 — REVISIÓN DE OBJETIVO (MARKETING)
            'QC_MARKETING': {
                title: 'QC 3: Revisión de Objetivo',
                description: 'Eficacia del contenido para cumplir su meta.',
                items: [
                    { id: 'hook', label: 'Gancho visual/auditivo en primeros 3s' },
                    { id: 'value', label: 'Aporta valor o entretenimiento claro' },
                    { id: 'cta', label: 'Call to Action (CTA) claro y visible' },
                    { id: 'pain_point', label: 'Ataca un dolor o deseo del cliente' }
                ]
            },

            // 5️⃣ QC 4 — CONTROL DE PUBLICACIÓN
            'QC_PUBLISH': {
                title: 'QC 4: Control de Publicación',
                description: 'Checklist final antes de subir.',
                items: [
                    { id: 'copy', label: 'Copy redactado y con emojis' },
                    { id: 'hashtags', label: 'Hashtags estratégicos seleccionados' },
                    { id: 'tag', label: 'Etiquetado de cuentas/colaboradores' },
                    { id: 'sched', label: 'Fecha y hora programada correctamente' }
                ]
            }
        };
    }

    getChecklist(type) {
        return this.checks[type] || null;
    }

    /**
     * Simulates verifying a checklist
     * @param {string} projectId 
     * @param {string} qcType 
     * @param {Object} results { logo: true, brief: false ... }
     */
    async submitReview(projectId, qcType, results) {
        console.log(`🛡️ QC SUBMITTED [${qcType}] for Project ${projectId}`, results);

        // Logic to verify if passed (all must be true generally)
        const allPassed = Object.values(results).every(val => val === true);

        // Simulate API delay
        await new Promise(r => setTimeout(r, 800));

        return {
            success: true,
            status: allPassed ? 'PASSED' : 'FAILED',
            timestamp: new Date().toISOString()
        };
    }

    // Returns analytics mock for Admin Dashboard
    async getQCAnalytics() {
        return {
            pass_rate_first_try: 82, // 82%
            avg_corrections_per_client: 1.4,
            top_issues: ['Safe Area (Video)', 'Ortografía (Copy)', 'Logos Incorrectos']
        };
    }
}

export const qcService = new QCService();
