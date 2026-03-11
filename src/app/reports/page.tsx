'use client';

import { useState } from 'react';
import { mockData } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import { Calendar, Download, Play, FileText, CheckCircle2, Loader2, Search } from 'lucide-react';
import clsx from 'clsx';

export default function ReportsPage() {
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [runningReports, setRunningReports] = useState<Record<string, boolean>>({});

  const filteredReports = mockData.report_templates.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunReport = (reportName: string) => {
    if (runningReports[reportName]) return;

    setRunningReports(prev => ({ ...prev, [reportName]: true }));
    showToast(`Generating ${reportName} report... This may take a moment.`, 'info');

    // Simulate backend report generation delay (2 seconds)
    setTimeout(() => {
      setRunningReports(prev => ({ ...prev, [reportName]: false }));
      showToast(`${reportName} report generated successfully! Check your downloads.`, 'success');
    }, 2000);
  };

  const handleSchedule = (reportName: string) => {
    showToast(`Scheduling modal for ${reportName} would open here.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-card-border rounded-md leading-5 bg-card placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm"
            />
          </div>

          <button 
            onClick={() => showToast('Custom report builder would open here.', 'info')}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <FileText size={16} />
            Create Custom
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReports.map(report => {
          const isRunning = runningReports[report.name];

          return (
            <div 
              key={report.name} 
              className={clsx(
                "bg-card border rounded-lg p-5 shadow-sm transition-all duration-200 flex flex-col",
                isRunning ? "border-primary/50 bg-primary/5 shadow-md scale-[1.02]" : "border-card-border hover:shadow-md hover:border-primary/30"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-secondary rounded-md text-primary">
                  <FileText size={20} />
                </div>
                {isRunning ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full animate-pulse">
                    <Loader2 size={12} className="animate-spin" /> Generating
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} /> Ready
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold mb-1 mt-2">{report.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{report.description}</p>
              
              <div className="text-xs text-muted-foreground mb-4 font-mono bg-secondary/50 p-2 rounded">
                Last run: {report.last_run}
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-card-border/50">
                <button 
                  onClick={() => handleRunReport(report.name)}
                  disabled={isRunning}
                  className="col-span-2 flex justify-center items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <><Loader2 size={16} className="animate-spin" /> Processing...</>
                  ) : (
                    <><Download size={16} /> Run & Download</>
                  )}
                </button>
                <button 
                  onClick={() => handleRunReport(report.name)}
                  disabled={isRunning}
                  className="flex justify-center items-center gap-1.5 bg-secondary hover:bg-card-border border border-card-border text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={14} /> Preview
                </button>
                <button 
                  onClick={() => handleSchedule(report.name)}
                  disabled={isRunning}
                  className="flex justify-center items-center gap-1.5 bg-transparent border border-card-border hover:bg-secondary text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar size={14} /> Schedule
                </button>
              </div>
            </div>
          );
        })}

        {filteredReports.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground bg-card border border-card-border border-dashed rounded-lg">
            No reports found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
