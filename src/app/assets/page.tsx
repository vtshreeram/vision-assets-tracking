'use client';

import { useState } from 'react';
import { mockData, Asset } from '@/lib/data';
import { Search, Plus } from 'lucide-react';
import clsx from 'clsx';

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const filteredAssets = mockData.assets.filter(asset => {
    const matchesSearch = asset.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'In Yard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Transit': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'At Customer': return 'bg-green-100 text-green-800 border-green-200';
      case 'Delivered': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Assets</h1>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus size={16} />
            Add Asset
          </button>
          
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-card-border rounded-md leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
            />
          </div>
          
          <select 
            className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="In Yard">In Yard</option>
            <option value="In Transit">In Transit</option>
            <option value="At Customer">At Customer</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-border">
            <thead className="bg-secondary/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Make/Model</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Driver</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Devices</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-card-border">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{asset.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{asset.make} {asset.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{asset.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx("px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border", getStatusStyle(asset.status))}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{asset.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{asset.current_driver || 'Unassigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {asset.assigned_devices && asset.assigned_devices.length > 0 ? (
                      <div className="flex gap-1">
                        {asset.assigned_devices.map(dId => (
                          <span key={dId} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">{dId}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">No devices</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-primary hover:text-primary-hover px-2 py-1 border border-card-border rounded hover:bg-secondary transition-colors text-xs">View</button>
                      {asset.status === 'In Yard' ? (
                        <button className="text-white bg-primary hover:bg-primary-hover px-2 py-1 rounded transition-colors text-xs">Authorize</button>
                      ) : (
                        <button className="text-foreground bg-secondary hover:bg-card-border px-2 py-1 rounded border border-card-border transition-colors text-xs">Track</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">
                    No assets found matching your criteria.
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
