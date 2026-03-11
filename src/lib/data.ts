export type AssetStatus = 'In Yard' | 'In Transit' | 'At Customer' | 'Delivered';
export type DeviceType = 'GPS' | 'Camera' | 'Telematics' | 'Sensor';
export type DeviceStatus = 'Online' | 'Offline';
export type DeviceHealth = 'Excellent' | 'Good' | 'Fair' | 'Poor';
export type IncidentSeverity = 'Low' | 'Medium' | 'High';
export type IncidentStatus = 'Open' | 'Resolved';
export type DriverStatus = 'On Duty' | 'In Transit' | 'Off Duty';

export interface Asset {
  id: string;
  make: string;
  model: string;
  year: number;
  country: string;
  status: AssetStatus;
  location: string;
  assigned_devices: string[];
  current_driver: string | null;
  lat: number;
  lng: number;
}

export interface Device {
  id: string;
  model: string;
  type: DeviceType;
  serial: string;
  firmware: string;
  quantity: number;
  available: number;
  assigned_assets: string[];
  status: DeviceStatus;
  health: DeviceHealth;
  last_active: string;
}

export interface Driver {
  name: string;
  license: string;
  phone: string;
  safety_score: number;
  current_assignment: string | null;
  status: DriverStatus;
}

export interface Incident {
  id: string;
  related: string;
  type: string;
  severity: IncidentSeverity;
  time: string;
  status: IncidentStatus;
  notes: string;
}

export interface EventLog {
  time: string;
  type: string;
  asset?: string;
  device?: string;
  driver?: string;
  details: string;
}

export const mockData = {
  assets: [
    {
      id: 'C001',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      country: 'India',
      status: 'In Yard' as AssetStatus,
      location: 'Yard 1',
      assigned_devices: ['D1001', 'D1003'],
      current_driver: 'John Singh',
      lat: 3.1390,
      lng: 101.6869
    },
    {
      id: 'C002',
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      country: 'India',
      status: 'In Transit' as AssetStatus,
      location: 'Route A',
      assigned_devices: ['D1002', 'D1004'],
      current_driver: 'Sarah Lim',
      lat: 3.2028,
      lng: 101.7238
    },
    {
      id: 'C003',
      make: 'Mazda',
      model: 'CX-5',
      year: 2024,
      country: 'Malaysia',
      status: 'In Yard' as AssetStatus,
      location: 'Yard 2',
      assigned_devices: ['D1005'],
      current_driver: null,
      lat: 3.1590,
      lng: 101.7069
    }
  ],
  devices: [
    {
      id: 'D1001',
      model: 'GeoTrack X',
      type: 'GPS' as DeviceType,
      serial: 'GT-222A',
      firmware: '1.2.3',
      quantity: 100,
      available: 95,
      assigned_assets: ['C001'],
      status: 'Online' as DeviceStatus,
      health: 'Good' as DeviceHealth,
      last_active: '2025-10-23'
    },
    {
      id: 'D1002',
      model: 'CamSecure Pro',
      type: 'Camera' as DeviceType,
      serial: 'CS-107B',
      firmware: '3.1.9',
      quantity: 50,
      available: 47,
      assigned_assets: ['C002'],
      status: 'Online' as DeviceStatus,
      health: 'Excellent' as DeviceHealth,
      last_active: '2025-10-23'
    },
    {
      id: 'D1003',
      model: 'TeleMax 5G',
      type: 'Telematics' as DeviceType,
      serial: 'TM-501C',
      firmware: '2.4.1',
      quantity: 80,
      available: 78,
      assigned_assets: ['C001'],
      status: 'Online' as DeviceStatus,
      health: 'Good' as DeviceHealth,
      last_active: '2025-10-23'
    },
    {
      id: 'D1004',
      model: 'SmartCam HD',
      type: 'Camera' as DeviceType,
      serial: 'SC-889D',
      firmware: '1.7.2',
      quantity: 60,
      available: 58,
      assigned_assets: ['C002'],
      status: 'Online' as DeviceStatus,
      health: 'Good' as DeviceHealth,
      last_active: '2025-10-23'
    },
    {
      id: 'D1005',
      model: 'GPS Pro Max',
      type: 'GPS' as DeviceType,
      serial: 'GP-334E',
      firmware: '3.0.5',
      quantity: 120,
      available: 119,
      assigned_assets: ['C003'],
      status: 'Online' as DeviceStatus,
      health: 'Excellent' as DeviceHealth,
      last_active: '2025-10-23'
    }
  ],
  drivers: [
    {
      name: 'John Singh',
      license: 'MYS123456',
      phone: '+60123456789',
      safety_score: 4.7,
      current_assignment: 'C001',
      status: 'On Duty' as DriverStatus
    },
    {
      name: 'Sarah Lim',
      license: 'MYS223344',
      phone: '+60199887766',
      safety_score: 4.9,
      current_assignment: 'C002',
      status: 'In Transit' as DriverStatus
    }
  ],
  events: [
    {
      time: '2025-10-23T09:00:00',
      type: 'Movement',
      asset: 'C002',
      driver: 'Sarah Lim',
      details: 'Left Yard 1 en route to customer'
    },
    {
      time: '2025-10-23T09:10:00',
      type: 'Device Assigned',
      asset: 'C001',
      device: 'D1001',
      details: 'Device assigned to asset'
    }
  ],
  incidents: [
    {
      id: 'I-001',
      related: 'C002',
      type: 'Speeding',
      severity: 'Medium' as IncidentSeverity,
      time: '2025-10-23T10:07:00',
      status: 'Open' as IncidentStatus,
      notes: 'Asset exceeded speed limit on Route A'
    },
    {
      id: 'I-002',
      related: 'D1002',
      type: 'Camera Offline',
      severity: 'High' as IncidentSeverity,
      time: '2025-10-22T16:30:00',
      status: 'Resolved' as IncidentStatus,
      notes: 'Camera was offline for 12 minutes'
    }
  ],
  kpi_stats: {
    total_assets: 3,
    in_yard: 2,
    in_transit: 1,
    at_customer: 0,
    delivered: 0,
    critical_alerts: 1,
    devices_online: 5,
    devices_offline: 0
  },
  countries: ['India', 'Malaysia', 'Singapore', 'Thailand', 'Indonesia'],
  report_templates: [
    { name: 'Inventory', description: 'Lists all present assets and status', last_run: '2025-10-22' },
    { name: 'Movement', description: 'All asset movements and assignments', last_run: '2025-10-23' },
    { name: 'Device Health', description: 'Shows device health for all assigned/unassigned', last_run: '2025-10-22' },
    { name: 'Incidents', description: 'Reports on all open/closed incidents', last_run: '2025-10-23' },
    { name: 'Performance', description: 'Driver assignments and performance metrics', last_run: '2025-10-22' },
    { name: 'Occupancy', description: 'Asset location and yard occupancy summary', last_run: '2025-10-20' }
  ]
};
