'use client';

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
import { mockData } from '@/lib/data';
import { Download } from 'lucide-react';

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

export default function AnalyticsPage() {
  const assetStatusCounts = mockData.assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceHealthCounts = mockData.devices.reduce((acc, device) => {
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
      data: [2, 1, 3, 2, 1, 4, 2, 3, 1, 2],
      backgroundColor: '#ef4444',
      borderRadius: 4,
    }]
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Average Safety Score',
      data: [4.5, 4.7, 4.6, 4.8],
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <input type="date" className="block w-full sm:w-auto px-3 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm" />
          <input type="date" className="block w-full sm:w-auto px-3 py-2 border border-card-border rounded-md leading-5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm" />
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm text-center">
          <h4 className="text-sm text-muted-foreground mb-2">Fleet Utilization</h4>
          <div className="text-3xl font-bold text-primary">85%</div>
        </div>
        <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm text-center">
          <h4 className="text-sm text-muted-foreground mb-2">Avg Transit Time</h4>
          <div className="text-3xl font-bold text-primary">4.2h</div>
        </div>
        <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm text-center">
          <h4 className="text-sm text-muted-foreground mb-2">Device Uptime</h4>
          <div className="text-3xl font-bold text-primary">99.1%</div>
        </div>
        <div className="bg-card border border-card-border rounded-lg p-5 shadow-sm text-center">
          <h4 className="text-sm text-muted-foreground mb-2">Incident Rate</h4>
          <div className="text-3xl font-bold text-primary">0.8%</div>
        </div>
      </div>

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
          <h3 className="text-lg font-semibold mb-4">Driver Performance</h3>
          <div className="flex-1 relative">
            <Line data={lineData} options={{...chartOptions, scales: { y: { beginAtZero: true, max: 5 } }}} />
          </div>
        </div>
      </div>
    </div>
  );
}
