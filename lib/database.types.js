/**
 * @typedef {Object} Profile
 * @property {string} id - UUID referencing auth.users
 * @property {string} full_name
 * @property {'client' | 'creative' | 'admin'} role
 * @property {string} company_name
 * @property {number} current_level - 1 to 5
 * @property {string} business_type
 * @property {string} created_at
 */

/**
 * @typedef {Object} Project
 * @property {string} id - UUID
 * @property {string} client_id - UUID referencing profiles.id
 * @property {string} title
 * @property {'planning' | 'production' | 'review' | 'approved' | 'completed'} status
 * @property {string} deadline - ISO timestamp
 * @property {'video' | 'design' | 'web'} department
 * @property {string} created_at
 */

/**
 * @typedef {Object} Deliverable
 * @property {string} id - UUID
 * @property {string} project_id - UUID referencing projects.id
 * @property {string} file_url
 * @property {number} version
 * @property {'pending_review' | 'changes_requested' | 'approved'} status
 * @property {Array<{id: string, text: string, author: string, date: string}>} feedback
 * @property {string} created_at
 */

export const Types = {}
