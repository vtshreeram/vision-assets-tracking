// Asset Tracking System - Main Application
class AssetTrackingApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.map = null;
        this.charts = {};
        
        // Application data - using in-memory storage as localStorage is not available
        this.data = {
            assets: [
                {
                    id: 'C001',
                    make: 'Toyota',
                    model: 'Camry',
                    year: 2022,
                    country: 'India',
                    status: 'In Yard',
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
                    status: 'In Transit',
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
                    status: 'In Yard',
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
                    type: 'GPS',
                    serial: 'GT-222A',
                    firmware: '1.2.3',
                    quantity: 100,
                    available: 95,
                    assigned_assets: ['C001'],
                    status: 'Online',
                    health: 'Good',
                    last_active: '2025-10-23'
                },
                {
                    id: 'D1002',
                    model: 'CamSecure Pro',
                    type: 'Camera',
                    serial: 'CS-107B',
                    firmware: '3.1.9',
                    quantity: 50,
                    available: 47,
                    assigned_assets: ['C002'],
                    status: 'Online',
                    health: 'Excellent',
                    last_active: '2025-10-23'
                },
                {
                    id: 'D1003',
                    model: 'TeleMax 5G',
                    type: 'Telematics',
                    serial: 'TM-501C',
                    firmware: '2.4.1',
                    quantity: 80,
                    available: 78,
                    assigned_assets: ['C001'],
                    status: 'Online',
                    health: 'Good',
                    last_active: '2025-10-23'
                },
                {
                    id: 'D1004',
                    model: 'SmartCam HD',
                    type: 'Camera',
                    serial: 'SC-889D',
                    firmware: '1.7.2',
                    quantity: 60,
                    available: 58,
                    assigned_assets: ['C002'],
                    status: 'Online',
                    health: 'Good',
                    last_active: '2025-10-23'
                },
                {
                    id: 'D1005',
                    model: 'GPS Pro Max',
                    type: 'GPS',
                    serial: 'GP-334E',
                    firmware: '3.0.5',
                    quantity: 120,
                    available: 119,
                    assigned_assets: ['C003'],
                    status: 'Online',
                    health: 'Excellent',
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
                    status: 'On Duty'
                },
                {
                    name: 'Sarah Lim',
                    license: 'MYS223344',
                    phone: '+60199887766',
                    safety_score: 4.9,
                    current_assignment: 'C002',
                    status: 'In Transit'
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
                    severity: 'Medium',
                    time: '2025-10-23T10:07:00',
                    status: 'Open',
                    notes: 'Asset exceeded speed limit on Route A'
                },
                {
                    id: 'I-002',
                    related: 'D1002',
                    type: 'Camera Offline',
                    severity: 'High',
                    time: '2025-10-22T16:30:00',
                    status: 'Resolved',
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
                {
                    name: 'Inventory',
                    description: 'Lists all present assets and status',
                    last_run: '2025-10-22'
                },
                {
                    name: 'Movement',
                    description: 'All asset movements and assignments',
                    last_run: '2025-10-23'
                },
                {
                    name: 'Device Health',
                    description: 'Shows device health for all assigned/unassigned',
                    last_run: '2025-10-22'
                },
                {
                    name: 'Incidents',
                    description: 'Reports on all open/closed incidents',
                    last_run: '2025-10-23'
                },
                {
                    name: 'Performance',
                    description: 'Driver assignments and performance metrics',
                    last_run: '2025-10-22'
                },
                {
                    name: 'Occupancy',
                    description: 'Asset location and yard occupancy summary',
                    last_run: '2025-10-20'
                }
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeDashboard();
        this.updateAllViews();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.addEventListener('click', (e) => {
                const module = e.target.getAttribute('data-module');
                this.switchModule(module);
            });
        });

        // Modal close
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Search and filters
        document.getElementById('asset-search')?.addEventListener('input', () => {
            this.renderAssetsTable();
        });
        
        document.getElementById('asset-filter')?.addEventListener('change', () => {
            this.renderAssetsTable();
        });
        
        document.getElementById('device-filter')?.addEventListener('change', () => {
            this.renderDevicesTable();
        });
        
        document.getElementById('incident-filter')?.addEventListener('change', () => {
            this.renderIncidentsList();
        });
        
        document.getElementById('severity-filter')?.addEventListener('change', () => {
            this.renderIncidentsList();
        });
        
        document.getElementById('camera-filter')?.addEventListener('change', () => {
            this.renderCameraGrid();
        });
        
        document.getElementById('driver-filter')?.addEventListener('change', () => {
            this.renderDriversGrid();
        });

        // Analytics export
        document.getElementById('export-charts')?.addEventListener('click', () => {
            this.exportChartsAsPDF();
        });
        
        // Reports
        document.getElementById('schedule-report')?.addEventListener('click', () => {
            this.openScheduleReportModal();
        });
        
        // Add Asset button
        document.getElementById('add-asset-btn')?.addEventListener('click', () => {
            this.openAddAssetModal();
        });
        
        // Add Device button
        document.getElementById('add-device-btn')?.addEventListener('click', () => {
            this.openAddDeviceModal();
        });
        
        // Add Driver button
        document.getElementById('add-driver-btn')?.addEventListener('click', () => {
            this.openAddDriverModal();
        });
        
        // Close asset details panel
        document.getElementById('close-asset-details')?.addEventListener('click', () => {
            this.closeAssetDetails();
        });
    }

    switchModule(module) {
        // Update sidebar active state
        document.querySelectorAll('.sidebar__item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-module="${module}"]`).classList.add('active');
        
        // Update module display
        document.querySelectorAll('.module').forEach(mod => {
            mod.classList.remove('active');
        });
        document.getElementById(module).classList.add('active');
        
        this.currentModule = module;
        
        // Initialize module-specific content
        switch(module) {
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'assets':
                this.renderAssetsTable();
                break;
            case 'devices':
                this.renderDevicesTable();
                break;
            case 'camera':
                this.renderCameraGrid();
                break;
            case 'incidents':
                this.renderIncidentsList();
                break;
            case 'drivers':
                this.renderDriversGrid();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'reports':
                this.renderReports();
                break;
        }
    }

    initializeDashboard() {
        this.updateKPICards();
        this.initializeMap();
        this.renderActivityStream();
    }

    updateKPICards() {
        const stats = this.data.kpi_stats;
        document.getElementById('total-assets').textContent = stats.total_assets;
        document.getElementById('in-yard').textContent = stats.in_yard;
        document.getElementById('in-transit').textContent = stats.in_transit;
        document.getElementById('at-customer').textContent = stats.at_customer;
        document.getElementById('delivered').textContent = stats.delivered;
        document.getElementById('critical-alerts').textContent = stats.critical_alerts;
        document.getElementById('devices-online').textContent = stats.devices_online;
        document.getElementById('devices-offline').textContent = stats.devices_offline;
    }

    initializeMap() {
        if (this.map) {
            this.map.remove();
        }
        
        this.map = L.map('map').setView([3.1390, 101.6869], 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add asset markers
        this.data.assets.forEach(asset => {
            const color = this.getAssetStatusColor(asset.status);
            const marker = L.circleMarker([asset.lat, asset.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.7,
                radius: 8
            }).addTo(this.map);
            
            marker.bindPopup(`
                <div>
                    <strong>${asset.id}</strong><br>
                    ${asset.make} ${asset.model} (${asset.country})<br>
                    Status: ${asset.status}<br>
                    Driver: ${asset.current_driver || 'Unassigned'}<br>
                    Devices: ${asset.assigned_devices && asset.assigned_devices.length > 0 ? asset.assigned_devices.length : 0}
                </div>
            `);
            
            // Add click event to show asset details
            marker.on('click', () => {
                this.showAssetDetails(asset.id);
            });
        });
    }

    getAssetStatusColor(status) {
        switch(status) {
            case 'In Yard': return '#1FB8CD';
            case 'In Transit': return '#FFC185';
            case 'At Customer': return '#B4413C';
            case 'Delivered': return '#5D878F';
            default: return '#964325';
        }
    }

    renderActivityStream() {
        const activityList = document.getElementById('activity-list');
        const sortedEvents = this.data.events.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        activityList.innerHTML = sortedEvents.map(event => `
            <div class="activity-item">
                <div class="activity-time">${this.formatDateTime(event.time)}</div>
                <div class="activity-details">
                    <strong>${event.type}</strong> - ${event.details}
                </div>
            </div>
        `).join('');
    }

    renderAssetsTable() {
        const tableBody = document.getElementById('assets-table-body');
        const searchTerm = document.getElementById('asset-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('asset-filter')?.value || '';
        
        let filteredAssets = this.data.assets.filter(asset => {
            const matchesSearch = asset.id.toLowerCase().includes(searchTerm) || 
                                asset.make.toLowerCase().includes(searchTerm) || 
                                asset.model.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || asset.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
        
        tableBody.innerHTML = filteredAssets.map(asset => `
            <tr>
                <td>${asset.id}</td>
                <td>${asset.make} ${asset.model}</td>
                <td>${asset.year}</td>
                <td><span class="status status--${this.getStatusClass(asset.status)}">${asset.status}</span></td>
                <td>${asset.location}</td>
                <td>${asset.current_driver || 'Unassigned'}</td>
                <td>${asset.assigned_devices && asset.assigned_devices.length > 0 ? 
                    asset.assigned_devices.map(deviceId => `<span class="device-tag">${deviceId}</span>`).join(' ') : 
                    'No devices'
                }</td>
                <td>
                    <button class="btn btn--sm btn--outline" onclick="app.viewAssetDetails('${asset.id}')">View</button>
                    ${asset.status === 'In Yard' ? 
                        `<button class="btn btn--sm btn--primary" onclick="app.authorizeMovement('${asset.id}')">Authorize</button>` : 
                        `<button class="btn btn--sm btn--secondary" onclick="app.trackAsset('${asset.id}')">Track</button>`
                    }
                </td>
            </tr>
        `).join('');
    }

    renderDevicesTable() {
        const tableBody = document.getElementById('devices-table-body');
        const typeFilter = document.getElementById('device-filter')?.value || '';
        
        let filteredDevices = this.data.devices.filter(device => {
            return !typeFilter || device.type === typeFilter;
        });
        
        tableBody.innerHTML = filteredDevices.map(device => `
            <tr>
                <td>${device.id}</td>
                <td>${device.model}</td>
                <td>${device.type}</td>
                <td><span class="status status--${device.status === 'Online' ? 'success' : 'error'}">${device.status}</span></td>
                <td><span class="status status--${this.getHealthClass(device.health)}">${device.health}</span></td>
                <td>${device.assigned_assets && device.assigned_assets.length > 0 ? 
                    device.assigned_assets.join(', ') : 'Unassigned'
                }</td>
                <td>Available: ${device.available}/${device.quantity}</td>
                <td>
                    <button class="btn btn--sm btn--outline" onclick="app.viewDeviceDetails('${device.id}')">View</button>
                    ${device.available > 0 ? 
                        `<button class="btn btn--sm btn--primary" onclick="app.assignDevice('${device.id}')">Assign</button>` : 
                        `<button class="btn btn--sm btn--secondary disabled" title="No devices available">No Stock</button>`
                    }
                    <button class="btn btn--sm btn--secondary" onclick="app.healthCheckDevice('${device.id}')">Health Check</button>
                </td>
            </tr>
        `).join('');
        
        // Show unassigned devices banner
        const unassignedCount = this.data.devices.filter(d => d.available > 0 && (!d.assigned_assets || d.assigned_assets.length === 0)).length;
        const banner = document.getElementById('unassigned-devices-banner');
        if (unassignedCount > 0) {
            banner.style.display = 'block';
            banner.innerHTML = `⚠️ You have ${unassignedCount} device type${unassignedCount > 1 ? 's' : ''} with available units that can be configured. <button class="btn btn--sm btn--primary" onclick="app.openAddDeviceModal()" style="margin-left: var(--space-8);">Add Device</button>`;
        } else {
            banner.style.display = 'none';
        }
    }

    renderCameraGrid() {
        const cameraGrid = document.getElementById('camera-grid');
        const assetFilter = document.getElementById('camera-filter')?.value || '';
        
        // Populate camera filter options
        const filterSelect = document.getElementById('camera-filter');
        if (filterSelect && filterSelect.children.length === 1) {
            this.data.assets.forEach(asset => {
                const option = document.createElement('option');
                option.value = asset.id;
                option.textContent = `${asset.id} - ${asset.make} ${asset.model}`;
                filterSelect.appendChild(option);
            });
        }
        
        let cameraAssets = this.data.assets.filter(asset => {
            return !assetFilter || asset.id === assetFilter;
        });
        
        cameraGrid.innerHTML = cameraAssets.map(asset => `
            <div class="camera-card">
                <div class="camera-preview" onclick="app.openCameraModal('${asset.id}')">
                    📹 Live Feed - ${asset.id}
                </div>
                <div class="camera-info">
                    <div class="camera-title">${asset.make} ${asset.model}</div>
                    <div class="camera-status">Status: ${asset.status} | Driver: ${asset.current_driver}</div>
                </div>
            </div>
        `).join('');
    }

    renderIncidentsList() {
        const incidentsList = document.getElementById('incidents-list');
        const statusFilter = document.getElementById('incident-filter')?.value || '';
        const severityFilter = document.getElementById('severity-filter')?.value || '';
        
        let filteredIncidents = this.data.incidents.filter(incident => {
            const matchesStatus = !statusFilter || incident.status === statusFilter;
            const matchesSeverity = !severityFilter || incident.severity === severityFilter;
            return matchesStatus && matchesSeverity;
        });
        
        incidentsList.innerHTML = filteredIncidents.map(incident => `
            <div class="incident-item" onclick="app.toggleIncidentDetails('${incident.id}')">
                <div class="incident-header">
                    <div>
                        <span class="incident-id">${incident.id}</span>
                        <span class="status status--${this.getSeverityClass(incident.severity)}">${incident.severity}</span>
                        <span class="status status--${incident.status === 'Open' ? 'warning' : 'success'}">${incident.status}</span>
                    </div>
                    <div class="incident-time">${this.formatDateTime(incident.time)}</div>
                </div>
                <div class="incident-details">
                    <strong>${incident.type}</strong> - Related: ${incident.related}<br>
                    ${incident.notes}
                </div>
                <div class="incident-actions" id="actions-${incident.id}" style="display: none;">
                    ${incident.status === 'Open' ? 
                        `<button class="btn btn--sm btn--primary" onclick="app.resolveIncident('${incident.id}', event)">Resolve</button>` : 
                        `<button class="btn btn--sm btn--outline" onclick="app.reopenIncident('${incident.id}', event)">Reopen</button>`
                    }
                    <button class="btn btn--sm btn--secondary" onclick="app.addIncidentNote('${incident.id}', event)">Add Note</button>
                </div>
            </div>
        `).join('');
    }

    renderDriversGrid() {
        const driversGrid = document.getElementById('drivers-grid');
        const statusFilter = document.getElementById('driver-filter')?.value || '';
        
        let filteredDrivers = this.data.drivers.filter(driver => {
            return !statusFilter || driver.status === statusFilter;
        });
        
        driversGrid.innerHTML = filteredDrivers.map(driver => `
            <div class="driver-card" onclick="app.viewDriverProfile('${driver.name}')">
                <div class="driver-header">
                    <h4 class="driver-name">${driver.name}</h4>
                    <span class="status status--${this.getDriverStatusClass(driver.status)}">${driver.status}</span>
                </div>
                <div class="driver-info">
                    <div class="driver-detail">
                        <span class="driver-detail-label">License:</span>
                        <span>${driver.license}</span>
                    </div>
                    <div class="driver-detail">
                        <span class="driver-detail-label">Phone:</span>
                        <span>${driver.phone}</span>
                    </div>
                    <div class="driver-detail">
                        <span class="driver-detail-label">Safety Score:</span>
                        <span>⭐ ${driver.safety_score}/5.0</span>
                    </div>
                    <div class="driver-detail">
                        <span class="driver-detail-label">Assignment:</span>
                        <span>${driver.current_assignment || 'None'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderAnalytics() {
        this.renderAnalyticsCharts();
    }

    renderAnalyticsCharts() {
        // Asset Status Distribution (Pie Chart)
        const assetStatusCtx = document.getElementById('asset-status-chart')?.getContext('2d');
        if (assetStatusCtx) {
            if (this.charts.assetStatus) {
                this.charts.assetStatus.destroy();
            }
            
            const statusCounts = this.data.assets.reduce((acc, asset) => {
                acc[asset.status] = (acc[asset.status] || 0) + 1;
                return acc;
            }, {});
            
            this.charts.assetStatus = new Chart(assetStatusCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        data: Object.values(statusCounts),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Device Health (Doughnut Chart)
        const deviceHealthCtx = document.getElementById('device-health-chart')?.getContext('2d');
        if (deviceHealthCtx) {
            if (this.charts.deviceHealth) {
                this.charts.deviceHealth.destroy();
            }
            
            const healthCounts = this.data.devices.reduce((acc, device) => {
                acc[device.health] = (acc[device.health] || 0) + 1;
                return acc;
            }, {});
            
            this.charts.deviceHealth = new Chart(deviceHealthCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(healthCounts),
                    datasets: [{
                        data: Object.values(healthCounts),
                        backgroundColor: ['#DB4545', '#D2BA4C', '#964325']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Monthly Incidents (Bar Chart)
        const incidentsCtx = document.getElementById('incidents-chart')?.getContext('2d');
        if (incidentsCtx) {
            if (this.charts.incidents) {
                this.charts.incidents.destroy();
            }
            
            this.charts.incidents = new Chart(incidentsCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    datasets: [{
                        label: 'Incidents',
                        data: [2, 1, 3, 2, 1, 4, 2, 3, 1, 2],
                        backgroundColor: '#944454'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Driver Performance (Line Chart)
        const performanceCtx = document.getElementById('performance-chart')?.getContext('2d');
        if (performanceCtx) {
            if (this.charts.performance) {
                this.charts.performance.destroy();
            }
            
            this.charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Average Safety Score',
                        data: [4.5, 4.7, 4.6, 4.8],
                        borderColor: '#13343B',
                        backgroundColor: 'rgba(19, 52, 59, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5
                        }
                    }
                }
            });
        }
    }

    renderReports() {
        const reportsGrid = document.getElementById('reports-grid');
        
        reportsGrid.innerHTML = this.data.report_templates.map(report => `
            <div class="report-card">
                <div class="report-header">
                    <div>
                        <h4 class="report-title">${report.name}</h4>
                    </div>
                </div>
                <div class="report-description">${report.description}</div>
                <div class="report-last-run">Last run: ${report.last_run}</div>
                <div class="report-actions">
                    <button class="btn btn--sm btn--primary" onclick="app.runReport('${report.name}')">Run Now</button>
                    <button class="btn btn--sm btn--secondary" onclick="app.downloadReport('${report.name}')">Download</button>
                    <button class="btn btn--sm btn--outline" onclick="app.scheduleReport('${report.name}')">Schedule</button>
                </div>
            </div>
        `).join('');
    }

    // New functionality methods
    openAddAssetModal() {
        const modalContent = `
            <div class="add-asset-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Asset ID *</label>
                        <input type="text" class="form-control" id="new-asset-id" placeholder="e.g., C004" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Year *</label>
                        <input type="number" class="form-control" id="new-asset-year" placeholder="2024" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Make *</label>
                        <input type="text" class="form-control" id="new-asset-make" placeholder="Toyota" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Model *</label>
                        <input type="text" class="form-control" id="new-asset-model" placeholder="Camry" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Country *</label>
                        <select class="form-control" id="new-asset-country" required>
                            <option value="">Select Country</option>
                            ${this.data.countries.map(country => `<option value="${country}">${country}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select class="form-control" id="new-asset-status">
                            <option value="In Yard">In Yard</option>
                            <option value="In Transit">In Transit</option>
                            <option value="At Customer">At Customer</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Location</label>
                        <input type="text" class="form-control" id="new-asset-location" placeholder="Yard 1" value="Yard 1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Assigned Driver</label>
                        <select class="form-control" id="new-asset-driver">
                            <option value="">No Driver</option>
                            ${this.data.drivers.filter(d => !d.current_assignment).map(d => `<option value="${d.name}">${d.name} (Score: ${d.safety_score})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group full-width">
                        <label class="form-label">Assigned Devices (Select 2-3 devices)</label>
                        <div class="device-selection" id="device-selection">
                            ${this.data.devices.filter(d => d.available > 0).map(d => `
                                <div class="checkbox-item">
                                    <input type="checkbox" id="device-${d.id}" name="devices" value="${d.id}" 
                                           ${d.available === 0 ? 'disabled' : ''}
                                           onchange="app.validateDeviceSelection()">
                                    <label for="device-${d.id}">
                                        ${d.id} - ${d.model} (${d.type}) - Available: ${d.available}/${d.quantity}
                                        ${d.available === 0 ? ' (Out of Stock)' : ''}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                        <div id="device-selection-feedback" class="form-text">Select 2-3 devices to assign to this vehicle for optimal tracking</div>
                    </div>
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn--primary" onclick="app.addAsset()">Add Asset</button>
        `;
        
        this.openModal('Add New Asset', modalContent, footerContent);
    }
    
    addAsset() {
        const id = document.getElementById('new-asset-id').value.trim();
        const make = document.getElementById('new-asset-make').value.trim();
        const model = document.getElementById('new-asset-model').value.trim();
        const year = parseInt(document.getElementById('new-asset-year').value);
        const country = document.getElementById('new-asset-country').value;
        const status = document.getElementById('new-asset-status').value;
        const location = document.getElementById('new-asset-location').value.trim();
        const driver = document.getElementById('new-asset-driver').value;
        
        // Get selected devices
        const selectedDevices = Array.from(document.querySelectorAll('input[name="devices"]:checked')).map(cb => cb.value);
        
        // Validation
        if (!id || !make || !model || !year || !country) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Check if asset ID already exists
        if (this.data.assets.find(a => a.id === id)) {
            this.showToast('Asset ID already exists', 'error');
            return;
        }
        
        // Validate device selection (2-3 devices maximum)
        if (selectedDevices.length > 3) {
            this.showToast('You can assign maximum 3 devices per asset', 'error');
            return;
        }
        
        // Check device availability
        for (const deviceId of selectedDevices) {
            const device = this.data.devices.find(d => d.id === deviceId);
            if (!device || device.available <= 0) {
                this.showToast(`Device ${deviceId} is not available`, 'error');
                return;
            }
        }
        
        // Create new asset with default coordinates
        const newAsset = {
            id,
            make,
            model,
            year,
            country,
            status,
            location,
            assigned_devices: selectedDevices,
            current_driver: driver || null,
            lat: 3.1390, // Default coordinates for Malaysia
            lng: 101.6869
        };
        
        // Update device assignments and reduce available count
        selectedDevices.forEach(deviceId => {
            const device = this.data.devices.find(d => d.id === deviceId);
            if (device) {
                if (!device.assigned_assets) device.assigned_assets = [];
                device.assigned_assets.push(id);
                device.available = Math.max(0, device.available - 1);
            }
        });
        
        // Update driver assignment if selected
        if (driver) {
            const driverObj = this.data.drivers.find(d => d.name === driver);
            if (driverObj) {
                driverObj.current_assignment = id;
            }
        }
        
        this.data.assets.push(newAsset);
        
        // Update KPI stats
        this.data.kpi_stats.total_assets++;
        if (status === 'In Yard') this.data.kpi_stats.in_yard++;
        else if (status === 'In Transit') this.data.kpi_stats.in_transit++;
        else if (status === 'At Customer') this.data.kpi_stats.at_customer++;
        else if (status === 'Delivered') this.data.kpi_stats.delivered++;
        
        // Add events for each device assignment
        selectedDevices.forEach(deviceId => {
            this.data.events.push({
                time: new Date().toISOString(),
                type: 'Device Assigned',
                asset: id,
                device: deviceId,
                details: `Device ${deviceId} assigned to asset ${id}`
            });
        });
        
        // Add asset creation event
        this.data.events.push({
            time: new Date().toISOString(),
            type: 'Asset Added',
            asset: id,
            driver: driver || 'System',
            details: `New asset ${id} (${make} ${model}) from ${country} added with ${selectedDevices.length} device(s)`
        });
        
        this.updateAllViews();
        this.closeModal();
        this.showToast('Asset added successfully!', 'success');
    }
    
    openAddDeviceModal() {
        const modalContent = `
            <div class="add-device-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Device ID *</label>
                        <input type="text" class="form-control" id="new-device-id" placeholder="e.g., D1006" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Model *</label>
                        <input type="text" class="form-control" id="new-device-model" placeholder="GeoTrack Pro" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Type *</label>
                        <select class="form-control" id="new-device-type" required>
                            <option value="">Select Type</option>
                            <option value="GPS">GPS</option>
                            <option value="Camera">Camera</option>
                            <option value="Telematics">Telematics</option>
                            <option value="Sensor">Sensor</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Serial Number *</label>
                        <input type="text" class="form-control" id="new-device-serial" placeholder="GT-333C" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Quantity (Number of Devices) *</label>
                        <input type="number" class="form-control" id="new-device-quantity" placeholder="100" min="1" required>
                        <small class="form-text">Total number of devices of this type available</small>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Firmware Version</label>
                        <input type="text" class="form-control" id="new-device-firmware" placeholder="1.0.0" value="1.0.0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select class="form-control" id="new-device-status">
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Health</label>
                        <select class="form-control" id="new-device-health">
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn--primary" onclick="app.addDevice()">Add Device</button>
        `;
        
        this.openModal('Add New Device', modalContent, footerContent);
    }
    
    addDevice() {
        const id = document.getElementById('new-device-id').value.trim();
        const model = document.getElementById('new-device-model').value.trim();
        const type = document.getElementById('new-device-type').value;
        const serial = document.getElementById('new-device-serial').value.trim();
        const quantity = parseInt(document.getElementById('new-device-quantity').value);
        const firmware = document.getElementById('new-device-firmware').value.trim() || '1.0.0';
        const status = document.getElementById('new-device-status').value;
        const health = document.getElementById('new-device-health').value;
        
        // Validation
        if (!id || !model || !type || !serial || !quantity || quantity <= 0) {
            this.showToast('Please fill in all required fields with valid values', 'error');
            return;
        }
        
        // Check if device ID already exists
        if (this.data.devices.find(d => d.id === id)) {
            this.showToast('Device ID already exists', 'error');
            return;
        }
        
        // Create new device
        const newDevice = {
            id,
            model,
            type,
            serial,
            firmware,
            quantity,
            available: quantity, // All devices are available initially
            assigned_assets: [],
            status,
            health,
            last_active: new Date().toISOString().split('T')[0]
        };
        
        this.data.devices.push(newDevice);
        
        // Update KPI stats
        if (status === 'Online') this.data.kpi_stats.devices_online++;
        else this.data.kpi_stats.devices_offline++;
        
        // Add event
        this.data.events.push({
            time: new Date().toISOString(),
            type: 'Device Added',
            asset: 'System',
            device: id,
            details: `New ${type} device type ${id} (${model}) added with ${quantity} units available`
        });
        
        this.updateAllViews();
        this.closeModal();
        this.showToast('Device added successfully!', 'success');
    }
    
    openAddDriverModal() {
        const modalContent = `
            <div class="add-driver-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Driver Name *</label>
                        <input type="text" class="form-control" id="new-driver-name" placeholder="John Doe" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">License Number *</label>
                        <input type="text" class="form-control" id="new-driver-license" placeholder="MYS334455" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone Number *</label>
                        <input type="tel" class="form-control" id="new-driver-phone" placeholder="+60123456789" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Initial Safety Score</label>
                        <input type="number" step="0.1" min="1" max="5" class="form-control" id="new-driver-score" placeholder="4.0" value="4.0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <select class="form-control" id="new-driver-status">
                            <option value="On Duty">On Duty</option>
                            <option value="Off Duty">Off Duty</option>
                            <option value="In Transit">In Transit</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Assign to Asset</label>
                        <select class="form-control" id="new-driver-asset">
                            <option value="">No Assignment</option>
                            ${this.data.assets.filter(a => !this.data.drivers.find(d => d.current_assignment === a.id)).map(a => `<option value="${a.id}">${a.id} - ${a.make} ${a.model}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn--primary" onclick="app.addDriver()">Add Driver</button>
        `;
        
        this.openModal('Add New Driver', modalContent, footerContent);
    }
    
    addDriver() {
        const name = document.getElementById('new-driver-name').value.trim();
        const license = document.getElementById('new-driver-license').value.trim();
        const phone = document.getElementById('new-driver-phone').value.trim();
        const safetyScore = parseFloat(document.getElementById('new-driver-score').value) || 4.0;
        const status = document.getElementById('new-driver-status').value;
        const assignedAsset = document.getElementById('new-driver-asset').value;
        
        // Validation
        if (!name || !license || !phone) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Check if driver name already exists
        if (this.data.drivers.find(d => d.name === name)) {
            this.showToast('Driver name already exists', 'error');
            return;
        }
        
        // Create new driver
        const newDriver = {
            name,
            license,
            phone,
            safety_score: safetyScore,
            current_assignment: assignedAsset || null,
            status
        };
        
        // Update asset assignment if selected
        if (assignedAsset) {
            const asset = this.data.assets.find(a => a.id === assignedAsset);
            if (asset) {
                asset.current_driver = name;
            }
        }
        
        this.data.drivers.push(newDriver);
        
        // Add event
        this.data.events.push({
            time: new Date().toISOString(),
            type: 'Driver Added',
            asset: assignedAsset || 'System',
            driver: name,
            details: `New driver ${name} added${assignedAsset ? ' and assigned to ' + assignedAsset : ''}`
        });
        
        this.updateAllViews();
        this.closeModal();
        this.showToast('Driver added successfully!', 'success');
    }
    
    showAssetDetails(assetId) {
        const asset = this.data.assets.find(a => a.id === assetId);
        if (!asset) return;
        
        const devices = asset.assigned_devices ? this.data.devices.filter(d => asset.assigned_devices.includes(d.id)) : [];
        const driver = this.data.drivers.find(d => d.name === asset.current_driver);
        const incidents = this.data.incidents.filter(i => i.related === assetId);
        const events = this.data.events.filter(e => e.asset === assetId).slice(0, 5);
        
        const detailsContent = `
            <div class="asset-overview">
                <h4>${asset.make} ${asset.model} (${asset.year})</h4>
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Asset ID:</span>
                    <span class="asset-detail-value">${asset.id}</span>
                </div>
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Status:</span>
                    <span class="asset-detail-value"><span class="status status--${this.getStatusClass(asset.status)}">${asset.status}</span></span>
                </div>
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Location:</span>
                    <span class="asset-detail-value">${asset.location}</span>
                </div>
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Country:</span>
                    <span class="asset-detail-value">${asset.country}</span>
                </div>
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Driver:</span>
                    <span class="asset-detail-value">${asset.current_driver || 'Unassigned'}</span>
                </div>
                ${driver ? `
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Driver Score:</span>
                    <span class="asset-detail-value">⭐ ${driver.safety_score}/5.0</span>
                </div>
                ` : ''}
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Devices:</span>
                    <span class="asset-detail-value">
                        ${devices.length > 0 ? 
                            devices.map(d => `<span class="device-tag">${d.id} (${d.type})</span>`).join('') : 
                            'No devices assigned'
                        }
                    </span>
                </div>
                ${devices.length > 0 ? `
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Device Health:</span>
                    <span class="asset-detail-value">
                        ${devices.map(d => `${d.id}: <span class="status status--${this.getHealthClass(d.health)}">${d.health}</span>`).join(', ')}
                    </span>
                </div>
                ` : ''}
                <div class="asset-detail-item">
                    <span class="asset-detail-label">Coordinates:</span>
                    <span class="asset-detail-value">${asset.lat}, ${asset.lng}</span>
                </div>
                
                ${events.length > 0 ? `
                <div style="margin-top: var(--space-16); padding-top: var(--space-16); border-top: 1px solid var(--color-card-border-inner);">
                    <h5 style="margin-bottom: var(--space-12); color: var(--color-text);">Recent Activity</h5>
                    ${events.map(e => `
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-4);">
                        ${this.formatDateTime(e.time)} - ${e.type}
                    </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${incidents.filter(i => i.status === 'Open').length > 0 ? `
                <div style="margin-top: var(--space-16); padding-top: var(--space-16); border-top: 1px solid var(--color-card-border-inner);">
                    <h5 style="margin-bottom: var(--space-12); color: var(--color-error);">Open Incidents (${incidents.filter(i => i.status === 'Open').length})</h5>
                    ${incidents.filter(i => i.status === 'Open').map(i => `
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-4);">
                        ${i.id} - ${i.type} (${i.severity})
                    </div>
                    `).join('')}
                </div>
                ` : ''}
                
                <div class="asset-actions">
                    ${asset.status === 'In Yard' ? 
                        `<button class="btn btn--sm btn--primary" onclick="app.authorizeMovement('${asset.id}')">Authorize Movement</button>` : 
                        `<button class="btn btn--sm btn--secondary" onclick="app.trackAsset('${asset.id}')">Track Live</button>`
                    }
                    <button class="btn btn--sm btn--outline" onclick="app.viewAssetDetails('${asset.id}')">Full Details</button>
                    <button class="btn btn--sm btn--outline" onclick="app.openCameraModal('${asset.id}')">Camera</button>
                </div>
            </div>
        `;
        
        document.getElementById('asset-details-content').innerHTML = detailsContent;
        document.getElementById('asset-details-panel').style.display = 'block';
        document.querySelector('.activity-stream').style.display = 'none';
    }
    
    closeAssetDetails() {
        document.getElementById('asset-details-panel').style.display = 'none';
        document.querySelector('.activity-stream').style.display = 'block';
    }

    // Action handlers
    viewAssetDetails(assetId) {
        const asset = this.data.assets.find(a => a.id === assetId);
        const devices = asset.assigned_devices ? this.data.devices.filter(d => asset.assigned_devices.includes(d.id)) : [];
        const incidents = this.data.incidents.filter(i => i.related === assetId);
        
        const modalContent = `
            <div class="modal-tabs">
                <button class="tab-btn active" onclick="app.switchTab('overview')">Overview</button>
                <button class="tab-btn" onclick="app.switchTab('location')">Location</button>
                <button class="tab-btn" onclick="app.switchTab('movement')">Movement</button>
                <button class="tab-btn" onclick="app.switchTab('cameras')">Cameras</button>
                <button class="tab-btn" onclick="app.switchTab('incidents')">Incidents</button>
            </div>
            <div class="tab-content">
                <div id="tab-overview" class="tab-panel active">
                    <div class="asset-overview">
                        <h4>${asset.make} ${asset.model} (${asset.year})</h4>
                        <div class="detail-grid">
                            <div><strong>Asset ID:</strong> ${asset.id}</div>
                            <div><strong>Country:</strong> ${asset.country}</div>
                            <div><strong>Status:</strong> <span class="status status--${this.getStatusClass(asset.status)}">${asset.status}</span></div>
                            <div><strong>Location:</strong> ${asset.location}</div>
                            <div><strong>Driver:</strong> ${asset.current_driver || 'Unassigned'}</div>
                            <div><strong>Devices:</strong> ${devices.length > 0 ? devices.map(d => `${d.id} (${d.type})`).join(', ') : 'No devices'}</div>
                            <div><strong>Device Health:</strong> ${devices.length > 0 ? devices.map(d => `${d.id}: ${d.health}`).join(', ') : 'N/A'}</div>
                        </div>
                    </div>
                </div>
                <div id="tab-location" class="tab-panel">
                    <div>Current location: ${asset.location}</div>
                    <div>Coordinates: ${asset.lat}, ${asset.lng}</div>
                </div>
                <div id="tab-movement" class="tab-panel">
                    <div>Recent movements will be displayed here</div>
                </div>
                <div id="tab-cameras" class="tab-panel">
                    <div>Camera feeds and snapshots will be displayed here</div>
                </div>
                <div id="tab-incidents" class="tab-panel">
                    ${incidents.length > 0 ? 
                        incidents.map(i => `<div class="incident-summary">
                            <strong>${i.id}</strong> - ${i.type} (${i.severity})<br>
                            <small>${this.formatDateTime(i.time)}</small>
                        </div>`).join('') : 
                        '<div>No incidents recorded for this asset</div>'
                    }
                </div>
            </div>
        `;
        
        this.openModal(`Asset Details - ${assetId}`, modalContent);
    }

    authorizeMovement(assetId) {
        const asset = this.data.assets.find(a => a.id === assetId);
        
        const modalContent = `
            <div class="authorize-movement">
                <p>Authorize movement for <strong>${asset.id} - ${asset.make} ${asset.model}</strong></p>
                <div class="form-group">
                    <label class="form-label">Destination</label>
                    <select class="form-control" id="destination">
                        <option value="Customer A">Customer A</option>
                        <option value="Customer B">Customer B</option>
                        <option value="Service Center">Service Center</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Driver</label>
                    <select class="form-control" id="driver-assignment">
                        ${this.data.drivers.map(d => `<option value="${d.name}">${d.name} (Safety: ${d.safety_score})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="movement-notes" rows="3" placeholder="Add any special instructions..."></textarea>
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn--primary" onclick="app.confirmAuthorization('${assetId}')">Authorize Movement</button>
        `;
        
        this.openModal('Authorize Movement', modalContent, footerContent);
    }

    confirmAuthorization(assetId) {
        const destination = document.getElementById('destination').value;
        const driver = document.getElementById('driver-assignment').value;
        const notes = document.getElementById('movement-notes').value;
        
        // Update asset status
        const asset = this.data.assets.find(a => a.id === assetId);
        asset.status = 'In Transit';
        asset.location = `En route to ${destination}`;
        asset.current_driver = driver;
        
        // Add event
        this.data.events.push({
            time: new Date().toISOString(),
            type: 'Movement Authorized',
            asset: assetId,
            driver: driver,
            details: `Movement authorized to ${destination}. ${notes ? 'Notes: ' + notes : ''}`
        });
        
        // Update KPI stats
        this.data.kpi_stats.in_yard--;
        this.data.kpi_stats.in_transit++;
        
        this.updateAllViews();
        this.closeModal();
        this.showToast('Movement authorized successfully!', 'success');
    }

    trackAsset(assetId) {
        const asset = this.data.assets.find(a => a.id === assetId);
        
        const modalContent = `
            <div class="asset-tracking">
                <h4>Live Tracking - ${asset.id}</h4>
                <div class="tracking-info">
                    <div><strong>Status:</strong> ${asset.status}</div>
                    <div><strong>Location:</strong> ${asset.location}</div>
                    <div><strong>Driver:</strong> ${asset.current_driver}</div>
                    <div><strong>Last Update:</strong> ${new Date().toLocaleString()}</div>
                </div>
                <div class="tracking-metrics">
                    <div class="metric">
                        <span class="metric-label">Speed</span>
                        <span class="metric-value">65 km/h</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">ETA</span>
                        <span class="metric-value">2.5 hours</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Distance</span>
                        <span class="metric-value">145 km</span>
                    </div>
                </div>
                <div class="live-indicators">
                    <div class="indicator">
                        <span class="status status--success">GPS: Active</span>
                    </div>
                    <div class="indicator">
                        <span class="status status--success">Camera: Recording</span>
                    </div>
                    <div class="indicator">
                        <span class="status status--info">Driver: Compliant</span>
                    </div>
                </div>
            </div>
        `;
        
        this.openModal(`Live Tracking - ${assetId}`, modalContent);
    }

    assignDevice(deviceId) {
        const device = this.data.devices.find(d => d.id === deviceId);
        
        if (!device || device.available <= 0) {
            this.showToast('No devices of this type available for assignment', 'error');
            return;
        }
        
        // Get assets that can accept more devices (less than 3 devices assigned)
        const availableAssets = this.data.assets.filter(a => {
            const assignedDevicesCount = a.assigned_devices ? a.assigned_devices.length : 0;
            return assignedDevicesCount < 3;
        });
        
        if (availableAssets.length === 0) {
            this.showToast('All assets have maximum devices assigned (3 devices per asset)', 'error');
            return;
        }
        
        const modalContent = `
            <div class="device-assignment">
                <p>Assign <strong>${deviceId}</strong> device to an asset</p>
                <p><small>Available devices: ${device.available}/${device.quantity}</small></p>
                <div class="form-group">
                    <label class="form-label">Select Asset</label>
                    <select class="form-control" id="asset-assignment">
                        ${availableAssets.map(a => {
                            const deviceCount = a.assigned_devices ? a.assigned_devices.length : 0;
                            return `<option value="${a.id}">${a.id} - ${a.make} ${a.model} (${deviceCount}/3 devices)</option>`;
                        }).join('')}
                    </select>
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn--primary" onclick="app.confirmDeviceAssignment('${deviceId}')">Assign Device</button>
        `;
        
        this.openModal('Assign Device', modalContent, footerContent);
    }
    
    openScheduleReportModal() {
        const modalContent = `
            <div class="schedule-custom-report">
                <div class="form-group">
                    <label class="form-label">Report Type</label>
                    <select class="form-control" id="custom-report-type">
                        <option value="Inventory">Inventory Report</option>
                        <option value="Movement">Movement Report</option>
                        <option value="Device Health">Device Health Report</option>
                        <option value="Incidents">Incidents Report</option>
                        <option value="Performance">Performance Report</option>
                        <option value="Occupancy">Occupancy Report</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Frequency</label>
                    <select class="form-control" id="custom-report-frequency">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="custom-report-start-date">
                </div>
                <div class="form-group">
                    <label class="form-label">Email Recipients</label>
                    <input type="email" class="form-control" id="custom-report-recipients" placeholder="admin@company.com">
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn--primary" onclick="app.confirmCustomScheduleReport()">Schedule Report</button>
        `;
        
        this.openModal('Schedule Custom Report', modalContent, footerContent);
    }
    
    confirmCustomScheduleReport() {
        const reportType = document.getElementById('custom-report-type').value;
        const frequency = document.getElementById('custom-report-frequency').value;
        const startDate = document.getElementById('custom-report-start-date').value;
        const recipients = document.getElementById('custom-report-recipients').value;
        
        this.closeModal();
        this.showToast(`${reportType} scheduled ${frequency} starting ${startDate}`, 'success');
    }

    confirmDeviceAssignment(deviceId) {
        const assetId = document.getElementById('asset-assignment').value;
        
        // Validate device availability
        const device = this.data.devices.find(d => d.id === deviceId);
        if (!device || device.available <= 0) {
            this.showToast('Device not available for assignment', 'error');
            return;
        }
        
        // Validate asset device limit
        const asset = this.data.assets.find(a => a.id === assetId);
        if (!asset) {
            this.showToast('Asset not found', 'error');
            return;
        }
        
        const currentDeviceCount = asset.assigned_devices ? asset.assigned_devices.length : 0;
        if (currentDeviceCount >= 3) {
            this.showToast('Asset already has maximum devices assigned (3)', 'error');
            return;
        }
        
        // Update device assignment
        if (!device.assigned_assets) device.assigned_assets = [];
        device.assigned_assets.push(assetId);
        device.available = Math.max(0, device.available - 1);
        
        // Update asset device assignment
        if (!asset.assigned_devices) asset.assigned_devices = [];
        asset.assigned_devices.push(deviceId);
        
        // Add event
        this.data.events.push({
            time: new Date().toISOString(),
            type: 'Device Assigned',
            asset: assetId,
            device: deviceId,
            details: `Device ${deviceId} assigned to asset ${assetId}. Available devices: ${device.available}/${device.quantity}`
        });
        
        this.updateAllViews();
        this.closeModal();
        this.showToast('Device assigned successfully!', 'success');
    }

    resolveIncident(incidentId, event) {
        event.stopPropagation();
        
        const incident = this.data.incidents.find(i => i.id === incidentId);
        incident.status = 'Resolved';
        
        this.data.kpi_stats.critical_alerts = Math.max(0, this.data.kpi_stats.critical_alerts - 1);
        
        this.updateAllViews();
        this.showToast('Incident resolved successfully!', 'success');
    }

    addIncidentNote(incidentId, event) {
        event.stopPropagation();
        
        const modalContent = `
            <div class="incident-note">
                <p>Add note to incident <strong>${incidentId}</strong></p>
                <div class="form-group">
                    <label class="form-label">Note</label>
                    <textarea class="form-control" id="incident-note" rows="4" placeholder="Add your note here..."></textarea>
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn--primary" onclick="app.saveIncidentNote('${incidentId}')">Save Note</button>
        `;
        
        this.openModal('Add Note', modalContent, footerContent);
    }

    saveIncidentNote(incidentId) {
        const note = document.getElementById('incident-note').value;
        
        if (note.trim()) {
            const incident = this.data.incidents.find(i => i.id === incidentId);
            incident.notes += ` | Note: ${note}`;
            
            this.updateAllViews();
            this.closeModal();
            this.showToast('Note added successfully!', 'success');
        }
    }

    toggleIncidentDetails(incidentId) {
        const actionsElement = document.getElementById(`actions-${incidentId}`);
        const isVisible = actionsElement.style.display === 'block';
        
        // Hide all other expanded incidents
        document.querySelectorAll('.incident-actions').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.incident-item').forEach(el => {
            el.classList.remove('incident-expanded');
        });
        
        if (!isVisible) {
            actionsElement.style.display = 'block';
            actionsElement.parentElement.classList.add('incident-expanded');
        }
    }

    openCameraModal(assetId) {
        const asset = this.data.assets.find(a => a.id === assetId);
        
        const modalContent = `
            <div class="camera-modal">
                <div class="camera-feed">
                    <div class="live-feed-placeholder">
                        📹 Live Camera Feed - ${assetId}<br>
                        <small>Camera feed would be displayed here in a real implementation</small>
                    </div>
                </div>
                <div class="camera-controls">
                    <button class="btn btn--sm btn--primary">Take Snapshot</button>
                    <button class="btn btn--sm btn--secondary">Start Recording</button>
                    <button class="btn btn--sm btn--outline">View History</button>
                </div>
            </div>
        `;
        
        this.openModal(`Camera Feed - ${assetId}`, modalContent);
    }

    viewDriverProfile(driverName) {
        const driver = this.data.drivers.find(d => d.name === driverName);
        const driverIncidents = this.data.incidents.filter(i => i.related === driver.current_assignment);
        
        const modalContent = `
            <div class="driver-profile">
                <div class="driver-header">
                    <h3>${driver.name}</h3>
                    <span class="status status--${this.getDriverStatusClass(driver.status)}">${driver.status}</span>
                </div>
                <div class="driver-details">
                    <div class="detail-section">
                        <h4>Contact Information</h4>
                        <div><strong>License:</strong> ${driver.license}</div>
                        <div><strong>Phone:</strong> ${driver.phone}</div>
                    </div>
                    <div class="detail-section">
                        <h4>Performance</h4>
                        <div><strong>Safety Score:</strong> ⭐ ${driver.safety_score}/5.0</div>
                        <div><strong>Current Assignment:</strong> ${driver.current_assignment || 'None'}</div>
                        <div><strong>Status:</strong> ${driver.status}</div>
                    </div>
                    <div class="detail-section">
                        <h4>Recent Incidents</h4>
                        ${driverIncidents.length > 0 ? 
                            driverIncidents.map(i => `<div class="incident-summary">
                                <strong>${i.id}</strong> - ${i.type} (${i.severity})<br>
                                <small>${this.formatDateTime(i.time)}</small>
                            </div>`).join('') : 
                            '<div>No recent incidents</div>'
                        }
                    </div>
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Close</button>
            <button class="btn btn--secondary">Reassign Asset</button>
            <button class="btn btn--primary">Update Profile</button>
        `;
        
        this.openModal(`Driver Profile - ${driverName}`, modalContent, footerContent);
    }

    runReport(reportName) {
        // Simulate report generation
        this.showToast(`Generating ${reportName} report...`, 'info');
        
        setTimeout(() => {
            const report = this.data.report_templates.find(r => r.name === reportName);
            report.last_run = new Date().toISOString().split('T')[0];
            
            this.updateAllViews();
            this.showToast(`${reportName} report generated successfully!`, 'success');
        }, 2000);
    }

    downloadReport(reportName) {
        this.showToast(`Downloading ${reportName} report...`, 'info');
    }

    scheduleReport(reportName) {
        const modalContent = `
            <div class="schedule-report">
                <p>Schedule <strong>${reportName}</strong> report</p>
                <div class="form-group">
                    <label class="form-label">Frequency</label>
                    <select class="form-control" id="report-frequency">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="report-start-date">
                </div>
                <div class="form-group">
                    <label class="form-label">Email Recipients</label>
                    <input type="email" class="form-control" id="report-recipients" placeholder="admin@company.com">
                </div>
            </div>
        `;
        
        const footerContent = `
            <button class="btn btn--outline" onclick="app.closeModal()">Cancel</button>
            <button class="btn btn--primary" onclick="app.confirmScheduleReport('${reportName}')">Schedule Report</button>
        `;
        
        this.openModal('Schedule Report', modalContent, footerContent);
    }

    confirmScheduleReport(reportName) {
        const frequency = document.getElementById('report-frequency').value;
        const startDate = document.getElementById('report-start-date').value;
        const recipients = document.getElementById('report-recipients').value;
        
        this.closeModal();
        this.showToast(`${reportName} report scheduled ${frequency} starting ${startDate}`, 'success');
    }

    healthCheckDevice(deviceId) {
        const device = this.data.devices.find(d => d.id === deviceId);
        
        if (!device) {
            this.showToast('Device not found', 'error');
            return;
        }
        
        // Simulate health check
        this.showToast(`Running health check for device ${deviceId}...`, 'info');
        
        setTimeout(() => {
            // Random health status for simulation
            const healthStatuses = ['Excellent', 'Good', 'Fair', 'Poor'];
            const newHealth = healthStatuses[Math.floor(Math.random() * healthStatuses.length)];
            
            device.health = newHealth;
            device.last_active = new Date().toISOString().split('T')[0];
            
            // Add event
            this.data.events.push({
                time: new Date().toISOString(),
                type: 'Health Check',
                asset: device.assigned_assets.length > 0 ? device.assigned_assets[0] : 'System',
                device: deviceId,
                details: `Health check completed for device ${deviceId}. Status: ${newHealth}`
            });
            
            this.updateAllViews();
            this.showToast(`Health check completed! Device ${deviceId} status: ${newHealth}`, 'success');
        }, 2000);
    }
    
    unassignDevice(deviceId, assetId) {
        const device = this.data.devices.find(d => d.id === deviceId);
        const asset = this.data.assets.find(a => a.id === assetId);
        
        if (!device || !asset) {
            this.showToast('Device or asset not found', 'error');
            return;
        }
        
        // Remove asset from device's assigned_assets
        if (device.assigned_assets) {
            device.assigned_assets = device.assigned_assets.filter(id => id !== assetId);
            device.available = Math.min(device.quantity, device.available + 1);
        }
        
        // Remove device from asset's assigned_devices
        if (asset.assigned_devices) {
            asset.assigned_devices = asset.assigned_devices.filter(id => id !== deviceId);
        }
        
        // Add event
        this.data.events.push({
            time: new Date().toISOString(),
            type: 'Device Unassigned',
            asset: assetId,
            device: deviceId,
            details: `Device ${deviceId} unassigned from asset ${assetId}. Available devices: ${device.available}/${device.quantity}`
        });
        
        this.updateAllViews();
        this.showToast('Device unassigned successfully!', 'success');
    }

    validateDeviceSelection() {
        const selectedDevices = Array.from(document.querySelectorAll('input[name="devices"]:checked'));
        const feedback = document.getElementById('device-selection-feedback');
        
        if (selectedDevices.length === 0) {
            feedback.textContent = 'Select 2-3 devices to assign to this vehicle for optimal tracking';
            feedback.style.color = 'var(--color-text-secondary)';
        } else if (selectedDevices.length === 1) {
            feedback.textContent = 'Consider adding 1-2 more devices for comprehensive tracking';
            feedback.style.color = 'var(--color-warning)';
        } else if (selectedDevices.length >= 2 && selectedDevices.length <= 3) {
            feedback.textContent = `✓ ${selectedDevices.length} devices selected - Good for comprehensive tracking`;
            feedback.style.color = 'var(--color-success)';
        } else {
            feedback.textContent = `⚠ Maximum 3 devices allowed per asset (${selectedDevices.length} selected)`;
            feedback.style.color = 'var(--color-error)';
        }
    }

    exportChartsAsPDF() {
        this.showToast('Exporting charts as PDF...', 'info');
        
        setTimeout(() => {
            this.showToast('Charts exported successfully!', 'success');
        }, 2000);
    }

    // Utility methods
    openModal(title, content, footer = '') {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-footer').innerHTML = footer;
        document.getElementById('modal-overlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    }

    switchTab(tabName) {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to selected tab and panel
        event.target.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        document.getElementById('toast-container').appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    formatDateTime(dateTimeString) {
        return new Date(dateTimeString).toLocaleString();
    }

    getStatusClass(status) {
        switch(status) {
            case 'In Yard': return 'info';
            case 'In Transit': return 'warning';
            case 'At Customer': return 'success';
            case 'Delivered': return 'success';
            default: return 'error';
        }
    }

    getHealthClass(health) {
        switch(health) {
            case 'Excellent': return 'success';
            case 'Good': return 'success';
            case 'Fair': return 'warning';
            case 'Poor': return 'error';
            default: return 'info';
        }
    }

    getSeverityClass(severity) {
        switch(severity) {
            case 'Low': return 'info';
            case 'Medium': return 'warning';
            case 'High': return 'error';
            default: return 'info';
        }
    }

    getDriverStatusClass(status) {
        switch(status) {
            case 'On Duty': return 'success';
            case 'In Transit': return 'warning';
            case 'Off Duty': return 'info';
            default: return 'info';
        }
    }

    updateAllViews() {
        this.updateKPICards();
        
        if (this.currentModule === 'assets') {
            this.renderAssetsTable();
        } else if (this.currentModule === 'devices') {
            this.renderDevicesTable();
        } else if (this.currentModule === 'incidents') {
            this.renderIncidentsList();
        } else if (this.currentModule === 'drivers') {
            this.renderDriversGrid();
        } else if (this.currentModule === 'analytics') {
            this.renderAnalyticsCharts();
        } else if (this.currentModule === 'reports') {
            this.renderReports();
        }
        
        this.renderActivityStream();
        if (this.map && this.currentModule === 'dashboard') {
            this.initializeMap();
        }
        
        // Close asset details if open when data updates
        if (document.getElementById('asset-details-panel').style.display === 'block') {
            this.closeAssetDetails();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AssetTrackingApp();
});