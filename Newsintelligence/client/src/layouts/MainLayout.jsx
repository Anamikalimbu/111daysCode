import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import WireTicker from '../components/Navbar/WireTicker';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <WireTicker />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
        <footer className="border-t border-void-line px-4 py-6 text-center text-xs text-ink-soft dark:text-paper/40 md:px-8">
          Wire — News Intelligence Platform. Built on AI-processed data;
          verify against original sources before republishing.
        </footer>
      </div>
    </div>
  );
}
