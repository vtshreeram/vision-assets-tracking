'use client';

import { useState } from 'react';
import { mockData } from '@/lib/data';
import { Plus, Star } from 'lucide-react';
import clsx from 'clsx';

export default function DriversPage() {
  const [statusFilter, setStatusFilter] = useState('');
  
  const filteredDrivers = mockData.drivers.filter(driver => {
    return !statusFilter || driver.status === statusFilter;
  });

  const getDriverStatusStyle = (status: string) => {
    switch(status) {
      case 'On Duty': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'In Transit': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Off Duty': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Drivers</h1>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Plus size={16} />
            Add Driver
          </button>
          
          <select 
            className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="On Duty">On Duty</option>
            <option value="Off Duty">Off Duty</option>
            <option value="In Transit">In Transit</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDrivers.map(driver => (
          <div key={driver.license} className="bg-card border border-card-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">{driver.name}</h4>
              <span className={clsx("px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border", getDriverStatusStyle(driver.status))}>
                {driver.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-card-border/50 pb-2">
                <span className="text-muted-foreground">License:</span>
                <span className="font-medium">{driver.license}</span>
              </div>
              <div className="flex justify-between border-b border-card-border/50 pb-2 pt-1">
                <span className="text-muted-foreground">Phone:</span>
                <span>{driver.phone}</span>
              </div>
              <div className="flex justify-between border-b border-card-border/50 pb-2 pt-1">
                <span className="text-muted-foreground">Safety Score:</span>
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star size={14} className="fill-current" />
                  {driver.safety_score}/5.0
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Assignment:</span>
                <span className={driver.current_assignment ? "font-medium" : "text-muted-foreground italic"}>
                  {driver.current_assignment || 'None'}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredDrivers.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No drivers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
