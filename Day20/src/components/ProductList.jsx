import ProductCard from './ProductCard';
import { products } from '../data/products';
import { useSearch } from '../context/SearchContext';
import './ProductList.css';

const ProductList = () => {
  const { searchQuery } = useSearch();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="products-section" className="product-section">
      <div className="container">
        <div className="section-header">
          <h2>Trending Now</h2>
          <a href="#" className="view-all">View All</a>
        </div>
        
        {filteredProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products found matching "{searchQuery}"</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
