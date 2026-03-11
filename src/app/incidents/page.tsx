'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Incident, IncidentSeverity, IncidentStatus } from '@/lib/data';
import { CheckCircle2, MessageSquare, RefreshCw, ArrowUpDown } from 'lucide-react';
import clsx from 'clsx';

export default function IncidentsPage() {
  const { incidents, resolveIncident, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  
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

  const columns: ColumnDef<Incident>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-white/80 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="h-4 w-4" />
          </button>
        )
      },
      meta: {
        variant: "text",
        label: "Incident ID",
      },
    },
    {
      accessorKey: "time",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-white/80 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Time
            <ArrowUpDown className="h-4 w-4" />
          </button>
        )
      },
      cell: ({ row }) => new Date(row.getValue("time")).toLocaleString(undefined, { 
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
    },
    {
      accessorKey: "type",
      header: "Type & Related",
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-foreground">{row.getValue("type")}</div>
          <div className="text-xs text-muted-foreground">Related: {row.original.related}</div>
        </div>
      )
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <span className={clsx("px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border", getSeverityStyle(row.getValue("severity")))}>
          {row.getValue("severity")}
        </span>
      ),
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.length > 0
          ? value.includes(row.getValue(id))
          : true;
      },
      meta: {
        variant: "select",
        label: "Severity",
        options: [
          { label: "Low", value: "Low" },
          { label: "Medium", value: "Medium" },
          { label: "High", value: "High" },
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
          { label: "Open", value: "Open" },
          { label: "Resolved", value: "Resolved" },
        ],
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px] lg:max-w-xs xl:max-w-sm" title={row.getValue("notes")}>
          {row.getValue("notes")}
        </div>
      )
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const incident = row.original;
        return (
          <div className="flex justify-end gap-2">
            {incident.status === 'Open' ? (
              <button 
                onClick={() => resolveIncident(incident.id)}
                title="Resolve Incident"
                className="text-white bg-primary hover:bg-primary-hover p-1.5 rounded transition-colors flex items-center justify-center shadow-sm"
              >
                <CheckCircle2 size={16} />
              </button>
            ) : (
              <button 
                onClick={() => showToast('Reopen functionality requires backend API.', 'error')}
                title="Reopen Incident"
                className="text-foreground bg-secondary hover:bg-card-border border border-card-border p-1.5 rounded transition-colors flex items-center justify-center shadow-sm"
              >
                <RefreshCw size={16} />
              </button>
            )}
            <button 
              onClick={() => showToast('Note modal would open here.', 'info')}
              title="Add Note"
              className="text-foreground bg-secondary hover:bg-card-border border border-card-border p-1.5 rounded transition-colors flex items-center justify-center shadow-sm"
            >
              <MessageSquare size={16} />
            </button>
          </div>
        )
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-card-border gap-4">
        <h1 className="text-2xl font-bold">Incidents</h1>
      </div>

      <DataTable 
        columns={columns} 
        data={incidents} 
      />
    </div>
  );
}
