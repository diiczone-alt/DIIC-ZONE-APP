'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Briefcase, X, Layers, ArrowUpRight, Maximize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Local dictionary of known addresses to load exact positions instantly
const PRECODED_ADDRESSES = {
    'CARDENAL DE LA TORRE': [-0.2721, -78.5392], // Santiago's exact home address in Quito
    'SANTO DOMINGO ': [-0.2520, -79.1730], // Daniel's address
    'CIUDAD: SANTO DOMINGO': [-0.2520, -79.1730], // Usuario Google's address
};

// Fallback City Centers
const CITY_COORDS = {
    'QUITO': [-0.1820, -78.4680],
    'GUAYAQUIL': [-2.1710, -79.9224],
    'SANTO DOMINGO': [-0.2520, -79.1730],
    'SANTO DOMINGO ': [-0.2520, -79.1730],
    'MANTA': [-0.9680, -80.7090],
    'CUENCA': [-2.9001, -79.0059],
    'LOJA': [-3.9931, -79.2042],
    'AMBATO': [-1.2491, -78.6168],
    'PORTOVIEJO': [-1.0546, -80.4544],
    'MACHALA': [-3.2581, -79.9553],
    'IBARRA': [0.3517, -78.1222],
    'RIOBAMBA': [-1.6731, -78.6483],
    'ESMERALDAS': [0.9682, -79.6517],
    'QUEVEDO': [-1.0286, -79.4635],
    'LATACUNGA': [-0.9316, -78.6058],
    'TULCAN': [0.8119, -77.7176],
    'TENA': [-0.9938, -77.8129],
    'PUYO': [-1.4821, -77.9991],
    'MACAS': [-2.3087, -78.1114],
    'ZAMORA': [-4.0692, -78.9567],
    'LAGO AGRIO': [0.0847, -76.8828],
    'NUEVA LOJA': [0.0847, -76.8828],
    'COCA': [-0.4667, -76.9833],
    'GUARANDA': [-1.5905, -79.0025],
    'BABAHOYO': [-1.8022, -79.5344],
    'SALINAS': [-2.2170, -80.9585],
    'SANTA ELENA': [-2.2268, -80.8584],
    'OTAVALO': [0.2295, -78.2625],
    'SANGOLQUI': [-0.3306, -78.4398],
    'DAULE': [-1.8622, -79.9790],
    'CHONE': [-0.6981, -80.0936],
    'MILAGRO': [-2.1286, -79.5914],
    'PASAJE': [-3.3255, -79.8066],
    'SANTA ROSA': [-3.4478, -79.9599],
    'LA LIBERTAD': [-2.2310, -80.9117]
};

export default function AdminOperationalMap({ clients = [], team = [] }) {
    const router = useRouter();
    const [filter, setFilter] = useState('both');
    const [selectedPoint, setSelectedPoint] = useState(null);
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const markersGroupRef = useRef(null);
    const connectionsGroupRef = useRef(null);

    // Geocoded coordinates state (caches Nominatim lookups)
    const [geocodedCoords, setGeocodedCoords] = useState({});

    const cityWorkload = useMemo(() => {
        const counts = {};
        team.forEach(m => {
            counts[m.city] = (counts[m.city] || 0) + (m.activeTasks || 0);
        });
        return counts;
    }, [team]);

    // Helper to get coordinates of a node (prioritizes manual coords, then geocoded street address, no fallbacks)
    const getCoords = (p) => {
        if (p.coords && Array.isArray(p.coords) && p.coords.length === 2) {
            return p.coords;
        }
        if (geocodedCoords[p.id]) {
            return geocodedCoords[p.id];
        }
        return null; // Return null if no real coordinates exist (do not simulate/fake)
    };

    const missingCoords = useMemo(() => {
        const list = [];
        clients.forEach(c => {
            const hasRealCoords = (c.coords && Array.isArray(c.coords) && c.coords.length === 2) || geocodedCoords[c.id];
            if (!hasRealCoords) {
                list.push({ id: c.id, name: c.name, type: 'socio' });
            }
        });
        team.forEach(t => {
            const hasRealCoords = (t.coords && Array.isArray(t.coords) && t.coords.length === 2) || geocodedCoords[t.id];
            if (!hasRealCoords) {
                list.push({ id: t.id, name: t.name, type: 'nodo' });
            }
        });
        return list;
    }, [clients, team, geocodedCoords]);

    const filteredPoints = useMemo(() => {
        let points = [];
        if (filter === 'clients' || filter === 'both') {
            points = [...points, ...clients.map(c => ({ ...c, pointType: 'client' }))];
        }
        if (filter === 'team' || filter === 'both') {
            points = [...points, ...team.map(t => ({ ...t, pointType: 'team' }))];
        }
        return points.filter(p => {
            const coords = getCoords(p);
            return coords && Array.isArray(coords) && coords.length === 2;
        });
    }, [filter, clients, team, geocodedCoords]);

    // Grouping by raw coordinates and applying 0.003 degree offset to duplicates
    const pointsWithCoords = useMemo(() => {
        const groups = {};
        filteredPoints.forEach(p => {
            const rawCoords = getCoords(p);
            if (!rawCoords || rawCoords.length < 2) return;
            const key = `${rawCoords[0].toFixed(5)},${rawCoords[1].toFixed(5)}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(p);
        });

        const list = [];
        Object.entries(groups).forEach(([key, groupPoints]) => {
            const [rawLat, rawLng] = key.split(',').map(Number);
            if (groupPoints.length === 1) {
                list.push({
                    ...groupPoints[0],
                    mapCoords: [rawLat, rawLng]
                });
            } else {
                groupPoints.forEach((p, idx) => {
                    const angle = (idx * 2 * Math.PI) / groupPoints.length;
                    const offsetLat = rawLat + 0.018 * Math.sin(angle);
                    const offsetLng = rawLng + 0.018 * Math.cos(angle);
                    list.push({
                        ...p,
                        mapCoords: [offsetLat, offsetLng]
                    });
                });
            }
        });
        return list;
    }, [filteredPoints, geocodedCoords]);

    // Operational connections: Connect clients to their assigned CM/Editor/Filmmaker using pointsWithCoords coordinates
    const operationalConnections = useMemo(() => {
        const list = [];
        if (filter !== 'both') return [];

        clients.forEach(client => {
            const clientPt = pointsWithCoords.find(pt => pt.id === client.id && pt.pointType === 'client');
            if (!clientPt) return;
            const clientCoords = clientPt.mapCoords;

            const normalize = (n) => (n || '').toLowerCase().trim();

            const assignments = [
                { name: client.cm, roleType: 'CM' },
                { name: client.editor, roleType: 'Editor' },
                { name: client.filmmaker, roleType: 'Filmmaker' }
            ];

            assignments.forEach(assign => {
                if (!assign.name || normalize(assign.name) === 'sin asignar') return;

                // Find team member with matching name in pointsWithCoords
                const memberPt = pointsWithCoords.find(pt => pt.pointType === 'team' && normalize(pt.name) === normalize(assign.name));
                if (memberPt) {
                    const memberCoords = memberPt.mapCoords;
                    list.push({
                        from: clientCoords,
                        to: memberCoords,
                        clientName: client.name,
                        memberName: memberPt.name,
                        role: assign.roleType
                    });
                }
            });
        });

        return list;
    }, [clients, team, filter, pointsWithCoords]);

    // Async Geocoding Effect (OpenStreetMap Nominatim lookup for street-level addresses)
    useEffect(() => {
        const performGeocoding = async () => {
            const coordsCache = { ...geocodedCoords };
            let updated = false;

            const allPoints = [...clients, ...team];
            
            for (const p of allPoints) {
                const key = p.id;
                if (coordsCache[key]) continue;

                const addressStr = (p.address || '').trim();
                const cityStr = (p.city || '').trim();

                // If no specific address details are provided, default to city center
                if (!addressStr || addressStr.toUpperCase() === cityStr.toUpperCase()) {
                    continue;
                }

                // Check in local precoded dictionary first (instant load)
                const normalizedAddress = addressStr.toUpperCase();
                if (PRECODED_ADDRESSES[normalizedAddress]) {
                    coordsCache[key] = PRECODED_ADDRESSES[normalizedAddress];
                    updated = true;
                    continue;
                }

                // Query OpenStreetMap Nominatim with a 1 second delay to respect rate limit policy
                await new Promise(resolve => setTimeout(resolve, 1000));
                try {
                    const query = `${addressStr}, ${cityStr || ''}, Ecuador`.trim();
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
                    const data = await response.json();
                    if (data && data.length > 0) {
                        coordsCache[key] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                        updated = true;
                    }
                } catch (e) {
                    console.error("Geocoding failed for:", addressStr, e);
                }
            }

            if (updated) {
                setGeocodedCoords(coordsCache);
            }
        };

        performGeocoding();
    }, [clients, team]);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
            center: [-1.8312, -78.1834], // Center of Ecuador
            zoom: 7,
            zoomControl: false,
            scrollWheelZoom: true,
            attributionControl: true
        });

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

        setMapInstance(map);

        // Invalidate size after 300ms to correct any display issues due to layout/rendering timing
        const sizeTimeout = setTimeout(() => {
            map.invalidateSize();
        }, 300);

        return () => {
            clearTimeout(sizeTimeout);
            map.remove();
            setMapInstance(null);
        };
    }, []);

    // Update Markers & Connections
    useEffect(() => {
        const map = mapInstance;
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
        pointsWithCoords.forEach((p, idx) => {
            const coords = p.mapCoords;
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
        if (pointsWithCoords.length > 0) {
            const bounds = L.latLngBounds(pointsWithCoords.map(p => p.mapCoords));
            map.fitBounds(bounds, { padding: [80, 80], maxZoom: 10 });
        }
    }, [mapInstance, pointsWithCoords, operationalConnections, cityWorkload]);

    // Handle "Recentrar" button
    const handleRecenter = () => {
        const map = mapInstance;
        if (!map) return;

        if (pointsWithCoords.length > 0) {
            const bounds = L.latLngBounds(pointsWithCoords.map(p => p.mapCoords));
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
        <div ref={containerRef} className="relative bg-[#050511] border border-white/5 rounded-[40px] overflow-hidden min-h-[600px] w-full group/map shadow-2xl">
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

            {/* Satellite Stats (Saturation) & Missing Locations Notification */}
            <div className="absolute top-10 right-10 z-20 space-y-4 w-72">
                <div className="bg-[#0A0A1F]/80 backdrop-blur-md border border-white/5 p-4 rounded-2xl text-right shadow-lg">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Carga Global</div>
                    <div className="text-2xl font-black text-white italic">
                        {Object.values(cityWorkload).reduce((a, b) => a + b, 0)} <span className="text-[10px] opacity-40">TASKS</span>
                    </div>
                </div>

                {missingCoords.length > 0 && (
                    <div className="bg-[#0A0A1F]/90 backdrop-blur-md border border-red-500/10 p-4 rounded-[2rem] shadow-lg space-y-2 max-h-[300px] overflow-y-auto">
                        <div className="flex items-center gap-2 text-red-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <div className="text-[9px] font-black uppercase tracking-wider">Sin ubicación ({missingCoords.length})</div>
                        </div>
                        <div className="space-y-1.5 text-left">
                            {missingCoords.map(item => (
                                <div key={item.id} className="text-[9px] font-bold text-gray-400 flex justify-between border-b border-white/5 pb-1">
                                    <span className="truncate max-w-[150px]">{item.name}</span>
                                    <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase ${item.type === 'socio' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {item.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Overlay - Transparent glassmorphism, draggable and optimized vertical space */}
            <AnimatePresence>
                {selectedPoint && (
                    <motion.div 
                        drag
                        dragConstraints={containerRef}
                        dragElastic={0.1}
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="absolute right-10 top-10 w-80 bg-[#0A0A1F]/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 z-30 flex flex-col shadow-2xl cursor-default select-none overflow-hidden"
                        style={{ touchAction: 'none' }}
                    >
                        {/* Draggable handle bar */}
                        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing flex-shrink-0" />
                        
                        <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${selectedPoint.pointType === 'client' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {selectedPoint.pointType === 'client' ? <Briefcase className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                            </div>
                            <button onClick={() => setSelectedPoint(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-xl font-black text-white italic tracking-tighter mb-0.5">{selectedPoint.name}</h3>
                            <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-indigo-400" /> {selectedPoint.city}
                            </p>
                            
                            {/* Display real exact address in detail panel */}
                            {selectedPoint.address && (
                                <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider mb-4 leading-relaxed bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                                    <span className="text-indigo-400">Dir:</span> {selectedPoint.address}
                                </p>
                            )}

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Sector / Rol</span>
                                    <span className="text-xs font-bold text-white">{selectedPoint.type || selectedPoint.role}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Estado</span>
                                    <span className={`text-xs font-bold ${selectedPoint.pointType === 'client' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                        {(selectedPoint.status || selectedPoint.availability || '').toUpperCase()}
                                    </span>
                                </div>
                                {selectedPoint.pointType === 'team' && (
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Carga Local</span>
                                        <span className={`text-xs font-black ${cityWorkload[selectedPoint.city] > 8 ? 'text-red-500' : 'text-blue-400'}`}>
                                            {cityWorkload[selectedPoint.city]} Tasks
                                        </span>
                                    </div>
                                )}
                                {selectedPoint.pointType === 'client' && (
                                    <>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Plan Contratado</span>
                                            <span className="text-xs font-bold text-indigo-400">{selectedPoint.plan || 'General'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Encargado CM</span>
                                            <span className="text-xs font-bold text-white">{selectedPoint.cm || 'Sin asignar'}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={handleViewProfile}
                            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg"
                        >
                            Ver Perfil Estratégico <ArrowUpRight className="w-3.5 h-3.5" />
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
