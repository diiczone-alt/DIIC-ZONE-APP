# DIIC ZONE - Propuesta de Arquitectura Digital & Ecosistema

**Versión del Documento:** 1.0  
**Fecha:** 2026-01-13  
**Autor:** Equipo de Arquitectura DIIC ZONE (AI Agent)

---

## 1. Visión del Producto
**DIIC ZONE** no es solo una herramienta de gestión; es un **ecosistema digital inmersivo** que centraliza la producción creativa, la educación y el crecimiento de marca. Su propósito es eliminar el caos operativo mediante una interfaz "invisible" para el cliente, donde la complejidad técnica se transforma en una experiencia premium de confianza y orden.

### Pilares de Diseño
1.  **Abstracción de Complejidad:** El cliente ve resultados y progreso, no tickets ni bases de datos.
2.  **Estética Premium:** Minimalismo radical, "Glassmorphism" oscuro, tipografías modernas (Inter/Outfit), y micro-interacciones fluidas.
3.  **Centralización:** Todo (archivos, comunicación, aprendizaje, métricas) vive en un solo lugar.

---

## 2. Tipos de Usuarios y Roles (RBAC)

El sistema se basa en un modelo de **Roles Jerárquicos** con vistas personalizadas:

| Rol | Enfoque Principal | Permisos Clave |
| :--- | :--- | :--- |
| **Administrador (Super Admin)** | Control Total | Gestión de usuarios, facturación global, configuración de sistema, vista "Dios" de todos los proyectos. |
| **Cliente (Partner)** | Resultados / Aprobación | Ver dashboard de métricas, aprobar contenido, descargar entregables, ver progreso de metas. **Vista simplificada.** |
| **Community Manager (CM)** | Estrategia / Ejecución | Carga de grillas, redacción de copys, interacción con audiencia, reporte de métricas. |
| **Creador (Content Creator)** | Producción / Edición | Subida de crudos, gestión de versiones de edición, marcado de estados (En revisión/Final). |
| **Estudiante** | Aprendizaje / Certificación | Acceso a cursos, seguimiento de progreso personal, exámenes, descargas de recursos. |

---

## 3. Arquitectura de la Aplicación (Funcional)

La plataforma se divide en **4 Módulos Core**:

### A. Módulo Dashboard & Business Intelligence (El Cerebro)
*Para Clientes y CMs*
*   **Integración de Datos:** Conexión vía API (o Make/n8n) con Meta, TikTok, YouTube.
*   **Visualización:** Gráficos limpios (Recharts/Chart.js) mostrando Crecimiento de Seguidores, Alcance, Engagement Rate.
*   **Metas:** Barra de progreso visual hacia objetivos mensuales (ej. "Llegar a 10k seguidores").

### B. Módulo Studio & Producción (La Fábrica)
*Para Creadores y CMs*
*   **Kanban de Contenido:** Estados claros: *Idea > Guion > Grabación > Edición > Revisión > Aprobado > Programado*.
*   **Calendario Interactivo:** Vista mensual/semanal de publicaciones "Drag & Drop".
*   **Biblioteca de Activos (DAM):** Sistema de carpetas inteligente para entregables finales.
*   **Feedback Loop:** Comentarios directos sobre versiones de video/imagen (tipo Frame.io simplificado).

### C. Módulo Academia (El Crecimiento)
*Para Estudiantes y Staff*
*   **LMS Integrado:** Reproductor de video optimizado, estructura de capítulos.
*   **Gamificación:** Badges y barras de progreso por completar cursos.
*   **Recursos:** PDFs y plantillas descargables asociados a lecciones.

### D. Módulo Automatización (El Motor Invisible)
*Backend & Operaciones*
*   **Triggers:**
    *   *Nuevo video aprobado* -> Subir a carpeta "Final" en Drive + Notificar al Cliente.
    *   *Nuevo lead en web* -> Agregar a CRM + Email de bienvenida.
*   **Motor:** Webhooks recibidos/enviados a n8n/Make.

---

## 4. Mapa de Pantallas (Sitemap)

1.  **Auth Layer**
    *   Login / Recuperar Contraseña
    *   Onboarding (Configuración inicial de perfil)
2.  **Home / Dashboard (Personalizado por Rol)**
    *   *Cliente:* Resumen de Métricas + Últimos Entregables + Estado de Metas.
    *   *Equipo:* Tareas Pendientes + Alertas de Producción.
3.  **Producción (Studio)**
    *   Vista Tablero (Kanban)
    *   Vista Calendario
    *   Detalle de Item (Video/Post) + Chat de Feedback
4.  **Archivos (Vault)**
    *   Explorador de Archivos (Grid/List)
5.  **Academia**
    *   Lobby de Cursos
    *   Reproductor de Clases
    *   Vista de Examen/Certificado
6.  **Perfil & Ajustes**
    *   Integraciones (Conectar RRSS)
    *   Facturación (Para clientes)

---

## 5. Recomendaciones Técnicas (Tech Stack)

Para garantizar escalabilidad, velocidad y una experiencia premium:

### Frontend (La Experiencia)
*   **Framework:** **Next.js 14+ (App Router)**. React server components para máximo rendimiento y SEO.
*   **Estilado:** **Tailwind CSS**. Indispensable para iteración rápida y diseño consistente.
*   **UI Components:** **Shadcn/ui** (base accesible y personalizable) + **Framer Motion** (para animaciones wow).
*   **Estado:** **Zustand** (ligero y potente para manejar estado global, ej. reproductor de música, usuario).

### Backend & Datos (La Estructura)
*   **Base de Datos:** **Supabase (PostgreSQL)**. Ofrece Auth, Database y Realtime (para notificaciones y chat) "out of the box".
*   **Almacenamiento:** **Supabase Storage** o **AWS S3** para archivos pesados (videos de academia).
*   **ORM:** **Prisma**. Tipado seguro y fácil manejo de relaciones.

### Automatización & Integraciones
*   **Orquestador:** **n8n** (Self-hosted o Cloud). Más potente y económico que Zapier para flujos complejos.
*   **APIs:** Integración oficial con Meta Graph API / TikTok API para métricas.

### Infraestructura Mobile
*   **PWA (Progressive Web App):** Primera fase. Instalable, notificaciones push, costo bajo.
*   **React Native (Futuro):** Si se requiere uso intensivo de cámara o hardware nativo.

---

## 6. Propuesta UX/UI (Look & Feel)

**Concepto: "Creative Control Room"**

*   **Paleta de Colores:** Fondo oscuro profundo (`#050510` o similar), acentos en Neon Purple (`#8b5cf6`) y Cyan (`#06b6d4`) para indicar interactividad.
*   **Tipografía:** *Inter* para UI y lectura, *Outfit* o *Space Grotesk* para encabezados y números grandes.
*   **Efectos:**
    *   *Glassmorphism:* Paneles semitransparentes con `backdrop-filter: blur()`.
    *   *Glow:* Sombras de colores suaves detrás de botones principales y gráficas.
*   **Navegación:** Sidebar lateral colapsable (Desktop) / Bottom Navigation Bar (Mobile).

---

## 7. Flujo Crítico: Aprobación de Contenido

1.  **Creador** sube video borrador a DIIC ZONE.
2.  El sistema notifica al **CM** y cambia estado a "Revisión Interna".
3.  **CM** revisa, aprueba y cambia estado a "Revisión Cliente".
4.  **Cliente** recibe notificación push/email.
5.  **Cliente** entra a la App, ve el video, deja un comentario en el minuto 0:15 ("Cambiar música").
6.  **Creador** ve el feedback, sube "V2".
7.  **Cliente** aprueba V2.
8.  **Automatización (n8n):** Mueve archivo a carpeta "LISTO PARA PUBLICAR", actualiza Calendario y notifica al equipo.

---
*Este documento sirve como hoja de ruta ("Blueprint") para el desarrollo de la plataforma DIIC ZONE.*
