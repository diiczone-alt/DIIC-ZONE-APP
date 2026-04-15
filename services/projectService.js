import { supabase } from '../lib/supabase';

// Mock Data for fallback
const MOCK_PROJECTS = [
    {
        id: 'PRJ-001',
        title: 'Campaña Lanzamiento Verano',
        type: 'PROMO',
        status: 'IN_PROGRESS',
        client: 'Coca-Cola',
        deadline: '2024-11-15',
        priority: 'HIGH',
        progress: 65,
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070',
        assignee: { name: 'Carlos Editor', avatar: 'https://i.pravatar.cc/150?img=11' }
    },
    {
        id: 'PRJ-002',
        title: 'Reels Educativos Octubre',
        type: 'REEL',
        status: 'REVIEW',
        client: 'Dr. Marketing',
        deadline: '2024-11-10',
        priority: 'MEDIUM',
        progress: 90,
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1974',
        assignee: { name: 'Ana Motion', avatar: 'https://i.pravatar.cc/150?img=5' }
    },
    {
        id: 'PRJ-003',
        title: 'Entrevista Podcast Ep. 4',
        type: 'PODCAST',
        status: 'TO_DO',
        client: 'Tech Start',
        deadline: '2024-11-20',
        priority: 'LOW',
        progress: 0,
        thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=2070',
        assignee: null
    }
];

export const projectService = {

    // GET ALL
    getAll: async () => {
        // In a real app: const { data, error } = await supabase.from('projects').select('*');
        // For now, return mock with a delay
        return new Promise(resolve => setTimeout(() => resolve(MOCK_PROJECTS), 500));
    },

    // GET BY ID
    getById: async (id) => {
        const project = MOCK_PROJECTS.find(p => p.id === id);
        return new Promise(resolve => setTimeout(() => resolve(project), 300));
    },

    // CREATE (From Wizards)
    create: async (projectData) => {
        const newProject = {
            id: `PRJ-${Math.floor(Math.random() * 1000)}`,
            status: 'TO_DO',
            progress: 0,
            createdAt: new Date().toISOString(),
            ...projectData
        };
        MOCK_PROJECTS.unshift(newProject);
        return new Promise(resolve => setTimeout(() => resolve(newProject), 800));
    },

    // UPDATE STATUS (Drag & Drop)
    updateStatus: async (id, newStatus) => {
        const idx = MOCK_PROJECTS.findIndex(p => p.id === id);
        if (idx !== -1) {
            MOCK_PROJECTS[idx].status = newStatus;
            // Update progress based on status logic (mock)
            if (newStatus === 'DONE') MOCK_PROJECTS[idx].progress = 100;
            if (newStatus === 'IN_PROGRESS') MOCK_PROJECTS[idx].progress = 25;
            return MOCK_PROJECTS[idx];
        }
        return null;
    },

    // ASSIGN CREATIVE
    assignCreative: async (projectId, creative) => {
        const idx = MOCK_PROJECTS.findIndex(p => p.id === projectId);
        if (idx !== -1) {
            MOCK_PROJECTS[idx].assignee = creative;
            return MOCK_PROJECTS[idx];
        }
    }
};
