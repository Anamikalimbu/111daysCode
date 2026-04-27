import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Products from './Products';
import ProductDetails from './ProductDetails';
import './App.css';

const dummyProducts = [
  { id: 1, name: 'Laptop', price: 999, description: 'High-performance laptop for coding.' },
  { id: 2, name: 'Smartphone', price: 699, description: 'Latest model with amazing camera.' },
  { id: 3, name: 'Headphones', price: 199, description: 'Noise-cancelling wireless headphones.' }
];

function App() {
  return (
    <>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
        <Link to="/products">Products</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products products={dummyProducts} />} />
        <Route path="/products/:id" element={<ProductDetails products={dummyProducts} />} />
      </Routes>
    </>
  );
}

export default App;
