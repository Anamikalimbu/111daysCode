import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.product));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    try {
      await addToCart(product._id, quantity);
      setMessage("Added to cart!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (!product) return <p className="text-center py-20 text-gray-500">Loading...</p>;

  const displayPrice = product.discountPrice || product.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
          {product.images?.[activeImage]?.url ? (
            <img src={product.images[activeImage].url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  i === activeImage ? "border-brand-600" : "border-transparent"
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">{product.vendor?.storeName}</p>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        {product.numReviews > 0 && (
          <p className="text-sm text-gray-600 mb-3">
            ★ {product.ratings.toFixed(1)} ({product.numReviews} reviews)
          </p>
        )}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-brand-700">Rs {displayPrice}</span>
          {product.discountPrice && <span className="text-gray-400 line-through">Rs {product.price}</span>}
        </div>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <p className="text-sm text-gray-600 mb-4">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>

        {message && <p className="text-sm text-brand-600 mb-3">{message}</p>}

        {user?.role !== "vendor" && user?.role !== "admin" && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-lg px-3 py-2"
            />
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-brand-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
