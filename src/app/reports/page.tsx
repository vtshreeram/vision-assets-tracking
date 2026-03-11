'use client';

import { mockData } from '@/lib/data';
import { Calendar, Download, Play } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Calendar size={16} />
          Schedule Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.report_templates.map(report => (
          <div key={report.name} className="bg-card border border-card-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">{report.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 h-10">{report.description}</p>
            <div className="text-xs text-muted-foreground mb-4">Last run: {report.last_run}</div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t border-card-border/50">
              <button className="flex-1 flex justify-center items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                <Play size={14} /> Run
              </button>
              <button className="flex-1 flex justify-center items-center gap-1.5 bg-secondary hover:bg-card-border border border-card-border text-foreground px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                <Download size={14} /> Download
              </button>
              <button className="flex-1 flex justify-center items-center gap-1.5 bg-transparent border border-card-border hover:bg-secondary text-foreground px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                <Calendar size={14} /> Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
