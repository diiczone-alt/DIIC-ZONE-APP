/**
 * DIIC ZONE - Data Store (Local Storage)
 * Manages the state of Projects, Videos, and Workflow Status.
 */

export const Store = {
    // Default Data for First Launch
    defaults: {
        projects: [
            {
                id: 'proj_1',
                title: 'Hospital Santa Anita - Seguros Reel',
                client: 'Hospital Nova Clínica',
                status: 'Review', // Planning, Editing, Review, Done
                dueDate: '2025-12-10',
                assignee: 'Editor Mike',
                videos: [
                    {
                        id: 'vid_1',
                        name: 'Reel_Seguros_V1.mp4',
                        url: '#',
                        status: 'Review', // Draft, Pending Review, Approved, Corrections
                        feedback: []
                    }
                ]
            },
            {
                id: 'proj_2',
                title: 'DIIC ZONE Intro',
                client: 'Internal',
                status: 'Editing',
                dueDate: '2025-12-15',
                assignee: 'Editor Sarah',
                videos: []
            }
        ]
    },

    // Initialize Store
    init() {
        if (typeof window === 'undefined') return;
        if (!localStorage.getItem('diic_projects')) {
            localStorage.setItem('diic_projects', JSON.stringify(this.defaults.projects));
        }
    },

    // Get all projects
    getProjects() {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('diic_projects')) || [];
    },

    // Get single project
    getProject(id) {
        if (typeof window === 'undefined') return null;
        const projects = this.getProjects();
        return projects.find(p => p.id === id);
    },

    // Add new project
    addProject(project) {
        if (typeof window === 'undefined') return null;
        const projects = this.getProjects();
        project.id = 'proj_' + Date.now();
        project.videos = [];
        projects.unshift(project); // Add to top
        this.saveProjects(projects);
        return project;
    },

    // Update existing project
    updateProject(updatedProject) {
        if (typeof window === 'undefined') return;
        const projects = this.getProjects();
        const index = projects.findIndex(p => p.id === updatedProject.id);
        if (index !== -1) {
            projects[index] = updatedProject;
            this.saveProjects(projects);
        }
    },

    // Save helper
    saveProjects(projects) {
        if (typeof window === 'undefined') return;
        localStorage.setItem('diic_projects', JSON.stringify(projects));
        // Dispatch event for reactive updates if we were using a framework, 
        // for now we'll just reload views.
    },

    // Add Video to Project
    addVideoToProject(projectId, videoName) {
        if (typeof window === 'undefined') return;
        const projects = this.getProjects();
        const project = projects.find(p => p.id === projectId);
        if (project) {
            project.videos.push({
                id: 'vid_' + Date.now(),
                name: videoName,
                url: '#', // In a real app this would be a blob or cloud URL
                status: 'Pending Review',
                feedback: []
            });
            // Update project status potentially
            if (project.status === 'Planning') project.status = 'Editing';
            this.saveProjects(projects);
        }
    },

    // Add Feedback
    addFeedback(projectId, videoId, comment, author) {
        if (typeof window === 'undefined') return;
        const projects = this.getProjects();
        const project = projects.find(p => p.id === projectId);
        if (project) {
            const video = project.videos.find(v => v.id === videoId);
            if (video) {
                video.feedback.push({
                    id: 'fb_' + Date.now(),
                    text: comment,
                    author: author,
                    date: new Date().toISOString()
                });
                // If feedback is added, usually implies corrections needed
                video.status = 'Corrections';
                project.status = 'Review';
                this.saveProjects(projects);
            }
        }
    }
};

// Auto-initialize on load if client-side
if (typeof window !== 'undefined') {
    Store.init();
}
