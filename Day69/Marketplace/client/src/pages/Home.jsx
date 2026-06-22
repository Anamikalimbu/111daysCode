import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?limit=8&sort=createdAt")
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-600 to-brand-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Shop from local vendors, all in one place</h1>
        <p className="text-brand-50 mb-8 max-w-xl mx-auto">
          A marketplace connecting independent sellers with customers across Nepal.
        </p>
        <Link
          to="/products"
          className="bg-white text-brand-700 font-semibold px-6 py-3 rounded-lg hover:bg-brand-50"
        >
          Browse Products
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
