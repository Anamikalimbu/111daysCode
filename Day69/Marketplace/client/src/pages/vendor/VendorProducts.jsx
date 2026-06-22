import { useEffect, useState } from "react";
import api from "../../services/api";

const emptyForm = { name: "", description: "", price: "", discountPrice: "", category: "", stock: "" };

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = () => {
    api.get("/products/vendor/mine").then(({ data }) => setProducts(data.products));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setFiles([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      category: product.category,
      stock: product.stock,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      files.forEach((file) => fd.append("images", file));

      if (editingId) {
        await api.put(`/products/${editingId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-5 mb-6 space-y-3">
          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              placeholder="Price (Rs)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Discount price (optional)"
              value={form.discountPrice}
              onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              required
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
            <input
              required
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} />

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p._id} className="flex items-center gap-4 border border-gray-200 rounded-lg p-3">
            <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">
                Rs {p.price} • Stock: {p.stock} • {p.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <button onClick={() => handleEdit(p)} className="text-sm text-brand-600 font-medium hover:underline">
              Edit
            </button>
            <button onClick={() => handleDelete(p._id)} className="text-sm text-red-500 font-medium hover:underline">
              Delete
            </button>
          </div>
        ))}
        {products.length === 0 && <p className="text-gray-500">No products yet. Add your first one!</p>}
      </div>
    </div>
  );
};

export default VendorProducts;
