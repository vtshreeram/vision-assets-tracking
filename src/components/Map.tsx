'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Asset } from '@/lib/data';

function MapController({ assets }: { assets: Asset[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (assets.length > 0) {
      const bounds = assets.map(a => [a.lat, a.lng] as [number, number]);
      // Leaflet requires bounds if we want to fit them all, but simple fitBounds can error if invalid
      try {
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        // Fallback
      }
    }
  }, [assets, map]);

  return null;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'In Yard': return '#3b82f6'; // blue-500
    case 'In Transit': return '#f59e0b'; // amber-500
    case 'At Customer': return '#10b981'; // green-500
    case 'Delivered': return '#64748b'; // slate-500
    default: return '#ef4444'; // red-500
  }
};

interface MapProps {
  assets: Asset[];
  onMarkerClick?: (asset: Asset) => void;
}

export default function Map({ assets, onMarkerClick }: MapProps) {
  // Center roughly on KL (from original mock data)
  const center: [number, number] = [3.1390, 101.6869];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-card-border z-0 relative">
      <MapContainer 
        center={center} 
        zoom={10} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {assets.map((asset) => {
          const color = getStatusColor(asset.status);
          return (
            <CircleMarker
              key={asset.id}
              center={[asset.lat, asset.lng]}
              pathOptions={{ fillColor: color, color: color, fillOpacity: 0.7 }}
              radius={8}
              eventHandlers={{
                click: () => onMarkerClick?.(asset),
              }}
            >
              <Popup>
                <div>
                  <strong>{asset.id}</strong><br/>
                  {asset.make} {asset.model} ({asset.country})<br/>
                  Status: {asset.status}<br/>
                  Driver: {asset.current_driver || 'Unassigned'}<br/>
                  Devices: {asset.assigned_devices?.length || 0}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        <MapController assets={assets} />
      </MapContainer>
    </div>
  );
}
