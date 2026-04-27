import { Link } from 'react-router-dom';

export default function Products({ products }) {
  return (
    <div>
      <h1>Products Page</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
