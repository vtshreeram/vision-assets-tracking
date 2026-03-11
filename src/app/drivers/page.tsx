'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Star, ArrowUpDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Driver, DriverStatus } from '@/lib/data';
import clsx from 'clsx';

export default function DriversPage() {
  const { drivers, addDriver, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '', license: '', phone: '', safety_score: 5.0, status: 'Off Duty' as DriverStatus, current_assignment: ''
  });

  const getDriverStatusStyle = (status: string) => {
    switch(status) {
      case 'On Duty': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'In Transit': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Off Duty': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-white/80 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Driver Name
            <ArrowUpDown className="h-4 w-4" />
          </button>
        )
      },
      meta: {
        variant: "text",
        label: "Driver Name",
      },
    },
    {
      accessorKey: "license",
      header: "License Number",
      meta: {
        variant: "text",
        label: "License Number",
      },
    },
    {
      accessorKey: "phone",
      header: "Contact",
    },
    {
      accessorKey: "safety_score",
      header: "Safety Score",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-amber-500 font-medium text-sm">
          <Star size={14} className="fill-current" />
          {row.getValue("safety_score")}/5.0
        </span>
      )
    },
    {
      accessorKey: "current_assignment",
      header: "Assignment",
      cell: ({ row }) => row.getValue("current_assignment") || <span className="italic text-muted-foreground">None</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx("px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border", getDriverStatusStyle(row.getValue("status")))}>
          {row.getValue("status")}
        </span>
      ),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.length > 0
          ? value.includes(row.getValue(id))
          : true;
      },
      meta: {
        variant: "select",
        label: "Status",
        options: [
          { label: "On Duty", value: "On Duty" },
          { label: "Off Duty", value: "Off Duty" },
          { label: "In Transit", value: "In Transit" },
        ],
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: () => (
        <div className="flex justify-end gap-2">
          <button className="text-primary hover:text-primary-hover px-2 py-1 border border-card-border rounded hover:bg-secondary transition-colors text-xs font-medium">Profile</button>
          <button className="text-foreground bg-secondary hover:bg-card-border px-2 py-1 rounded border border-card-border transition-colors text-xs font-medium">Message</button>
        </div>
      )
    }
  ];

  const handleAddSubmit = () => {
    if (!newDriver.name || !newDriver.license || !newDriver.phone) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (drivers.some(d => d.license === newDriver.license)) {
      showToast('Driver license already exists', 'error');
      return;
    }
    
    addDriver({
      ...newDriver,
      current_assignment: newDriver.current_assignment || null,
    });
    
    setIsAddModalOpen(false);
    setNewDriver({ name: '', license: '', phone: '', safety_score: 5.0, status: 'Off Duty', current_assignment: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Drivers</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Driver
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={drivers} 
      />

      {/* Add Driver Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Driver"
        maxWidth="max-w-lg"
        footer={
          <>
            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-card-border rounded-md text-sm font-medium hover:bg-secondary">Cancel</button>
            <button onClick={handleAddSubmit} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover">Save Driver</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDriver.name}
              onChange={e => setNewDriver({...newDriver, name: e.target.value})}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">License Number *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDriver.license}
              onChange={e => setNewDriver({...newDriver, license: e.target.value})}
              placeholder="e.g. DL-12345"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDriver.phone}
              onChange={e => setNewDriver({...newDriver, phone: e.target.value})}
              placeholder="e.g. +1 555-0199"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Initial Safety Score</label>
            <input 
              type="number" 
              step="0.1"
              max="5"
              min="0"
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDriver.safety_score}
              onChange={e => setNewDriver({...newDriver, safety_score: parseFloat(e.target.value)})}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDriver.status}
              onChange={e => setNewDriver({...newDriver, status: e.target.value as DriverStatus})}
            >
              <option value="Off Duty">Off Duty</option>
              <option value="On Duty">On Duty</option>
              <option value="In Transit">In Transit</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Asset Assignment</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDriver.current_assignment}
              onChange={e => setNewDriver({...newDriver, current_assignment: e.target.value})}
              placeholder="e.g. C001 (Optional)"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
