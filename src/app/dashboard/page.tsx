'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Asset } from '@/lib/data';
import dynamic from 'next/dynamic';
import { Activity, X, Download } from 'lucide-react';
import clsx from 'clsx';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title 
} from 'chart.js';
import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title
);

// Dynamically import map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

function KPICard({ label, value, isAlert = false, onClick, isActive }: { label: string, value: string | number, isAlert?: boolean, onClick?: () => void, isActive?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        "p-4 rounded-lg border shadow-sm text-center transition-all duration-200 flex flex-col justify-center",
        onClick ? "cursor-pointer hover:shadow-md" : "",
        isAlert && !isActive ? "border-destructive bg-destructive/5 hover:bg-destructive/10 text-destructive" : "",
        !isAlert && !isActive ? "border-card-border bg-card hover:bg-secondary/50" : "",
        isActive ? "border-primary bg-primary/10 ring-1 ring-primary text-primary scale-[1.02]" : ""
      )}
    >
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { assets, devices, events, incidents, chartData } = useApp();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Calculate Operational KPIs dynamically
  const stats = useMemo(() => {
    return {
      total_assets: assets.length,
      in_yard: assets.filter(a => a.status === 'In Yard').length,
      in_transit: assets.filter(a => a.status === 'In Transit').length,
      at_customer: assets.filter(a => a.status === 'At Customer').length,
      delivered: assets.filter(a => a.status === 'Delivered').length,
      critical_alerts: incidents.filter(i => i.status === 'Open').length,
      devices_online: devices.filter(d => d.status === 'Online').length,
      devices_offline: devices.filter(d => d.status === 'Offline').length,
    };
  }, [assets, devices, incidents]);

  const sortedEvents = [...events].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  // Filter map assets based on active KPI filter
  const displayedAssets = useMemo(() => {
    if (!activeFilter) return assets;
    if (['In Yard', 'In Transit', 'At Customer', 'Delivered'].includes(activeFilter)) {
      return assets.filter(a => a.status === activeFilter);
    }
    return assets;
  }, [assets, activeFilter]);

  const toggleFilter = (filter: string) => {
    setActiveFilter(prev => prev === filter ? null : filter);
    setSelectedAsset(null); // Clear selection when filter changes
  };

  // --- Analytics Chart Data Prep ---
  const assetStatusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceHealthCounts = devices.reduce((acc, device) => {
    acc[device.health] = (acc[device.health] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = {
    labels: Object.keys(assetStatusCounts),
    datasets: [{
      data: Object.values(assetStatusCounts),
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#64748b', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const doughnutData = {
    labels: Object.keys(deviceHealthCounts),
    datasets: [{
      data: Object.values(deviceHealthCounts),
      backgroundColor: ['#10b981', '#84cc16', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [{
      label: 'Incidents',
      data: chartData.incidentHistory,
      backgroundColor: '#ef4444',
      borderRadius: 4,
    }]
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Average Safety Score',
      data: chartData.performanceHistory,
      borderColor: '#0d9488',
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <div>
          <h1 className="text-2xl font-bold">Command Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time operational overview and performance analytics.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <input type="date" className="block w-full sm:w-auto px-3 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm" />
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Download size={16} />
            Export Dashboard
          </button>
        </div>
      </div>

      {/* Top Operational KPIs */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Live Operations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <KPICard label="Total Assets" value={stats.total_assets} isActive={activeFilter === null} onClick={() => setActiveFilter(null)} />
          <KPICard label="In Yard" value={stats.in_yard} isActive={activeFilter === 'In Yard'} onClick={() => toggleFilter('In Yard')} />
          <KPICard label="In Transit" value={stats.in_transit} isActive={activeFilter === 'In Transit'} onClick={() => toggleFilter('In Transit')} />
          <KPICard label="At Customer" value={stats.at_customer} isActive={activeFilter === 'At Customer'} onClick={() => toggleFilter('At Customer')} />
          <KPICard label="Critical Alerts" value={stats.critical_alerts} isAlert />
          <KPICard label="Devices Online" value={stats.devices_online} />
          <KPICard label="Fleet Util." value="85%" />
          <KPICard label="Avg Transit" value="4.2h" />
        </div>
      </div>

      {/* Map and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-card-border rounded-lg p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Live Fleet Map {activeFilter && <span className="text-sm font-normal text-muted-foreground ml-2">(Filtered: {activeFilter})</span>}
            </h3>
          </div>
          <div className="flex-1 min-h-[400px]">
            <Map assets={displayedAssets} onMarkerClick={setSelectedAsset} />
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full">
          {!selectedAsset ? (
            <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm flex-1 flex flex-col h-[480px]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 shrink-0">
                <Activity size={20} className="text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                {sortedEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                ) : (
                  sortedEvents.map((event, i) => (
                    <div key={i} className="pb-3 border-b border-card-border last:border-0 last:pb-0">
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(event.time).toLocaleString()}
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">{event.type}</span> 
                        <span className="text-muted-foreground ml-1">- {event.details}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm flex-1 flex flex-col h-[480px]">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-card-border shrink-0">
                <h3 className="text-lg font-semibold">Asset Details</h3>
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
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
              </div>
              
              <div className="pt-4 flex gap-2 shrink-0 border-t border-card-border mt-2">
                <button className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white rounded-md text-sm font-medium transition-colors">
                  {selectedAsset.status === 'In Yard' ? 'Authorize Movement' : 'Track Live'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="pt-6 border-t border-card-border">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Performance Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-lg font-semibold mb-4">Asset Status Distribution</h3>
            <div className="flex-1 relative">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-lg font-semibold mb-4">Device Health</h3>
            <div className="flex-1 relative">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-lg font-semibold mb-4">Monthly Incidents</h3>
            <div className="flex-1 relative">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-lg font-semibold mb-4">Driver Safety Score</h3>
            <div className="flex-1 relative">
              <Line data={lineData} options={{...chartOptions, scales: { y: { beginAtZero: true, max: 5 } }}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
