import { useParams, Link } from 'react-router-dom';

export default function ProductDetails({ products }) {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <h2>Product not found</h2>;

  return (
    <div>
      <h1>{product.name} Details</h1>
      <p>Price: ${product.price}</p>
      <p>Description: {product.description}</p>
      <Link to="/products">Back to Products</Link>
    </div>
  );
}
