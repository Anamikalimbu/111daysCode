import { useEffect, useState } from "react";
import api from "../../services/api";

const VendorOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/vendors/me/stats").then(({ data }) => setStats(data.stats));
  }, []);

  if (!stats) return <p className="text-gray-500">Loading...</p>;

  const cards = [
    { label: "Total Products", value: stats.totalProducts },
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Sales", value: `Rs ${stats.totalSales}` },
    { label: "Store Status", value: stats.storeStatus },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Store Overview</h1>
      {stats.storeStatus !== "approved" && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-6">
          Your store is <strong>{stats.storeStatus}</strong>. You can't list products until an admin approves your
          store.
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-xl font-bold capitalize mt-1">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorOverview;
