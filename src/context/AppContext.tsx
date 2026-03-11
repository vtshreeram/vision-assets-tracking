'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { mockData, Asset, Device, Incident, Driver, EventLog } from '@/lib/data';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ChartData {
  incidentHistory: number[];
  performanceHistory: number[];
}

interface AppContextType {
  assets: Asset[];
  devices: Device[];
  incidents: Incident[];
  drivers: Driver[];
  events: EventLog[];
  toasts: Toast[];
  chartData: ChartData;
  addAsset: (asset: Asset) => void;
  updateAssetStatus: (id: string, status: Asset['status']) => void;
  addDevice: (device: Device) => void;
  addDriver: (driver: Driver) => void;
  resolveIncident: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(mockData.assets);
  const [devices, setDevices] = useState<Device[]>(mockData.devices);
  const [incidents, setIncidents] = useState<Incident[]>(mockData.incidents);
  const [drivers, setDrivers] = useState<Driver[]>(mockData.drivers);
  const [events, setEvents] = useState<EventLog[]>(mockData.events);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Dynamic chart data state
  const [chartData, setChartData] = useState<ChartData>({
    incidentHistory: [2, 1, 3, 2, 1, 4, 2, 3, 1, 2], // Mocked Jan-Oct
    performanceHistory: [4.5, 4.7, 4.6, 4.8] // Mocked Weeks 1-4
  });

  // Load from local storage on mount
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('vision-fleet-data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.assets) setAssets(parsed.assets);
        if (parsed.devices) setDevices(parsed.devices);
        if (parsed.incidents) setIncidents(parsed.incidents);
        if (parsed.drivers) setDrivers(parsed.drivers);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.chartData) setChartData(parsed.chartData);
      }
    } catch (e) {
      console.error("Failed to load from local storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to local storage when core data changes
  React.useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('vision-fleet-data', JSON.stringify({
        assets, devices, incidents, drivers, events, chartData
      }));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [assets, devices, incidents, drivers, events, chartData, isInitialized]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addAsset = useCallback((asset: Asset) => {
    setAssets(prev => [...prev, asset]);
    setEvents(prev => [{
      time: new Date().toISOString(),
      type: 'Asset Added',
      asset: asset.id,
      details: `New asset ${asset.id} (${asset.make} ${asset.model}) added to the fleet.`
    }, ...prev]);
    showToast(`Asset ${asset.id} added successfully`, 'success');
  }, [showToast]);

  const updateAssetStatus = useCallback((id: string, status: Asset['status']) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setEvents(prev => [{
      time: new Date().toISOString(),
      type: 'Status Update',
      asset: id,
      details: `Asset status changed to ${status}.`
    }, ...prev]);
    showToast(`Asset ${id} status updated to ${status}`, 'success');
  }, [showToast]);

  const addDevice = useCallback((device: Device) => {
    setDevices(prev => [...prev, device]);
    setEvents(prev => [{
      time: new Date().toISOString(),
      type: 'Device Added',
      device: device.id,
      details: `New ${device.type} device (${device.model}) registered.`
    }, ...prev]);
    showToast(`Device ${device.id} registered successfully`, 'success');
  }, [showToast]);

  const addDriver = useCallback((driver: Driver) => {
    setDrivers(prev => [...prev, driver]);
    setEvents(prev => [{
      time: new Date().toISOString(),
      type: 'Driver Added',
      driver: driver.name,
      details: `New driver ${driver.name} added to the system.`
    }, ...prev]);
    showToast(`Driver ${driver.name} added successfully`, 'success');
  }, [showToast]);

  const resolveIncident = useCallback((id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Resolved' as const } : i));
    
    // Impact analytics when an incident is resolved
    setChartData(prev => {
      const newHistory = [...prev.incidentHistory];
      // Simulate resolving a recent incident reduces the current month's count for this mock demo
      newHistory[newHistory.length - 1] = Math.max(0, newHistory[newHistory.length - 1] - 0.1); 
      return { ...prev, incidentHistory: newHistory };
    });

    setEvents(prev => [{
      time: new Date().toISOString(),
      type: 'Incident Resolved',
      details: `Incident ${id} was marked as resolved.`
    }, ...prev]);

    showToast(`Incident ${id} resolved`, 'success');
  }, [showToast]);

  const value = useMemo(() => ({
    assets, devices, incidents, drivers, events, toasts, chartData,
    addAsset, updateAssetStatus, addDevice, addDriver, resolveIncident, showToast, removeToast
  }), [assets, devices, incidents, drivers, events, toasts, chartData, addAsset, updateAssetStatus, addDevice, addDriver, resolveIncident, showToast, removeToast]);

  return (
    <AppContext.Provider value={value}>
      {children}
      
      {/* Global Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`px-4 py-3 rounded-md shadow-lg flex items-center justify-between min-w-[280px] animate-in slide-in-from-right-5 pointer-events-auto ${
              toast.type === 'success' ? 'bg-teal-600 text-white' :
              toast.type === 'error' ? 'bg-red-600 text-white' :
              'bg-blue-600 text-white'
            }`}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-4 opacity-70 hover:opacity-100">&times;</button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
