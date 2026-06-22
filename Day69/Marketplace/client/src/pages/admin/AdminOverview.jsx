import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data.stats));
  }, []);

  if (!stats) return <p className="text-gray-500">Loading...</p>;

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Vendors", value: stats.totalVendors },
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Revenue", value: `Rs ${stats.totalRevenue}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
