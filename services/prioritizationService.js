/**
 * Prioritization Service (Operational Intelligence)
 * "Who goes first?" based on Data, not Noise.
 */

class PrioritizationService {

    constructor() {
        // --- WEIGHTS ---
        this.WEIGHTS = {
            PLAN: 0.40,
            IMPACT: 0.25,
            URGENCY: 0.20,
            HISTORY: 0.15
        };

        // --- SCORING TABLES ---
        this.SCORES = {
            PLAN: { 'PREMIUM': 100, 'PRO': 80, 'BASIC': 60, 'PAY_PER_USE': 40, 'FREE': 20 },
            IMPACT: { 'SALES_CAMPAIGN': 100, 'LAUNCH': 90, 'AUTOMATION': 85, 'CONTENT': 70, 'DESIGN': 50, 'LAB': 30 },
            URGENCY: { 'CRITICAL_24H': 100, 'HIGH_3D': 80, 'MEDIUM_6D': 60, 'LOW_7D': 40 },
            HISTORY: { 'VIP': 100, 'GOOD': 70, 'CONFLICTIVE': 40 }
        };

        // Simulation Capacity State (85% full)
        this.networkCapacity = 85;
    }

    /**
     * Calculates the Priority Score (0-100)
     * @param {Object} client { plan: 'PRO', history: 'GOOD' }
     * @param {Object} project { type: 'SALES_CAMPAIGN', deadline: Date }
     */
    calculateScore(client, project) {
        // 1. Calculate Individual Scores
        const sPlan = this.SCORES.PLAN[client.plan] || 40;
        const sImpact = this.SCORES.IMPACT[project.type] || 50;
        const sUrgency = this._calculateUrgencyScore(project.deadline);
        const sHistory = this.SCORES.HISTORY[client.history] || 70;

        // 2. Weighted Average
        const finalScore = (
            (sPlan * this.WEIGHTS.PLAN) +
            (sImpact * this.WEIGHTS.IMPACT) +
            (sUrgency * this.WEIGHTS.URGENCY) +
            (sHistory * this.WEIGHTS.HISTORY)
        );

        // 3. Determine Tier
        let tier = 'LOW';
        if (finalScore >= 80) tier = 'HIGH';
        else if (finalScore >= 60) tier = 'MEDIUM';

        // 4. Capacity Filter (The Gatekeeper)
        // If network is busy (>85%), filter out low scores
        let status = 'APPROVED';
        if (this.networkCapacity > 85 && finalScore < 75) {
            status = 'QUEUE'; // Sent to waiting list
        }
        if (finalScore < 50) {
            status = 'QUEUE'; // Always queue low impact/value
        }
        // Safety: Sales campaigns always bypass queue if possible (min priority check)
        if (project.type === 'SALES_CAMPAIGN' && status === 'QUEUE') {
            status = 'APPROVED'; // Override
            tier = 'MEDIUM'; // Force min medium
        }

        return {
            score: Math.round(finalScore),
            tier, // HIGH, MEDIUM, LOW
            status, // APPROVED, QUEUE
            breakdown: { sPlan, sImpact, sUrgency, sHistory }
        };
    }

    _calculateUrgencyScore(deadlineStr) {
        if (!deadlineStr) return 40;
        const deadline = new Date(deadlineStr);
        const now = new Date();
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 100;
        if (diffDays <= 3) return 80;
        if (diffDays <= 6) return 60;
        return 40;
    }

    /**
     * Reorders a list of projects based on Score
     */
    prioritizeQueue(projects) {
        return projects.sort((a, b) => b.priorityScore - a.priorityScore);
    }
}

export const prioritizationService = new PrioritizationService();
