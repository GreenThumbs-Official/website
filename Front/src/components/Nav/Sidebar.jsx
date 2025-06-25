import React, { useState } from 'react';
import Background from '@/components/ui/background';
import { cn } from '@/lib/utils';

export default function Sidebar ({ className, children, userType = 'user', ...props }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const adminMenuItems = [
    { label: 'Dashboard', href: '/dash/Admin', icon: '📊' },
    { label: 'Plantes', href: '/dash/Plants', icon: '🌱' },
    { label: 'Utilisateurs', href: '/dash/UserList', icon: '👥' },
    { label: 'Conseils', href: '/dash/Advices', icon: '👥' },
    { label: 'Paramètres', href: '/admin/settings', icon: '⚙️' },
  ];

  const userMenuItems = [
    { label: 'Ma Collection', href: '/dashboard', icon: '🌿' },
    { label: 'Calendrier d\'arrosage', href: '/watering', icon: '💧' },
    { label: 'Guide de soins', href: '/care-guide', icon: '📖' },
    { label: 'Mon Profil', href: '/profile', icon: '👤' },
  ];

  const menuItems = userType === 'admin' ? adminMenuItems : userMenuItems;
  const appTitle = userType === 'admin' ? 'GreenThumbs Admin' : 'GreenThumbs';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#6fbc29] relative overflow-hidden">
      <Background />
      
      <div className="lg:hidden relative z-20 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border-b border-white border-opacity-20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3.5L6,7.5V12.5L12,16.5L18,12.5V7.5L12,3.5M12,1L21,6V13L12,18L3,13V6L12,1Z" />
            </svg>
            {appTitle}
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
          <div className="absolute top-0 left-0 w-64 h-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border-r border-white border-opacity-20" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-2 text-2xl font-bold text-white mb-8">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,3.5L6,7.5V12.5L12,16.5L18,12.5V7.5L12,3.5M12,1L21,6V13L12,18L3,13V6L12,1Z" />
                </svg>
                {appTitle}
              </div>
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="flex relative z-10">
        <aside className="hidden lg:block w-64 min-h-screen bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border-r border-white border-opacity-20">
          <div className="p-6">
            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-8">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,3.5L6,7.5V12.5L12,16.5L18,12.5V7.5L12,3.5M12,1L21,6V13L12,18L3,13V6L12,1Z" />
              </svg>
              {appTitle}
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
        
        <main className={cn("flex-1 p-4 lg:p-8", className)} {...props}>
          {children}
        </main>
      </div>
    </div>
  );
};