'use client';

import { useState } from 'react';
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
  FileText,
  Menu,
  X
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Assets', path: '/assets', icon: CarFront },
  { name: 'Devices', path: '/devices', icon: Smartphone },
  { name: 'Camera', path: '/camera', icon: Camera },
  { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Reports', path: '/reports', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-card-border flex items-center justify-between px-4 z-40">
        <h2 className="text-xl font-bold text-primary tracking-tight">VIZFLEET</h2>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2 text-muted-foreground hover:bg-secondary rounded-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 w-64 bg-card border-r border-card-border flex-shrink-0 flex flex-col h-screen z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-5 border-b border-card-border hidden md:block shrink-0">
          <h2 className="text-xl font-bold text-primary tracking-tight">VIZFLEET</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 mt-16 md:mt-0">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
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
    </>
  );
}
