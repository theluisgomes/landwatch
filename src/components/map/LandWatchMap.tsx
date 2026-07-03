import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PropertyData, STATUS_COLORS, BRAZIL_CENTER, BRAZIL_ZOOM, MOCK_PROPERTIES } from '../../lib/mockData';
import { openAnalysis, useStore } from '../../lib/store';

interface LandWatchMapProps {
  onPropertyClick?: (property: PropertyData) => void;
}

export function LandWatchMap({ onPropertyClick }: LandWatchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<(L.Layer)[]>([]);
  const { selectedYear, selectedProperty } = useStore();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapRef.current, {
      center: BRAZIL_CENTER,
      zoom: BRAZIL_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    // Satellite tile layer (ESRI World Imagery - free, no API key)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '© ESRI',
      }
    ).addTo(map);

    // Labels overlay
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, opacity: 0.7 }
    ).addTo(map);

    // Custom zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution
    L.control.attribution({
      position: 'bottomleft',
      prefix: '© ESRI | AlphaEarth Foundations — Google DeepMind (CC-BY 4.0)',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Draw initial properties
    renderProperties(map, selectedYear, null);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersRef.current = [];
      }
    };
  }, []);

  // Re-render properties when year or selection changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    // Clear existing layers
    layersRef.current.forEach(layer => {
      if (mapInstanceRef.current) mapInstanceRef.current.removeLayer(layer);
    });
    layersRef.current = [];
    renderProperties(mapInstanceRef.current, selectedYear, selectedProperty?.id ?? null);
  }, [selectedYear, selectedProperty]);

  const renderProperties = (map: L.Map, year: number, selectedId: string | null) => {
    const newLayers: L.Layer[] = [];

    MOCK_PROPERTIES.forEach(property => {
      const yearData = property.scores.find(s => s.year === year) || property.scores[property.scores.length - 1];
      const score = yearData?.score ?? property.current_score;

      // Calculate status for selected year
      let status = property.status;
      if (score >= 70) status = 'productive';
      else if (score >= 50) status = 'declining';
      else if (score >= 35) status = 'recovering';
      else status = 'degraded';

      const colors = STATUS_COLORS[status];
      const isSelected = selectedId === property.id;

      // Create polygon
      const latlngs = property.polygon.map(([lat, lng]) => [lat, lng] as L.LatLngExpression);

      const polygon = L.polygon(latlngs, {
        color: colors.stroke,
        weight: isSelected ? 3.5 : 2,
        fillColor: colors.fill,
        fillOpacity: isSelected ? 0.65 : 0.35,
        dashArray: isSelected ? undefined : '5 5',
      });

      // Tooltip
      polygon.bindTooltip(
        `<div style="font-family: Inter, sans-serif;">
          <strong style="color: white; font-size: 12px;">${property.name}</strong><br/>
          <span style="color: ${colors.stroke}; font-weight: 600; font-size: 14px;">Score ${year}: ${score}</span><br/>
          <span style="color: rgba(180,220,200,0.7); font-size: 11px;">${property.area_ha.toLocaleString('pt-BR')} ha · ${property.municipality}, ${property.state}</span>
        </div>`,
        { sticky: true, direction: 'top', opacity: 1 }
      );

      // Click handler
      polygon.on('click', () => {
        openAnalysis(property);
        if (onPropertyClick) onPropertyClick(property);
        // Fly to property
        const bounds = L.latLngBounds(latlngs);
        map.flyToBounds(bounds, { padding: [80, 80], duration: 0.8 });
      });

      polygon.addTo(map);
      newLayers.push(polygon);

      // Score label
      const center = L.latLngBounds(latlngs).getCenter();
      const scoreLabel = L.divIcon({
        className: '',
        html: `<div style="
          background: rgba(10,26,15,0.9);
          border: 1.5px solid ${colors.stroke};
          border-radius: 5px;
          padding: 2px 7px;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: ${colors.stroke};
          white-space: nowrap;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        ">${score}</div>`,
        iconSize: [36, 22],
        iconAnchor: [18, 11],
      });

      const marker = L.marker(center, { icon: scoreLabel, interactive: false, zIndexOffset: 100 });
      marker.addTo(map);
      newLayers.push(marker);
    });

    layersRef.current = newLayers;
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Year indicator overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] glass rounded-full px-4 py-1.5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-mono text-forest-200">
          AlphaEarth · {selectedYear} · 10m/px
        </span>
      </div>
    </div>
  );
}
