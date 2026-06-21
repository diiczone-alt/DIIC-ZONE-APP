'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Briefcase, X, Layers, ArrowUpRight, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function AdminOperationalMap({ clients = [], team = [] }) {
    const router = useRouter();
    const [filter, setFilter] = useState('both');
    const [selectedPoint, setSelectedPoint] = useState(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersGroupRef = useRef(null);
    const connectionsGroupRef = useRef(null);

    const cityWorkload = useMemo(() => {
        const counts = {};
        team.forEach(m => {
            counts[m.city] = (counts[m.city] || 0) + (m.activeTasks || 0);
        });
        return counts;
    }, [team]);

    const filteredPoints = useMemo(() => {
        let points = [];
        if (filter === 'clients' || filter === 'both') {
            points = [...points, ...clients.map(c => ({ ...c, pointType: 'client' }))];
        }
        if (filter === 'team' || filter === 'both') {
            points = [...points, ...team.map(t => ({ ...t, pointType: 'team' }))];
        }
        return points.filter(p => p.coords && Array.isArray(p.coords) && p.coords.length === 2);
    }, [filter, clients, team]);

    // Operational connections: Connect clients to their assigned CM/Editor/Filmmaker
    const operationalConnections = useMemo(() => {
        const list = [];
        // Only draw connections in 'both' (Vista Estratégica) mode
        if (filter !== 'both') return [];

        clients.forEach(client => {
            const clientCoords = client.coords;
            if (!clientCoords || !Array.isArray(clientCoords) || clientCoords.length < 2) return;

            const normalize = (n) => (n || '').toLowerCase().trim();

            // Assigned names for CM, Editor, Filmmaker
            const assignments = [
                { name: client.cm, roleType: 'CM' },
                { name: client.editor, roleType: 'Editor' },
                { name: client.filmmaker, roleType: 'Filmmaker' }
            ];

            assignments.forEach(assign => {
                if (!assign.name || normalize(assign.name) === 'sin asignar') return;

                // Find team member with matching name
                const member = team.find(t => normalize(t.name) === normalize(assign.name));
                if (member && member.coords && Array.isArray(member.coords) && member.coords.length === 2) {
                    list.push({
                        from: clientCoords,
                        to: member.coords,
                        clientName: client.name,
                        memberName: member.name,
                        role: assign.roleType
                    });
                }
            });
        });

        return list;
    }, [clients, team, filter]);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapRef.current) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
        }

        const map = L.map(mapRef.current, {
            center: [-1.8312, -78.1834], // Center of Ecuador
            zoom: 7,
            zoomControl: false,
            scrollWheelZoom: false,
            attributionControl: true
        });

        mapInstanceRef.current = map;

        // Load CartoDB Dark Matter tile layer (Perfect dark theme for dashboards)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        L.control.zoom({
            position: 'bottomleft'
        }).addTo(map);

        // Layer group for connections (lines)
        const connectionsGroup = L.layerGroup().addTo(map);
        connectionsGroupRef.current = connectionsGroup;

        // Layer group for markers (dots)
        const markersGroup = L.layerGroup().addTo(map);
        markersGroupRef.current = markersGroup;

        // Set initial bounds to fit Ecuador's coordinates
        map.fitBounds([
            [-5.012, -81.25], // South-West
            [1.45, -75.12]    // North-East
        ]);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update Markers & Connections
    useEffect(() => {
        const map = mapInstanceRef.current;
        const markersGroup = markersGroupRef.current;
        const connectionsGroup = connectionsGroupRef.current;
        if (!map || !markersGroup || !connectionsGroup) return;

        markersGroup.clearLayers();
        connectionsGroup.clearLayers();

        // 1. Draw Operational Connections (Polylines)
        operationalConnections.forEach((conn) => {
            const polyline = L.polyline([conn.from, conn.to], {
                color: conn.role === 'CM' ? '#6366f1' : (conn.role === 'Editor' ? '#3b82f6' : '#ec4899'),
                weight: 1.5,
                opacity: 0.35,
                dashArray: '4, 6',
                className: 'connection-line'
            });

            // Tooltip showing relationship
            polyline.bindTooltip(
                `<div class="text-[8px] font-black tracking-widest text-indigo-300 uppercase">
                    ${conn.clientName.split(' ')[0]} ➔ ${conn.memberName.split(' ')[0]} (${conn.role})
                </div>`,
                {
                    sticky: true,
                    className: 'connection-tooltip border border-white/10 rounded-xl bg-[#050511]/90 shadow-2xl p-2'
                }
            );

            polyline.addTo(connectionsGroup);
        });

        // 2. Draw Nodes (Markers)
        filteredPoints.forEach((p, idx) => {
            const coords = p.coords;
            const isClient = p.pointType === 'client';
            const cityName = p.city || 'Desconocido';
            const cityLoad = cityWorkload[cityName] || 0;
            const isSaturated = cityLoad > 8;

            // Dot colors: green for clients, blue for normal nodes, red for saturated nodes
            let dotColorClass = 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]';
            let pingColorClass = 'bg-emerald-500/30';
            if (!isClient) {
                dotColorClass = isSaturated ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]';
                pingColorClass = isSaturated ? 'bg-red-500/30' : 'bg-blue-500/30';
            }

            const iconHtml = `
                <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 group-marker">
                    <div class="absolute w-6 h-6 rounded-full ${pingColorClass} animate-ping opacity-60"></div>
                    <div class="w-3.5 h-3.5 rounded-full ${dotColorClass} border border-white shadow-xl transition-all duration-300 hover:scale-125"></div>
                    <div class="marker-label absolute -top-8 px-2 py-0.5 bg-[#0A0A1F]/90 border border-white/10 rounded-md text-[8px] font-black text-white uppercase tracking-wider whitespace-nowrap opacity-0 scale-95 origin-bottom pointer-events-none transition-all duration-200 shadow-2xl">
                        ${p.name.toUpperCase()} (${cityName.toUpperCase()})
                    </div>
                </div>
            `;

            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'custom-leaflet-marker',
                iconSize: [32, 32],
                iconAnchor: [0, 0]
            });

            const marker = L.marker([coords[0], coords[1]], { icon: customIcon });

            // Interactive flyTo + select on click
            marker.on('click', () => {
                setSelectedPoint(p);
                map.flyTo([coords[0], coords[1]], 12, {
                    animate: true,
                    duration: 1.2
                });
            });

            marker.addTo(markersGroup);
        });

        // Fit bounds to show all active markers with some padding if we have markers
        if (filteredPoints.length > 0) {
            const bounds = L.latLngBounds(filteredPoints.map(p => p.coords));
            map.fitBounds(bounds, { padding: [80, 80], maxZoom: 10 });
        }
    }, [filteredPoints, operationalConnections, cityWorkload]);

    // Handle "Recentrar" button
    const handleRecenter = () => {
        const map = mapInstanceRef.current;
        if (!map) return;

        if (filteredPoints.length > 0) {
            const bounds = L.latLngBounds(filteredPoints.map(p => p.coords));
            map.fitBounds(bounds, { padding: [80, 80] });
        } else {
            map.setView([-1.8312, -78.1834], 7);
        }
    };

    // Handle profile redirection button
    const handleViewProfile = () => {
        if (!selectedPoint) return;
        if (selectedPoint.pointType === 'client') {
            router.push('/dashboard/hq/clients');
        } else {
            router.push('/dashboard/hq/team');
        }
    };

    return (
        <div className="relative bg-[#050511] border border-white/5 rounded-[40px] overflow-hidden min-h-[600px] w-full group/map shadow-2xl">
            {/* Styles Injection */}
            <style dangerouslySetInnerHTML={{__html: `
                .custom-leaflet-marker {
                    background: transparent !important;
                    border: none !important;
                }
                .custom-leaflet-marker:hover .marker-label {
                    opacity: 1;
                    transform: scale(1) translateY(-2px);
                }
                .leaflet-bar {
                    border: 1px solid rgba(255, 255, 255, 0.05) !important;
                    border-radius: 16px !important;
                    overflow: hidden;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5) !important;
                    backdrop-filter: blur(8px);
                    background: rgba(10, 10, 31, 0.8) !important;
                }
                .leaflet-bar a {
                    background-color: transparent !important;
                    color: #a5b4fc !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                    font-weight: bold;
                    transition: all 0.2s;
                }
                .leaflet-bar a:hover {
                    background-color: #6366f1 !important;
                    color: white !important;
                }
                .leaflet-control-attribution {
                    background: rgba(5, 5, 17, 0.8) !important;
                    color: #64748b !important;
                    font-size: 8px !important;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    border-top-left-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05) !important;
                    border-bottom: none !important;
                    border-right: none !important;
                }
                .leaflet-control-attribution a {
                    color: #818cf8 !important;
                }
                .connection-line {
                    transition: stroke 0.3s, stroke-width 0.3s, opacity 0.3s;
                    cursor: pointer;
                }
                .connection-line:hover {
                    stroke-width: 3.5px !important;
                    stroke: #10b981 !important; /* Glow green when hovering connection */
                    opacity: 0.85 !important;
                }
                .connection-tooltip {
                    background: rgba(10, 10, 31, 0.95) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
                    border-radius: 8px !important;
                }
                .leaflet-tooltip-left:before, .leaflet-tooltip-right:before {
                    border: none !important;
                }
            `}} />

            {/* Map Container */}
            <div className="absolute inset-0 w-full h-full z-0">
                <div ref={mapRef} className="w-full h-full" />
            </div>

            {/* Noise and Gradient overlay for tech look (pointer-events-none is crucial!) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/noise.svg')] z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050511]/30 via-transparent to-transparent pointer-events-none z-10" />

            {/* Filter & Control Controls */}
            <div className="absolute top-10 left-10 z-20 flex flex-col gap-3">
                <button 
                    onClick={() => setFilter('both')}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3 backdrop-blur-xl shadow-lg ${filter === 'both' ? 'bg-indigo-500/90 text-white border-indigo-400' : 'bg-[#0A0A1F]/70 text-gray-400 border-white/5 hover:bg-[#0A0A1F]/90'}`}
                >
                    <Layers className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Vista Estratégica</span>
                </button>
                <div className="h-2" />
                <button 
                    onClick={() => setFilter('clients')}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3 backdrop-blur-xl shadow-lg ${filter === 'clients' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-[#0A0A1F]/70 text-gray-400 border-white/5 hover:bg-[#0A0A1F]/90'}`}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> <span className="text-[10px] font-black uppercase tracking-widest">Socios ({clients.length})</span>
                </button>
                <button 
                    onClick={() => setFilter('team')}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-3 backdrop-blur-xl shadow-lg ${filter === 'team' ? 'bg-blue-500/90 text-white border-blue-400' : 'bg-[#0A0A1F]/70 text-gray-400 border-white/5 hover:bg-[#0A0A1F]/90'}`}
                >
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> <span className="text-[10px] font-black uppercase tracking-widest">Nodos ({team.length})</span>
                </button>
                <div className="h-2" />
                <button 
                    onClick={handleRecenter}
                    className="p-4 rounded-2xl border bg-[#0A0A1F]/70 text-gray-400 border-white/5 hover:bg-[#0A0A1F]/90 transition-all flex items-center gap-3 backdrop-blur-xl shadow-lg"
                >
                    <Maximize2 className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Recentrar Mapa</span>
                </button>
            </div>

            {/* Satellite Stats (Saturation) */}
            <div className="absolute top-10 right-10 z-20 space-y-4">
                <div className="bg-[#0A0A1F]/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-right shadow-lg">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Carga Global</div>
                    <div className="text-2xl font-black text-white italic">
                        {Object.values(cityWorkload).reduce((a, b) => a + b, 0)} <span className="text-[10px] opacity-40">TASKS</span>
                    </div>
                </div>
            </div>

            {/* Detail Overlay */}
            <AnimatePresence>
                {selectedPoint && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="absolute right-10 top-10 bottom-10 w-80 bg-[#0A0A1F]/95 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 z-30 flex flex-col shadow-2xl"
                    >
                        <button onClick={() => setSelectedPoint(null)} className="self-end p-2 hover:bg-white/5 rounded-full">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="mt-6 flex-1">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${selectedPoint.pointType === 'client' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {selectedPoint.pointType === 'client' ? <Briefcase className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                            </div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1">{selectedPoint.name}</h3>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-indigo-500" /> {selectedPoint.city}
                            </p>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Sector</span>
                                    <span className="text-sm font-bold text-white">{selectedPoint.type || selectedPoint.role}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Estado</span>
                                    <span className={`text-sm font-bold ${selectedPoint.pointType === 'client' ? 'text-emerald-500' : 'text-blue-400'}`}>
                                        {selectedPoint.status || selectedPoint.availability}
                                    </span>
                                </div>
                                {selectedPoint.pointType === 'team' && (
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">Carga Local</span>
                                        <span className={`text-sm font-black ${cityWorkload[selectedPoint.city] > 8 ? 'text-red-500' : 'text-blue-400'}`}>
                                            {cityWorkload[selectedPoint.city]} Tasks
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={handleViewProfile}
                            className="mt-auto w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-750 transition-colors shadow-lg"
                        >
                            Ver Perfil Estratégico <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-6 left-10 pointer-events-none opacity-40 z-20">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">Global Network</div>
                <div className="text-xl font-black text-white italic tracking-tighter uppercase">DIIC ZONE HQ</div>
            </div>
        </div>
    );
}
