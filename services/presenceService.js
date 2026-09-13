'use client';

import { supabase } from '@/lib/supabase';

class PresenceService {
    constructor() {
        this.channel = null;
        this.heartbeatInterval = null;
        this.currentMember = null;
        this.presenceListeners = new Set();
        this.onlineUsers = new Map(); // key: email (lowercase), value: presence data
    }

    /**
     * Start broadcasting presence for the current user/talento
     */
    startHeartbeat(member) {
        if (typeof window === 'undefined') return;
        if (!member || !member.email) return;

        this.currentMember = member;

        // 1. Immediate DB Heartbeat
        this.sendDbHeartbeat(member.email);

        // 2. Setup Periodic DB Heartbeat every 60s
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.sendDbHeartbeat(member.email);
            }
        }, 60000);

        // 3. User activity listener (refresh heartbeat on interaction if idle > 30s)
        let lastActivity = Date.now();
        const onActivity = () => {
            const now = Date.now();
            if (now - lastActivity > 30000) {
                lastActivity = now;
                this.sendDbHeartbeat(member.email);
            }
        };

        window.addEventListener('mousemove', onActivity, { passive: true });
        window.addEventListener('keydown', onActivity, { passive: true });
        window.addEventListener('click', onActivity, { passive: true });

        // 4. Connect to Supabase Realtime Channel
        try {
            if (!this.channel) {
                this.channel = supabase.channel('diiczone-presence-room', {
                    config: { presence: { key: (member.email || '').toLowerCase().trim() } }
                });

                this.channel
                    .on('presence', { event: 'sync' }, () => {
                        const state = this.channel.presenceState();
                        this.updateOnlineMap(state);
                    })
                    .on('presence', { event: 'join' }, ({ newPresences }) => {
                        this.handlePresenceJoin(newPresences);
                    })
                    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                        this.handlePresenceLeave(leftPresences);
                    })
                    .subscribe(async (status) => {
                        if (status === 'SUBSCRIBED') {
                            await this.channel.track({
                                email: (member.email || '').toLowerCase().trim(),
                                name: member.name || '',
                                role: member.role || '',
                                online_at: new Date().toISOString()
                            });
                        }
                    });
            } else {
                this.channel.track({
                    email: (member.email || '').toLowerCase().trim(),
                    name: member.name || '',
                    role: member.role || '',
                    online_at: new Date().toISOString()
                });
            }
        } catch (err) {
            console.warn('[Presence] Realtime tracking notice:', err);
        }
    }

    /**
     * Stop heartbeat & leave presence channel
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        if (this.channel) {
            try {
                this.channel.untrack();
            } catch (e) { /* ignore */ }
        }
    }

    /**
     * Send heartbeat timestamp to team and profiles in Supabase
     */
    async sendDbHeartbeat(email) {
        if (!email) return;
        const normalized = email.toLowerCase().trim();
        const nowIso = new Date().toISOString();

        try {
            // Update team table
            await supabase
                .from('team')
                .update({ last_seen_at: nowIso })
                .ilike('email', normalized);

            // Update profiles table
            await supabase
                .from('profiles')
                .update({ last_seen_at: nowIso })
                .ilike('email', normalized);
        } catch (e) {
            // Non-critical background failure
            console.debug('[Presence] Heartbeat update error:', e);
        }
    }

    /**
     * Subscribe to presence updates (e.g. from HQ team dashboard)
     */
    subscribe(callback) {
        this.presenceListeners.add(callback);

        // If not already connected, connect to channel as observer
        if (!this.channel) {
            try {
                this.channel = supabase.channel('diiczone-presence-room');
                this.channel
                    .on('presence', { event: 'sync' }, () => {
                        const state = this.channel.presenceState();
                        this.updateOnlineMap(state);
                    })
                    .subscribe();
            } catch (e) {
                console.warn('[Presence] Channel subscribe error:', e);
            }
        }

        // Emit current online users immediately
        callback(new Set(this.onlineUsers.keys()));

        return () => {
            this.presenceListeners.delete(callback);
        };
    }

    updateOnlineMap(state) {
        this.onlineUsers.clear();
        Object.keys(state).forEach((key) => {
            const presences = state[key];
            if (Array.isArray(presences) && presences.length > 0) {
                const presence = presences[0];
                const email = (presence.email || key).toLowerCase().trim();
                if (email) {
                    this.onlineUsers.set(email, presence);
                }
            }
        });
        this.notifyListeners();
    }

    handlePresenceJoin(presences) {
        (presences || []).forEach(p => {
            const email = (p.email || '').toLowerCase().trim();
            if (email) this.onlineUsers.set(email, p);
        });
        this.notifyListeners();
    }

    handlePresenceLeave(presences) {
        (presences || []).forEach(p => {
            const email = (p.email || '').toLowerCase().trim();
            if (email) this.onlineUsers.delete(email);
        });
        this.notifyListeners();
    }

    notifyListeners() {
        const emailsSet = new Set(this.onlineUsers.keys());
        this.presenceListeners.forEach(cb => {
            try { cb(emailsSet); } catch (e) { console.error(e); }
        });
    }

    /**
     * Core Rule: Compute Talent Live Status
     * 1. 🔴 ROJO: Si no está activo aún (sala de espera, pendiente, inactivo)
     * 2. 🟢 VERDE: Si está activo Y está dentro de la app trabajando (en tiempo real o last_seen_at < 3 min)
     * 3. 🟡 AMARILLO: Si está aprobado/activo pero NO está conectado en la app en este momento (offline)
     */
    computeStatus(member, onlineEmailsSet = new Set()) {
        if (!member) {
            return {
                status: 'unapproved',
                color: 'red',
                label: 'No Activo',
                badgeText: 'NO ACTIVO',
                dotClass: 'bg-rose-500 shadow-[0_0_12px_#f43f5e]',
                pingClass: 'bg-rose-400',
                borderClass: 'border-rose-500/30'
            };
        }

        const isPendingApproval = member.approval_status === 'pending_approval' || 
                                  (member.status || '').toLowerCase() === 'pending' || 
                                  (member.status || '').toLowerCase() === 'inactive';

        // 1. 🔴 ROJO: No activo / Sala de espera / Pendiente
        if (isPendingApproval) {
            return {
                status: 'unapproved',
                color: 'red',
                label: 'No Activo (Sala de Espera)',
                badgeText: 'SALA DE ESPERA',
                dotClass: 'bg-rose-500 shadow-[0_0_14px_#f43f5e] animate-pulse',
                pingClass: 'bg-rose-400 animate-ping',
                borderClass: 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
            };
        }

        // Check if currently online (in Realtime Channel or last_seen_at < 3 minutes)
        const email = (member.email || '').toLowerCase().trim();
        let isRealtimeOnline = onlineEmailsSet.has(email);

        if (!isRealtimeOnline && member.last_seen_at) {
            const diffMs = Date.now() - new Date(member.last_seen_at).getTime();
            if (diffMs < 3 * 60 * 1000) { // < 3 minutes
                isRealtimeOnline = true;
            }
        }

        // 2. 🟢 VERDE: Conectado dentro de la app trabajando
        if (isRealtimeOnline) {
            return {
                status: 'online',
                color: 'green',
                label: 'En Línea (Trabajando)',
                badgeText: 'EN LÍNEA',
                dotClass: 'bg-emerald-500 shadow-[0_0_14px_#10b981] animate-pulse',
                pingClass: 'bg-emerald-400 animate-ping',
                borderClass: 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
            };
        }

        // 3. 🟡 AMARILLO: Miembro activo pero desconectado / fuera de la app
        return {
            status: 'offline',
            color: 'yellow',
            label: 'Desconectado (Offline)',
            badgeText: 'OFFLINE',
            dotClass: 'bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-pulse',
            pingClass: 'bg-amber-300 opacity-60',
            borderClass: 'border-amber-400/20'
        };
    }
}

export const presenceService = new PresenceService();
