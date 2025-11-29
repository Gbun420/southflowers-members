'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Wallet, User, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/menu', label: 'Menu', icon: List },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const handleLogout = () => auth.signOut();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-md hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-brand-green">South Flowers</span>
            </div>
            <div className="flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href ? 'bg-brand-green text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                      {item.label}
                  </Link>
                ))}
                <button onClick={handleLogout} title="Sign Out" className="p-2 rounded-md text-gray-700 hover:bg-gray-200">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 flex justify-around z-50">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center p-2 w-1/4 ${pathname === item.href ? 'text-brand-green' : 'text-gray-500'}`}>
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
         <button onClick={handleLogout} className="flex flex-col items-center justify-center p-2 w-1/4 text-gray-500">
            <LogOut className="h-6 w-6" />
            <span className="text-xs">Logout</span>
         </button>
      </div>
    </>
  );
}
