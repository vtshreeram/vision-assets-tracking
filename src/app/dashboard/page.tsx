'use client';

import { useState } from 'react';
import { mockData, Asset } from '@/lib/data';
import dynamic from 'next/dynamic';
import { Activity, X } from 'lucide-react';

// Dynamically import map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

function KPICard({ label, value, isAlert = false }: { label: string, value: string | number, isAlert?: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${isAlert ? 'border-destructive bg-destructive/5' : 'border-card-border bg-card'} shadow-sm text-center`}>
      <div className="text-3xl font-bold mb-1 text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { kpi_stats: stats, events, assets, devices, drivers, incidents } = mockData;
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const sortedEvents = [...events].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-card-border">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <KPICard label="Total Assets" value={stats.total_assets} />
        <KPICard label="In Yard" value={stats.in_yard} />
        <KPICard label="In Transit" value={stats.in_transit} />
        <KPICard label="At Customer" value={stats.at_customer} />
        <KPICard label="Delivered" value={stats.delivered} />
        <KPICard label="Critical Alerts" value={stats.critical_alerts} isAlert />
        <KPICard label="Devices Online" value={stats.devices_online} />
        <KPICard label="Devices Offline" value={stats.devices_offline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-card-border rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Asset Locations</h3>
          <Map assets={assets} onMarkerClick={setSelectedAsset} />
        </div>

        <div className="flex flex-col gap-6">
          {!selectedAsset ? (
            <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm flex-1">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity size={20} className="text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {sortedEvents.map((event, i) => (
                  <div key={i} className="pb-3 border-b border-card-border last:border-0 last:pb-0">
                    <div className="text-xs text-muted-foreground mb-1">
                      {new Date(event.time).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">{event.type}</span> - {event.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-card-border">
                <h3 className="text-lg font-semibold">Asset Details</h3>
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 hover:bg-secondary rounded-md transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-bold text-lg">{selectedAsset.make} {selectedAsset.model} ({selectedAsset.year})</h4>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Asset ID:</div>
                  <div className="font-medium text-right">{selectedAsset.id}</div>
                  
                  <div className="text-muted-foreground">Status:</div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedAsset.status}
                    </span>
                  </div>
                  
                  <div className="text-muted-foreground">Location:</div>
                  <div className="text-right">{selectedAsset.location}</div>
                  
                  <div className="text-muted-foreground">Driver:</div>
                  <div className="text-right">{selectedAsset.current_driver || 'Unassigned'}</div>
                </div>

                <div className="pt-3 mt-3 border-t border-card-border">
                  <h5 className="font-medium text-sm mb-2">Assigned Devices</h5>
                  {selectedAsset.assigned_devices.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedAsset.assigned_devices.map(dId => (
                        <span key={dId} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                          {dId}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No devices assigned</p>
                  )}
                </div>

                <div className="pt-4 flex gap-2">
                  <button className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white rounded-md text-sm font-medium transition-colors">
                    {selectedAsset.status === 'In Yard' ? 'Authorize Movement' : 'Track Live'}
                  </button>
                  <button className="flex-1 py-2 border border-card-border hover:bg-secondary rounded-md text-sm font-medium transition-colors">
                    Full Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
