"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, ExternalLink, ArrowUpDown, UserCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { DataTable } from "@/components/ui/data-table";
import { DeviceMultiSelect } from "@/components/ui/DeviceMultiSelect";
import { DriverSelect } from "@/components/ui/DriverSelect";
import { ColumnDef } from "@tanstack/react-table";
import { Asset, AssetStatus } from "@/lib/data";
import clsx from "clsx";

export default function AssetsPage() {
  const {
    assets,
    devices,
    drivers,
    addAsset,
    updateAssetStatus,
    authorizeAsset,
    showToast,
  } = useApp();

  // ── Add Asset modal state ────────────────────────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ── Authorize modal state ────────────────────────────────────────────────
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
  const [authorizeTarget, setAuthorizeTarget] = useState<Asset | null>(null);
  const [selectedDriverName, setSelectedDriverName] = useState<string | null>(
    null,
  );
  const [newAsset, setNewAsset] = useState({
    id: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    country: "Malaysia",
    status: "In Yard" as AssetStatus,
    location: "Yard 1",
  });
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);

  // Derive available devices every time the devices list changes.
  // A device is available for assignment when it still has remaining inventory (available > 0).
  const availableDevices = useMemo(
    () => devices.filter((d) => d.available > 0),
    [devices],
  );

  // Derive available drivers — only those with Available status and no current assignment.
  const availableDrivers = useMemo(
    () =>
      drivers.filter(
        (d) => d.status === "Available" || d.current_assignment === null,
      ),
    [drivers],
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "In Yard":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Transit":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "At Customer":
        return "bg-green-100 text-green-800 border-green-200";
      case "Delivered":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const columns: ColumnDef<Asset>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-gray-600 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Asset ID
          <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
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
        <span
          className={clsx(
            "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border",
            getStatusStyle(row.getValue("status")),
          )}
        >
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
      cell: ({ row }) =>
        row.getValue("current_driver") || (
          <span className="italic text-muted-foreground">Unassigned</span>
        ),
    },
    {
      accessorKey: "assigned_devices",
      header: "Devices",
      cell: ({ row }) => {
        const assignedDevices = row.original.assigned_devices;
        return assignedDevices && assignedDevices.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {assignedDevices.map((dId) => (
              <span
                key={dId}
                className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
              >
                {dId}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs italic">
            No devices
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const asset = row.original;
        return (
          <div className="flex justify-end gap-2">
            {asset.status === "In Yard" ? (
              <button
                onClick={() => openAuthorizeModal(asset)}
                className="text-white bg-primary hover:bg-primary-hover px-2 py-1 rounded transition-colors text-xs flex items-center gap-1"
              >
                <ExternalLink size={12} />
                Authorize
              </button>
            ) : (
              <button
                onClick={() => updateAssetStatus(asset.id, "Delivered")}
                className="text-foreground bg-secondary hover:bg-card-border px-2 py-1 rounded border border-card-border transition-colors text-xs"
              >
                Mark Delivered
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // ── Authorize modal handlers ─────────────────────────────────────────────
  const openAuthorizeModal = (asset: Asset) => {
    setAuthorizeTarget(asset);
    setSelectedDriverName(null);
    setIsAuthorizeModalOpen(true);
  };

  const handleAuthorizeClose = () => {
    setIsAuthorizeModalOpen(false);
    setAuthorizeTarget(null);
    setSelectedDriverName(null);
  };

  const handleAuthorizeSubmit = () => {
    if (!authorizeTarget) return;

    // ── Validation ────────────────────────────────────────────────────────
    if (!selectedDriverName) {
      showToast("Please select a driver before authorizing", "error");
      return;
    }

    const driver = drivers.find((d) => d.name === selectedDriverName);
    if (!driver) {
      showToast("Selected driver no longer exists", "error");
      return;
    }

    if (driver.current_assignment !== null) {
      showToast(
        `${driver.name} is already assigned to asset ${driver.current_assignment}`,
        "error",
      );
      return;
    }

    // ── Commit ────────────────────────────────────────────────────────────
    authorizeAsset(authorizeTarget.id, selectedDriverName);
    handleAuthorizeClose();
  };

  // ── Add-asset modal handlers ─────────────────────────────────────────────
  const resetForm = () => {
    setNewAsset({
      id: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      country: "Malaysia",
      status: "In Yard",
      location: "Yard 1",
    });
    setSelectedDeviceIds([]);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleAddSubmit = () => {
    // ── Required field validation ──────────────────────────────────────────
    if (!newAsset.id || !newAsset.make || !newAsset.model) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // ── Duplicate asset ID check ───────────────────────────────────────────
    if (assets.some((a) => a.id === newAsset.id)) {
      showToast("Asset ID already exists", "error");
      return;
    }

    // ── Device validation (only when devices were selected) ────────────────
    if (selectedDeviceIds.length > 0) {
      // 1. All selected IDs must exist in the devices list
      const unknownIds = selectedDeviceIds.filter(
        (id) => !devices.some((d) => d.id === id),
      );
      if (unknownIds.length > 0) {
        showToast(`Unknown device ID(s): ${unknownIds.join(", ")}`, "error");
        return;
      }

      // 2. No duplicates within the selection itself
      const unique = new Set(selectedDeviceIds);
      if (unique.size !== selectedDeviceIds.length) {
        showToast("Duplicate device IDs in selection", "error");
        return;
      }

      // 3. All selected devices must have remaining inventory (available > 0)
      const alreadyAssigned = selectedDeviceIds.filter((id) => {
        const device = devices.find((d) => d.id === id);
        return device && device.available <= 0;
      });
      if (alreadyAssigned.length > 0) {
        showToast(
          `Device(s) ${alreadyAssigned.join(", ")} have no remaining inventory`,
          "error",
        );
        return;
      }
    }

    // ── Persist ────────────────────────────────────────────────────────────
    addAsset(
      {
        ...newAsset,
        assigned_devices: selectedDeviceIds,
        current_driver: null,
        lat: 3.139,
        lng: 101.6869,
      },
      selectedDeviceIds,
    );

    setIsAddModalOpen(false);
    resetForm();
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

      <DataTable columns={columns} data={assets} />

      {/* ── Authorize Asset Modal ───────────────────────────────────────── */}
      <Modal
        isOpen={isAuthorizeModalOpen}
        onClose={handleAuthorizeClose}
        title="Authorize Asset"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              onClick={handleAuthorizeClose}
              className="px-4 py-2 border border-card-border rounded-md text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAuthorizeSubmit}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover flex items-center gap-2"
            >
              <UserCheck size={15} />
              Authorize
            </button>
          </>
        }
      >
        {authorizeTarget && (
          <div className="space-y-5">
            {/* Asset summary card */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/40 border border-card-border">
              <div className="size-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <ExternalLink size={16} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-none mb-1">
                  Asset
                </p>
                <p className="font-semibold text-sm leading-tight">
                  {authorizeTarget.id}
                </p>
                <p className="text-sm text-muted-foreground leading-tight mt-0.5">
                  {authorizeTarget.year} {authorizeTarget.make}{" "}
                  {authorizeTarget.model}
                </p>
              </div>
              <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-100 text-blue-800 border-blue-200">
                {authorizeTarget.location}
              </span>
            </div>

            {/* Driver selector */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Select Driver <span className="text-red-500">*</span>
              </label>

              <DriverSelect
                availableDrivers={availableDrivers}
                selectedDriverName={selectedDriverName}
                onChange={setSelectedDriverName}
                placeholder={
                  availableDrivers.length === 0
                    ? "No available drivers"
                    : "Search driver..."
                }
                disabled={availableDrivers.length === 0}
              />

              {availableDrivers.length === 0 ? (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  All drivers are currently on assignment. Add a new driver in
                  the <span className="font-medium text-primary">Drivers</span>{" "}
                  module first.
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Only unassigned drivers are shown. {availableDrivers.length}{" "}
                  available.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Add Asset Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        title="Add New Asset"
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              onClick={handleModalClose}
              className="px-4 py-2 border border-card-border rounded-md text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubmit}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover"
            >
              Save Asset
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Asset ID */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">
              Asset ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.id}
              onChange={(e) => setNewAsset({ ...newAsset, id: e.target.value })}
              placeholder="e.g. C004"
            />
          </div>

          {/* Year */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.year}
              onChange={(e) =>
                setNewAsset({ ...newAsset, year: parseInt(e.target.value) })
              }
            />
          </div>

          {/* Make */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">
              Make <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.make}
              onChange={(e) =>
                setNewAsset({ ...newAsset, make: e.target.value })
              }
              placeholder="e.g. Toyota"
            />
          </div>

          {/* Model */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.model}
              onChange={(e) =>
                setNewAsset({ ...newAsset, model: e.target.value })
              }
              placeholder="e.g. Camry"
            />
          </div>

          {/* Status */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.status}
              onChange={(e) =>
                setNewAsset({
                  ...newAsset,
                  status: e.target.value as AssetStatus,
                })
              }
            >
              <option value="In Yard">In Yard</option>
              <option value="In Transit">In Transit</option>
            </select>
          </div>

          {/* Location */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              className="w-full p-2 border border-card-border rounded-md bg-card"
              value={newAsset.location}
              onChange={(e) =>
                setNewAsset({ ...newAsset, location: e.target.value })
              }
            />
          </div>

          {/* Devices — full-width multi-select */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Devices
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                (optional — assign after creation if preferred)
              </span>
            </label>

            <DeviceMultiSelect
              availableDevices={availableDevices}
              selectedIds={selectedDeviceIds}
              onChange={setSelectedDeviceIds}
              placeholder={
                availableDevices.length === 0
                  ? "No unassigned devices available"
                  : "Select devices..."
              }
              disabled={availableDevices.length === 0}
            />

            {availableDevices.length === 0 && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                All registered devices are currently assigned. Register a new
                device in the{" "}
                <span className="font-medium text-primary">Devices</span> module
                first.
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
