'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, ExternalLink, ArrowUpDown } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Asset, AssetStatus } from '@/lib/data';
import clsx from 'clsx';

export default function AssetsPage() {
  const { assets, addAsset, updateAssetStatus, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    id: '', make: '', model: '', year: new Date().getFullYear(), country: 'Malaysia', status: 'In Yard' as AssetStatus, location: 'Yard 1'
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

  const columns: ColumnDef<Asset>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-white/80 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Asset ID
            <ArrowUpDown className="h-4 w-4" />
          </button>
        )
      },
      meta: {
        variant: "text",
        label: "Asset ID",
      },
    },
    {
      accessorKey: "make",
      header: "Make/Model",
      cell: ({ row }) => `${row.original.make} ${row.original.model}`,
      meta: {
        variant: "text",
        label: "Make/Model",
      },
    },
    {
      accessorKey: "year",
      header: "Year",
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
          { label: "In Yard", value: "In Yard" },
          { label: "In Transit", value: "In Transit" },
          { label: "At Customer", value: "At Customer" },
          { label: "Delivered", value: "Delivered" },
        ],
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "current_driver",
      header: "Driver",
      cell: ({ row }) => row.getValue("current_driver") || <span className="italic text-muted-foreground">Unassigned</span>,
    },
    {
      accessorKey: "assigned_devices",
      header: "Devices",
      cell: ({ row }) => {
        const devices = row.original.assigned_devices;
        return devices && devices.length > 0 ? (
          <div className="flex gap-1">
            {devices.map(dId => (
              <span key={dId} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">{dId}</span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">No devices</span>
        )
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const asset = row.original;
        return (
          <div className="flex justify-end gap-2">
            {asset.status === 'In Yard' ? (
              <button 
                onClick={() => updateAssetStatus(asset.id, 'In Transit')}
                className="text-white bg-primary hover:bg-primary-hover px-2 py-1 rounded transition-colors text-xs flex items-center gap-1"
              >
                <ExternalLink size={12} />
                Authorize
              </button>
            ) : (
              <button 
                onClick={() => updateAssetStatus(asset.id, 'Delivered')}
                className="text-foreground bg-secondary hover:bg-card-border px-2 py-1 rounded border border-card-border transition-colors text-xs"
              >
                Mark Delivered
              </button>
            )}
          </div>
        )
      }
    }
  ];

  const handleAddSubmit = () => {
    if (!newAsset.id || !newAsset.make || !newAsset.model) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (assets.some(a => a.id === newAsset.id)) {
      showToast('Asset ID already exists', 'error');
      return;
    }
    
    addAsset({
      ...newAsset,
      assigned_devices: [],
      current_driver: null,
      lat: 3.1390,
      lng: 101.6869
    });
    
    setIsAddModalOpen(false);
    setNewAsset({ id: '', make: '', model: '', year: new Date().getFullYear(), country: 'Malaysia', status: 'In Yard', location: 'Yard 1' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Assets</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Asset
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={assets} 
      />

      {/* Add Asset Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Asset"
        maxWidth="max-w-lg"
        footer={
          <>
            <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-card-border rounded-md text-sm font-medium hover:bg-secondary">Cancel</button>
            <button onClick={handleAddSubmit} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover">Save Asset</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Asset ID *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.id}
              onChange={e => setNewAsset({...newAsset, id: e.target.value})}
              placeholder="e.g. C004"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Year</label>
            <input 
              type="number" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.year}
              onChange={e => setNewAsset({...newAsset, year: parseInt(e.target.value)})}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Make *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.make}
              onChange={e => setNewAsset({...newAsset, make: e.target.value})}
              placeholder="e.g. Toyota"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Model *</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.model}
              onChange={e => setNewAsset({...newAsset, model: e.target.value})}
              placeholder="e.g. Camry"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.status}
              onChange={e => setNewAsset({...newAsset, status: e.target.value as AssetStatus})}
            >
              <option value="In Yard">In Yard</option>
              <option value="In Transit">In Transit</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Location</label>
            <input 
              type="text" 
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.location}
              onChange={e => setNewAsset({...newAsset, location: e.target.value})}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
