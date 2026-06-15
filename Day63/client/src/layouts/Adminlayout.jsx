import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-40 lg:hidden animate-slide-up">
              <AdminSidebar />
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile sidebar toggle */}
          <div className="lg:hidden px-4 pt-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn-secondary gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Menu
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}