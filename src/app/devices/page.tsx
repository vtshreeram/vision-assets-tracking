'use client';

import { useState } from 'react';
import { mockData } from '@/lib/data';
import { Search, Plus, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const filteredDevices = mockData.devices.filter(device => {
    const matchesSearch = device.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          device.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || device.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusStyle = (status: string) => {
    return status === 'Online' 
      ? 'bg-teal-100 text-teal-800 border-teal-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getHealthStyle = (health: string) => {
    switch(health) {
      case 'Excellent': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Good': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Fair': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const unassignedCount = mockData.devices.filter(d => d.available > 0 && (!d.assigned_assets || d.assigned_assets.length === 0)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Devices</h1>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus size={16} />
            Add Device
          </button>
          
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-card-border rounded-md leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
            />
          </div>
          
          <select 
            className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="GPS">GPS</option>
            <option value="Camera">Camera</option>
            <option value="Telematics">Telematics</option>
          </select>
        </div>
      </div>

      {unassignedCount > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Unassigned Devices</h3>
            <p className="text-sm text-amber-700 mt-1">
              You have {unassignedCount} device type{unassignedCount > 1 ? 's' : ''} with available units that can be configured.
            </p>
          </div>
        </div>
      )}

      <div className="bg-card border border-card-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-border">
            <thead className="bg-secondary/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Device ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Health</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned Assets</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Inventory</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-card-border">
              {filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{device.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{device.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{device.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx("px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border", getStatusStyle(device.status))}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx("px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border", getHealthStyle(device.health))}>
                      {device.health}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {device.assigned_assets && device.assigned_assets.length > 0 ? 
                      device.assigned_assets.join(', ') : 
                      <span className="italic">Unassigned</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <span className={device.available === 0 ? "text-red-500 font-medium" : ""}>
                      Available: {device.available}/{device.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-primary hover:text-primary-hover px-2 py-1 border border-card-border rounded hover:bg-secondary transition-colors text-xs">View</button>
                      {device.available > 0 ? (
                        <button className="text-white bg-primary hover:bg-primary-hover px-2 py-1 rounded transition-colors text-xs">Assign</button>
                      ) : (
                        <button disabled className="text-muted-foreground bg-secondary px-2 py-1 rounded border border-card-border opacity-50 cursor-not-allowed text-xs">No Stock</button>
                      )}
                      <button className="text-foreground bg-secondary hover:bg-card-border px-2 py-1 rounded border border-card-border transition-colors text-xs">Health Check</button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredDevices.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">
                    No devices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
