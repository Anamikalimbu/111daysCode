import { NavLink, Outlet } from "react-router-dom";

const VendorDashboard = () => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium ${
      isActive ? "bg-brand-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-[200px_1fr] gap-8">
      <aside className="space-y-1">
        <NavLink to="/vendor/dashboard" end className={linkClass}>
          Overview
        </NavLink>
        <NavLink to="/vendor/dashboard/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/vendor/dashboard/orders" className={linkClass}>
          Orders
        </NavLink>
        <NavLink to="/vendor/dashboard/profile" className={linkClass}>
          Store Profile
        </NavLink>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default VendorDashboard;
