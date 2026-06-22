import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const displayPrice = product.discountPrice || product.price;

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 mb-1">{product.vendor?.storeName}</p>
        <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-brand-700">Rs {displayPrice}</span>
          {product.discountPrice && (
            <span className="text-xs text-gray-400 line-through">Rs {product.price}</span>
          )}
        </div>
        {product.numReviews > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            ★ {product.ratings.toFixed(1)} ({product.numReviews})
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
