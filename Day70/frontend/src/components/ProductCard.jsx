import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();

  const stars = "⭐".repeat(Math.round(product.rating));

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="h-44 overflow-hidden bg-gray-50">
        <img
          src={product.image || "https://via.placeholder.com/300x200?text=Product"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")}
        />
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">{product.name}</h3>
          <span className="text-xs bg-green-50 text-primary px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
            {product.category}
          </span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>{stars}</span>
          <span>({product.numReviews || 0})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <div className="flex items-center gap-2">
            {product.stock === 0 ? (
              <span className="text-xs text-red-500 font-medium">Out of stock</span>
            ) : (
              <span className="text-xs text-gray-400">{product.stock} left</span>
            )}
            <button
              onClick={() => addToCart(product._id)}
              disabled={loading || product.stock === 0}
              className="btn-primary text-xs py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
