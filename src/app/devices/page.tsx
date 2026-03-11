'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Activity, ArrowUpDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Device, DeviceType, DeviceStatus, DeviceHealth } from '@/lib/data';
import clsx from 'clsx';

export default function DevicesPage() {
  const { devices, addDevice, showToast } = useApp();
  const [typeFilter, setTypeFilter] = useState('');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    id: '', model: '', type: 'GPS' as DeviceType, serial: '', firmware: '1.0.0', quantity: 1, status: 'Online' as DeviceStatus, health: 'Excellent' as DeviceHealth
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

  const handleHealthCheck = (id: string) => {
    showToast(`Initiating health check for ${id}...`, 'info');
    setTimeout(() => {
      showToast(`Health check complete. ${id} is functioning normally.`, 'success');
    }, 1500);
  };

  const columns: ColumnDef<Device>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-white/80 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Device ID
            <ArrowUpDown className="h-4 w-4" />
          </button>
        )
      },
      meta: {
        variant: "text",
        label: "Device ID",
      },
    },
    {
      accessorKey: "model",
      header: "Model",
      meta: {
        variant: "text",
        label: "Model",
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.length > 0
          ? value.includes(row.getValue(id))
          : true;
      },
      meta: {
        variant: "select",
        label: "Type",
        options: [
          { label: "GPS", value: "GPS" },
          { label: "Camera", value: "Camera" },
          { label: "Telematics", value: "Telematics" },
          { label: "Sensor", value: "Sensor" },
        ],
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={clsx("px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border", getStatusStyle(row.getValue("status")))}>
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
          { label: "Online", value: "Online" },
          { label: "Offline", value: "Offline" },
        ],
      },
    },
    {
      accessorKey: "health",
      header: "Health",
      cell: ({ row }) => (
        <span className={clsx("px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border", getHealthStyle(row.getValue("health")))}>
          {row.getValue("health")}
        </span>
      ),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.length > 0
          ? value.includes(row.getValue(id))
          : true;
      },
      meta: {
        variant: "select",
        label: "Health",
        options: [
          { label: "Excellent", value: "Excellent" },
          { label: "Good", value: "Good" },
          { label: "Fair", value: "Fair" },
          { label: "Poor", value: "Poor" },
        ],
      },
    },
    {
      accessorKey: "assigned_assets",
      header: "Assigned Assets",
      cell: ({ row }) => {
        const assets = row.original.assigned_assets;
        return assets && assets.length > 0 ? assets.join(', ') : <span className="italic text-muted-foreground">Unassigned</span>;
      }
    },
    {
      accessorKey: "available",
      header: "Inventory",
      cell: ({ row }) => (
        <span className={row.original.available === 0 ? "text-red-500 font-medium" : ""}>
          {row.original.available}/{row.original.quantity}
        </span>
      )
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const device = row.original;
        return (
          <div className="flex justify-end gap-2">
            <button className="text-primary hover:text-primary-hover px-2 py-1 border border-card-border rounded hover:bg-secondary transition-colors text-xs font-medium">View</button>
            <button 
              onClick={() => handleHealthCheck(device.id)}
              className="text-foreground bg-secondary hover:bg-card-border px-2 py-1 rounded border border-card-border transition-colors text-xs flex items-center gap-1 font-medium"
            >
              <Activity size={12} />
              Check
            </button>
          </div>
        )
      }
    }
  ];

  const handleAddSubmit = () => {
    if (!newDevice.id || !newDevice.model || !newDevice.serial) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (devices.some(d => d.id === newDevice.id)) {
      showToast('Device ID already exists', 'error');
      return;
    }
    
    addDevice({
      ...newDevice,
      available: newDevice.quantity,
      assigned_assets: [],
      last_active: new Date().toISOString().split('T')[0]
    });
    
    setIsAddModalOpen(false);
    setNewDevice({ id: '', model: '', type: 'GPS', serial: '', firmware: '1.0.0', quantity: 1, status: 'Online', health: 'Excellent' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Devices</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Device
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={devices} 
      />

      {/* Add Device Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Device"
        maxWidth="max-w-lg"
        footer={
          <>
            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-card-border rounded-md text-sm font-medium hover:bg-secondary">Cancel</button>
            <button onClick={handleAddSubmit} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover">Register Device</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Device ID *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDevice.id}
              onChange={e => setNewDevice({...newDevice, id: e.target.value})}
              placeholder="e.g. D1006"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Serial Number *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDevice.serial}
              onChange={e => setNewDevice({...newDevice, serial: e.target.value})}
              placeholder="e.g. SN-8822"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Model *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDevice.model}
              onChange={e => setNewDevice({...newDevice, model: e.target.value})}
              placeholder="e.g. GeoTrack Pro"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Type</label>
            <select 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDevice.type}
              onChange={e => setNewDevice({...newDevice, type: e.target.value as DeviceType})}
            >
              <option value="GPS">GPS</option>
              <option value="Camera">Camera</option>
              <option value="Telematics">Telematics</option>
              <option value="Sensor">Sensor</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Initial Quantity</label>
            <input 
              type="number" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDevice.quantity}
              onChange={e => setNewDevice({...newDevice, quantity: parseInt(e.target.value)})}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newDevice.status}
              onChange={e => setNewDevice({...newDevice, status: e.target.value as DeviceStatus})}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
