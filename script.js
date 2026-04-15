/**
 * DIIC ZONE - App Controller
 * Connects Router, Store, and Views.
 */

const App = {
    // Action: Add new video (Simulated)
    addVideo(projectId) {
        const name = prompt("Nombre del archivo de video (ej. Version_1.mp4):");
        if (name) {
            Store.addVideoToProject(projectId, name);
            // Refresh View
            Router.navigate('project-detail', projectId);
        }
    },

    // Action: Review Video (Add Feedback)
    reviewVideo(projectId, videoId) {
        const comment = prompt("Escribe tus correcciones o comentarios:");
        if (comment) {
            Store.addFeedback(projectId, videoId, comment, "Jefe Studio");
            // Refresh View
            Router.navigate('project-detail', projectId);
        }
    }
};

// Router Logic
const Router = {
    currentRoute: 'dashboard',

    init() {
        // Initialize Lucide Icons
        if (window.lucide) lucide.createIcons();

        // Set Date
        const now = new Date();
        const dateEl = document.getElementById('current-date');
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('es-ES', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        }

        // Handle browser back/forward (simple implementation)
        window.onpopstate = (event) => {
            if (event.state) {
                this.navigate(event.state.route, event.state.params, false);
            }
        };

        // Initial Render
        this.navigate('dashboard', null, true);
    },

    navigate(route, params = null, addToHistory = true) {
        this.currentRoute = route;

        if (addToHistory) {
            history.pushState({ route, params }, '', `#${route}`);
        }

        // Update Sidebar UI
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const activeNav = document.getElementById(`nav-${route}`);
        if (activeNav) activeNav.classList.add('active');

        // Render View
        const viewContainer = document.getElementById('app-view');
        const titleEl = document.getElementById('page-title');

        // Simple fade transition
        viewContainer.style.opacity = '0';

        setTimeout(() => {
            if (route === 'dashboard') {
                if (titleEl) titleEl.textContent = 'Production Dashboard';
                viewContainer.innerHTML = Views.dashboard();
            } else if (route === 'projects') {
                if (titleEl) titleEl.textContent = 'Gestión de Proyectos';
                viewContainer.innerHTML = Views.projects();
            } else if (route === 'project-detail') {
                if (titleEl) titleEl.textContent = 'Detalle de Proyecto';
                viewContainer.innerHTML = Views.projectDetail(params);
            } else if (route === 'calendar') {
                if (titleEl) titleEl.textContent = 'Calendario';
                viewContainer.innerHTML = `<div class="card"><h3>Calendario</h3><p>Próximamente: Integración con Google Calendar.</p></div>`;
            } else if (route === 'team') {
                if (titleEl) titleEl.textContent = 'Equipo';
                viewContainer.innerHTML = `<div class="card"><h3>Equipo</h3><p>Directorio de editores y roles.</p></div>`;
            } else {
                viewContainer.innerHTML = `<div class="card"><h3>En construcción</h3><p>La sección ${route} estará disponible pronto.</p></div>`;
            }

            viewContainer.style.opacity = '1';
            if (window.lucide) lucide.createIcons();
        }, 150);
    }
};

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => Router.init());
