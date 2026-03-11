'use client';

import { useState } from 'react';
import { mockData } from '@/lib/data';
import { Video } from 'lucide-react';

export default function CameraPage() {
  const [assetFilter, setAssetFilter] = useState('');
  
  const cameraAssets = mockData.assets.filter(asset => {
    return !assetFilter || asset.id === assetFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Camera Feeds</h1>
        
        <select 
          className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
          value={assetFilter}
          onChange={(e) => setAssetFilter(e.target.value)}
        >
          <option value="">All Assets</option>
          {mockData.assets.map(asset => (
            <option key={asset.id} value={asset.id}>{asset.id} - {asset.make} {asset.model}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cameraAssets.map(asset => (
          <div key={asset.id} className="bg-card border border-card-border rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
            <div className="aspect-video bg-muted relative flex items-center justify-center cursor-pointer group-hover:bg-muted/80 transition-colors">
              <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                LIVE
              </div>
              <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                <Video size={32} />
                <span>Click to view {asset.id}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{asset.make} {asset.model}</h3>
              <p className="text-sm text-muted-foreground">Status: {asset.status} | Driver: {asset.current_driver || 'Unassigned'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
