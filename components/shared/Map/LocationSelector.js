import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

export default function LocationSelector({ value, onChange }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Default coordinate center (Ecuador center: Quito)
  const defaultCoords = [-0.1820, -78.4680];
  const activeCoords = value && value.length === 2 ? value : defaultCoords;

  useEffect(() => {
    if (!mapRef.current) return;

    // Fix for Leaflet default marker assets path
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Initialize Leaflet Map
    const map = L.map(mapRef.current, {
      center: activeCoords,
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Load CartoDB Dark Matter tile layer (matching DIIC ZONE design aesthetics)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Zoom control at bottomleft
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(map);

    // Custom marker div icon
    const customIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2">
          <div class="absolute w-7 h-7 rounded-full bg-indigo-500/40 animate-ping opacity-75"></div>
          <div class="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-xl shadow-indigo-500/50 transition-all hover:scale-125 duration-200"></div>
        </div>
      `,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [0, 0]
    });

    // Add marker
    const marker = L.marker(activeCoords, {
      icon: customIcon,
      draggable: true
    }).addTo(map);

    markerRef.current = marker;

    // Listen to drag events
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onChange([position.lat, position.lng]);
    });

    // Listen to map click events to place the pin
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange([lat, lng]);
    });

    // Clean up map on unmount
    return () => {
      map.remove();
    };
  }, []);

  // Update map marker when the value coordinates change from parent
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && value && value.length === 2) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== value[0] || currentPos.lng !== value[1]) {
        markerRef.current.setLatLng(value);
        mapInstanceRef.current.setView(value, 14, {
          animate: true,
          duration: 1
        });
      }
    }
  }, [value]);

  const handleGetCurrentLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización por GPS.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("No se pudo acceder a tu ubicación actual por GPS. Por favor, selecciona la ubicación manualmente en el mapa.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/5 bg-[#111126]">
        <div ref={mapRef} style={{ height: '200px' }} className="w-full relative z-0" />
        
        {/* GPS location overlay button */}
        <button
          onClick={handleGetCurrentLocation}
          className="absolute top-3 right-3 p-2 bg-[#0A0A1F]/90 border border-white/10 hover:border-indigo-500 rounded-xl text-indigo-400 hover:text-white transition-all shadow-lg active:scale-90 z-[1000] flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
          title="Usar mi ubicación GPS actual"
        >
          <Navigation className="w-3.5 h-3.5 fill-indigo-500/20" />
          <span>GPS</span>
        </button>
      </div>
      
      <div className="flex justify-between items-center text-[9px] font-black text-gray-500 tracking-wider px-1">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-indigo-400" />
          <span>UBICACIÓN SELECCIONADA</span>
        </div>
        <span className="font-mono text-gray-400">
          {value && value.length === 2 
            ? `${value[0].toFixed(5)}, ${value[1].toFixed(5)}` 
            : 'S/N (Se usará coordenadas por defecto)'}
        </span>
      </div>
    </div>
  );
}
