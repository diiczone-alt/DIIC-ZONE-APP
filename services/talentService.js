/**
 * Talent Service (Reputation System)
 * Manages creative scoring based on 5 key factors.
 */

class TalentService {

    constructor() {
        // Mock Database of Creatives
        this.creatives = [
            { id: 'c1', name: 'Ana Lopez', role: 'design', score: 88, level: 4, status: 'AVAILABLE', tags: ['branding', 'social'] },
            { id: 'c2', name: 'Carlos Diaz', role: 'design', score: 65, level: 2, status: 'BUSY', tags: ['production'] },
            { id: 'c3', name: 'Roberto Gomez', role: 'video', score: 96, level: 5, status: 'AVAILABLE', tags: ['reels', 'vfx'] },
            { id: 'c4', name: 'Sofia Martinez', role: 'video', score: 45, level: 1, status: 'AVAILABLE', tags: ['editing'] },
            { id: 'c5', name: 'Lucia Torres', role: 'copy', score: 78, level: 3, status: 'AVAILABLE', tags: ['sales', 'email'] }
        ];

        // 🧠 FACTORES DEL PUNTAJE
        this.WEIGHTS = {
            TIME: 0.30,         // 1. Entrega a tiempo
            QUALITY: 0.25,      // 2. Calidad aprobada por cliente
            CORRECTIONS: 0.15,  // 3. Cantidad de correcciones
            COMMUNICATION: 0.10,// 4. Comunicación interna
            TECHNICAL: 0.20     // 5. Nivel técnico del proyecto
        };

        // 🧠 NIVELES DEL CREATIVO
        this.LEVELS = {
            1: { name: 'Junior', min: 0, max: 49, color: 'text-gray-400', desc: 'Solo tareas simples' },
            2: { name: 'Intermedio', min: 50, max: 69, color: 'text-blue-400', desc: 'Proyectos regulares' },
            3: { name: 'Profesional', min: 70, max: 84, color: 'text-purple-400', desc: 'Campañas completas' },
            4: { name: 'Senior', min: 85, max: 94, color: 'text-amber-400', desc: 'Proyectos corporativos' },
            5: { name: 'Elite', min: 95, max: 100, color: 'text-red-500', desc: 'Campañas estratégicas grandes' }
        };
    }

    // --- CORE LOGIC ---

    getCreatives() {
        return this.creatives.map(c => ({
            ...c,
            levelInfo: this.LEVELS[c.level]
        }));
    }

    /**
     * Finds the best creative using the 5-factor matching
     * @param {string} role 'design' | 'video' | 'copy'
     * @param {string} difficulty 'BASIC' | 'COMMERCIAL' | 'CORPORATE' | 'STRATEGIC'
     */
    findBestMatch(role, difficulty = 'COMMERCIAL') {
        const difficultyMap = {
            'BASIC': 1,       // Junior OK
            'COMMERCIAL': 2,  // Intermedio+
            'CORPORATE': 4,   // Senior+
            'STRATEGIC': 5    // Elite
        };
        const minLevel = difficultyMap[difficulty] || 2;

        console.log(`🔍 Searching Best Match for ${role} (Min Level: ${minLevel})...`);

        // Filter candidates
        const candidates = this.creatives.filter(c =>
            c.role === role &&
            c.status === 'AVAILABLE' &&
            c.level >= minLevel
        );

        if (candidates.length === 0) {
            console.warn('No exact match found, looking for backups...');
            return this.creatives.find(c => c.role === role) || null;
        }

        // Sort by Score (Best first)
        candidates.sort((a, b) => b.score - a.score);

        return candidates[0]; // The Champion
    }

    /**
     * Calculates score update based on project completion data
     */
    calculatePerformanceScore(metrics) {
        // Example usage:
        // calculatePerformanceScore({ timeScore: 100, qualityScore: 80, correctionsScore: 50 ... })
        const score =
            (metrics.timeScore * this.WEIGHTS.TIME) +
            (metrics.qualityScore * this.WEIGHTS.QUALITY) +
            (metrics.correctionsScore * this.WEIGHTS.CORRECTIONS) +
            (metrics.commScore * this.WEIGHTS.COMMUNICATION) +
            (metrics.techScore * this.WEIGHTS.TECHNICAL);

        return Math.round(score);
    }

    getSystemHealth() {
        return {
            avgScore: 74,
            topPerformer: this.creatives.reduce((prev, current) => (prev.score > current.score) ? prev : current),
            lowPerformersCount: this.creatives.filter(c => c.score < 50).length
        };
    }
}

export const talentService = new TalentService();
