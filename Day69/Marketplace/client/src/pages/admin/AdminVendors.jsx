import { useEffect, useState } from "react";
import api from "../../services/api";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
};

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);

  const loadVendors = () => {
    api.get("/admin/vendors").then(({ data }) => setVendors(data.vendors));
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/admin/vendors/${id}/status`, { status });
    loadVendors();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendors</h1>
      <div className="space-y-3">
        {vendors.map((v) => (
          <div key={v._id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
            <div>
              <p className="font-medium">{v.storeName}</p>
              <p className="text-sm text-gray-500">
                {v.user?.name} • {v.user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[v.status]}`}>
                {v.status}
              </span>
              <select
                value={v.status}
                onChange={(e) => handleStatusChange(v._id, e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        ))}
        {vendors.length === 0 && <p className="text-gray-500">No vendors yet.</p>}
      </div>
    </div>
  );
};

export default AdminVendors;
