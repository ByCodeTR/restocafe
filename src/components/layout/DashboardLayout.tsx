'use client';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-16 pl-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 