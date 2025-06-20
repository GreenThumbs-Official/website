import React from 'react';
import Background from '../Background';
import { cn } from '@/lib/utils';

const Sidebar = ({ className, children, ...props }) => {
  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Plantes', href: '/admin/plants', icon: '🌱' },
    { label: 'Utilisateurs', href: '/admin/users', icon: '👥' },
    { label: 'Commandes', href: '/admin/orders', icon: '📦' },
    { label: 'Paramètres', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 relative overflow-hidden">
      <Background />
      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border-r border-white border-opacity-20">
          <div className="p-6">
            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-8">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,3.5L6,7.5V12.5L12,16.5L18,12.5V7.5L12,3.5M12,1L21,6V13L12,18L3,13V6L12,1Z" />
              </svg>
              GreenThumbs Admin
            </div>
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className={cn("flex-1 p-8", className)} {...props}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;