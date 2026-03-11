'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CarFront, 
  Smartphone, 
  Camera, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  FileText 
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Assets', path: '/assets', icon: CarFront },
  { name: 'Devices', path: '/devices', icon: Smartphone },
  { name: 'Camera', path: '/camera', icon: Camera },
  { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Reports', path: '/reports', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-card-border flex-shrink-0 overflow-y-auto hidden md:block h-screen sticky top-0">
      <div className="p-5 border-b border-card-border">
        <h2 className="text-xl font-bold text-primary">Asset Tracker</h2>
      </div>
      <nav className="p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
            
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
