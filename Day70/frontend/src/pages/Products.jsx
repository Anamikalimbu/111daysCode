import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Bakery", "Beverages", "Snacks", "Other"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category && category !== "All") params.category = category;

      const { data } = await api.get("/products", { params });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      const msg = err.response
        ? `Server error: ${err.response.status} — ${err.response.data?.message || "Unknown"}`
        : "Cannot connect to backend. Make sure the server is running on port 5000.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.search.value;
    setSearchParams(val ? { search: val } : {});
    setPage(1);
  };

  const handleCategory = (cat) => {
    if (cat === "All") setSearchParams({});
    else setSearchParams({ category: cat });
    setPage(1);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const { data } = await api.post("/products/seed/all");
      toast.success(data.message || "Products seeded!");
      fetchProducts();
    } catch (err) {
      const msg = err.response
        ? `Seed failed: ${err.response.data?.message}`
        : "Cannot reach backend. Is the server running?";
      toast.error(msg);
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search products..."
          className="input max-w-sm"
        />
        <button type="submit" className="btn-primary">Search</button>
        {(search || category) && (
          <button
            type="button"
            onClick={() => { setSearchParams({}); setPage(1); }}
            className="btn-outline"
          >
            Clear
          </button>
        )}
      </form>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              (cat === "All" && !category) || category === cat
                ? "bg-primary text-white border-primary"
                : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm">{total} products found</p>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="text-xs bg-amber-50 border border-amber-300 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-60"
        >
          {seeding ? "Seeding..." : "🌱 Seed Sample Products"}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <strong>⚠️ Error:</strong> {error}
          <div className="mt-1 text-red-500 text-xs">
            Check that your backend is running: <code className="bg-red-100 px-1 rounded">cd backend && npm run dev</code>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium text-gray-600">No products found</p>
          {!error && (
            <p className="text-sm mt-2 text-gray-400">
              Click <strong className="text-amber-600">🌱 Seed Sample Products</strong> above to add 12 sample items
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="btn-outline py-1 px-3 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="py-1 px-3 text-sm text-gray-600">Page {page}</span>
          <button
            disabled={products.length < 12}
            onClick={() => setPage(page + 1)}
            className="btn-outline py-1 px-3 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
