import { useEffect, useState } from "react";
import api from "../../services/api";

const VendorProfile = () => {
  const [form, setForm] = useState({ storeName: "", storeDescription: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/vendors/me").then(({ data }) =>
      setForm({ storeName: data.vendor.storeName, storeDescription: data.vendor.storeDescription || "" })
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("storeName", form.storeName);
    fd.append("storeDescription", form.storeDescription);
    if (logoFile) fd.append("logo", logoFile);

    await api.put("/vendors/me", fd, { headers: { "Content-Type": "multipart/form-data" } });
    setMessage("Profile updated!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Store Profile</h1>
      {message && <p className="text-brand-600 text-sm mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
          <input
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            value={form.storeDescription}
            onChange={(e) => setForm({ ...form, storeDescription: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Logo</label>
          <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
        </div>
        <button type="submit" className="bg-brand-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-brand-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default VendorProfile;
