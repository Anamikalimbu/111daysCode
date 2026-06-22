import { Link } from "react-router-dom";

const categories = ["Fruits", "Vegetables", "Dairy", "Bakery", "Beverages", "Snacks"];
const categoryEmoji = { Fruits: "🍎", Vegetables: "🥦", Dairy: "🥛", Bakery: "🍞", Beverages: "🧃", Snacks: "🍟" };

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fresh groceries, <span className="text-primary">delivered fast</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Shop daily essentials from the comfort of your home. Quality products, fair prices.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/products" className="btn-primary text-base py-3 px-8">
              Shop Now 🛒
            </Link>
            <Link to="/register" className="btn-outline text-base py-3 px-8">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="card p-4 text-center hover:border-primary hover:border cursor-pointer flex flex-col items-center gap-2 transition-all"
            >
              <span className="text-3xl">{categoryEmoji[cat]}</span>
              <span className="text-sm font-medium text-gray-700">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: "🚚", title: "Fast Delivery", desc: "Get your groceries delivered to your doorstep quickly" },
            { icon: "✅", title: "Quality Assured", desc: "Fresh and quality-checked products every time" },
            { icon: "💳", title: "Easy Payments", desc: "Pay via Cash on Delivery, eSewa, or Khalti" },
          ].map((f) => (
            <div key={f.title} className="card p-6 text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to shop?</h2>
        <Link to="/products" className="btn-primary text-base py-3 px-8 inline-block">
          Browse All Products
        </Link>
      </section>
    </div>
  );
}
