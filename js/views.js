/**
 * DIIC ZONE - Views
 * Generates HTML for different app pages.
 */

const Views = {
    // -------------------------
    // DASHBOARD VIEW
    // -------------------------
    dashboard() {
        const projects = Store.getProjects();
        const activeCount = projects.filter(p => p.status !== 'Done').length;
        const reviewCount = projects.filter(p => p.status === 'Review').length;

        return `
            <div class="dashboard-grid">
                <!-- Stat Cards -->
                <div class="card">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-muted" style="font-size: 0.9rem">Proyectos Activos</h3>
                        <i data-lucide="activity" style="color: var(--color-primary)"></i>
                    </div>
                    <h1>${activeCount}</h1>
                    <span class="text-muted" style="font-size: 0.8rem">+2 esta semana</span>
                </div>
                
                <div class="card">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-muted" style="font-size: 0.9rem">Pendientes Revisión</h3>
                        <i data-lucide="eye" style="color: var(--color-warning)"></i>
                    </div>
                    <h1>${reviewCount}</h1>
                    <span class="badge badge-review">Atención Requerida</span>
                </div>

                <div class="card">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="text-muted" style="font-size: 0.9rem">Videos Entregados</h3>
                        <i data-lucide="check-circle" style="color: var(--color-success)"></i>
                    </div>
                    <h1>12</h1>
                    <span class="text-muted" style="font-size: 0.8rem">Este mes</span>
                </div>
            </div>

            <div style="margin-top: 3rem;">
                <div class="flex justify-between items-center mb-2">
                    <h3>Entregas Recientes</h3>
                    <button class="btn btn-outline btn-sm" onclick="Router.navigate('projects')">Ver Todo</button>
                </div>
                <div class="card" style="padding: 0;">
                     ${this._renderProjectTable(projects.slice(0, 3))}
                </div>
            </div>
        `;
    },

    // -------------------------
    // PROJECTS VIEW
    // -------------------------
    projects() {
        const projects = Store.getProjects();
        return `
            <div class="flex justify-between items-center">
                <div class="flex gap-2">
                    <button class="btn btn-outline btn-sm active">Todos</button>
                    <button class="btn btn-outline btn-sm">En Proceso</button>
                    <button class="btn btn-outline btn-sm">Revisión</button>
                </div>
                <button class="btn btn-primary" onclick="alert('Feature coming: Add Project Modal')">
                    <i data-lucide="plus"></i> Nuevo Proyecto
                </button>
            </div>

            <div class="dashboard-grid" style="grid-template-columns: 1fr; margin-top: 1.5rem;">
                ${projects.map(p => this._renderProjectCard(p)).join('')}
            </div>
        `;
    },

    // -------------------------
    // PROJECT DETAIL VIEW
    // -------------------------
    projectDetail(id) {
        const project = Store.getProject(id);
        if (!project) return `<div class="card">Proyecto no encontrado</div>`;

        return `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <button class="btn btn-outline btn-sm mb-2" onclick="Router.navigate('projects')">
                        <i data-lucide="arrow-left"></i> Volver
                    </button>
                    <h1>${project.title}</h1>
                    <p class="text-muted">Cliente: ${project.client} | Entrega: ${project.dueDate}</p>
                </div>
                <span class="badge badge-${project.status.toLowerCase()}">${project.status}</span>
            </div>

            <div class="dashboard-grid" style="grid-template-columns: 2fr 1fr;">
                <!-- Main Content: Videos -->
                <div>
                    <div class="flex justify-between items-center mb-3">
                        <h3>Videos en Producción</h3>
                        <button class="btn btn-primary btn-sm" onclick="App.addVideo('${project.id}')">
                            <i data-lucide="upload"></i> Subir Video
                        </button>
                    </div>

                    <div class="flex flex-col gap-4">
                        ${project.videos.length === 0 ?
                `<div class="card text-muted" style="text-align: center; padding: 3rem;">
                                No hay videos subidos aún. <br> Sube el primer corte para iniciar la revisión.
                             </div>` :
                project.videos.map(v => this._renderVideoItem(project.id, v)).join('')
            }
                    </div>
                </div>

                <!-- Sidebar: Resources & Info -->
                <div class="flex flex-col gap-4">
                    <div class="card">
                        <h3>Recursos</h3>
                        <ul class="nav-links" style="margin-top: 1rem;">
                            <li class="nav-item">
                                <i data-lucide="folder"></i> Material Bruto (Drive)
                            </li>
                            <li class="nav-item">
                                <i data-lucide="file-text"></i> Guión .docx
                            </li>
                        </ul>
                    </div>
                    <div class="card">
                        <h3>Responsables</h3>
                        <div class="flex items-center gap-2 mt-2">
                            <div style="width: 24px; height: 24px; background: #64748b; border-radius: 50%;"></div>
                            <span>${project.assignee}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // -------------------------
    // HELPERS
    // -------------------------
    _renderProjectTable(projects) {
        return `
            <table style="width: 100%; border-collapse: collapse;">
                <thead style="background: rgba(255,255,255,0.02); text-align: left;">
                    <tr>
                        <th style="padding: 1rem;">Proyecto</th>
                        <th style="padding: 1rem;">Cliente</th>
                        <th style="padding: 1rem;">Estado</th>
                        <th style="padding: 1rem;"></th>
                    </tr>
                </thead>
                <tbody>
                    ${projects.map(p => `
                        <tr style="border-top: 1px solid var(--border-color); cursor: pointer;" onclick="Router.navigate('project-detail', '${p.id}')">
                            <td style="padding: 1rem; font-weight: 500;">${p.title}</td>
                            <td style="padding: 1rem;" class="text-muted">${p.client}</td>
                            <td style="padding: 1rem;"><span class="badge badge-${p.status.toLowerCase()}">${p.status}</span></td>
                            <td style="padding: 1rem;"><i data-lucide="chevron-right" style="width: 16px;"></i></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    _renderProjectCard(p) {
        return `
            <div class="card flex justify-between items-center" onclick="Router.navigate('project-detail', '${p.id}')" style="cursor: pointer;">
                <div class="flex items-center gap-4">
                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--color-surface), var(--color-surface-hover)); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="play" class="text-muted"></i>
                    </div>
                    <div>
                        <h3>${p.title}</h3>
                        <p class="text-muted">${p.client} • Due ${p.dueDate}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-muted" style="font-size: 0.9rem;">
                        ${p.videos.length} Videos
                    </div>
                    <span class="badge badge-${p.status.toLowerCase()}">${p.status}</span>
                    <i data-lucide="chevron-right"></i>
                </div>
            </div>
        `;
    },

    _renderVideoItem(pid, v) {
        return `
            <div class="card">
                <div class="flex justify-between items-start">
                    <div class="flex gap-4">
                        <div style="width: 120px; height: 70px; background: #000; border-radius: var(--radius-sm); position: relative; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #fff; font-size: 0.8rem;">Thumbnail</span>
                        </div>
                        <div>
                            <h4>${v.name}</h4>
                            <span class="badge badge-${v.status === 'Corrections' ? 'review' : 'editing'}" style="margin-top: 0.5rem; display: inline-block; font-size: 0.7rem;">${v.status}</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-outline btn-sm" onclick="alert('Playing video...')"><i data-lucide="play"></i> Ver</button>
                        <button class="btn btn-primary btn-sm" onclick="App.reviewVideo('${pid}', '${v.id}')"><i data-lucide="message-square"></i> Revisar</button>
                    </div>
                </div>
                
                ${v.feedback.length > 0 ? `
                    <div style="margin-top: 1rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: var(--radius-sm);">
                        <h5 class="mb-2 text-muted">Correcciones Solicitadas:</h5>
                        ${v.feedback.map(f => `
                            <div style="margin-bottom: 0.5rem; font-size: 0.9rem;">
                                <span style="color: var(--color-primary); font-weight: bold;">${f.author}:</span> ${f.text}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
};
