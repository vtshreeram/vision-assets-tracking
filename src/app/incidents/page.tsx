'use client';

import { useState } from 'react';
import { mockData } from '@/lib/data';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function IncidentsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const filteredIncidents = mockData.incidents.filter(incident => {
    const matchesStatus = !statusFilter || incident.status === statusFilter;
    const matchesSeverity = !severityFilter || incident.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const getSeverityStyle = (severity: string) => {
    switch(severity) {
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusStyle = (status: string) => {
    return status === 'Open' 
      ? 'bg-amber-100 text-amber-800 border-amber-200' 
      : 'bg-teal-100 text-teal-800 border-teal-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Incidents</h1>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <select 
            className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select 
            className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-card-border rounded-lg shadow-sm overflow-hidden flex flex-col">
        {filteredIncidents.map((incident, i) => {
          const isExpanded = expandedId === incident.id;
          return (
            <div 
              key={incident.id} 
              className={clsx(
                "p-4 border-b border-card-border last:border-0 transition-colors cursor-pointer",
                isExpanded ? "bg-secondary/50" : "hover:bg-secondary/20"
              )}
              onClick={() => setExpandedId(isExpanded ? null : incident.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold">{incident.id}</span>
                  <span className={clsx("px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border", getSeverityStyle(incident.severity))}>
                    {incident.severity}
                  </span>
                  <span className={clsx("px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border", getStatusStyle(incident.status))}>
                    {incident.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="text-sm">{new Date(incident.time).toLocaleString()}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
              
              <div className="text-sm">
                <strong>{incident.type}</strong> - Related: {incident.related}
              </div>
              
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-card-border/50 animate-in slide-in-from-top-2">
                  <p className="text-sm text-muted-foreground mb-4">{incident.notes}</p>
                  <div className="flex gap-2">
                    {incident.status === 'Open' ? (
                      <button className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                        Resolve Incident
                      </button>
                    ) : (
                      <button className="bg-secondary hover:bg-card-border border border-card-border text-foreground px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                        Reopen
                      </button>
                    )}
                    <button className="bg-secondary hover:bg-card-border border border-card-border text-foreground px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                      Add Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredIncidents.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">
            No incidents found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
