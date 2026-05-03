import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import './index.css';

const App = () => {
  const products = [
    {
      id: 1,
      title: "Wireless Noise-Cancelling Headphones",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      description: "Experience premium sound with our top-tier wireless headphones featuring active noise cancellation."
    },
    {
      id: 2,
      title: "Smart Fitness Watch",
      price: 199.50,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      description: "Track your health, workouts, and stay connected with this sleek smart fitness watch."
    },
    {
      id: 3,
      title: "Minimalist Leather Backpack",
      price: 129.00,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
      description: "A stylish and durable leather backpack perfect for daily commutes and weekend getaways."
    },
    {
      id: 4,
      title: "Mechanical Gaming Keyboard",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1511467687858-23d3ce51c5eb?w=500&q=80",
      description: "Enhance your gaming experience with tactile mechanical switches and customizable RGB lighting."
    },
    {
      id: 5,
      title: "Portable Bluetooth Speaker",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
      description: "Take your music anywhere with this rugged, waterproof portable bluetooth speaker."
    },
    {
      id: 6,
      title: "Ergonomic Office Chair",
      price: 249.00,
      image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80",
      description: "Work in ultimate comfort with our adjustable ergonomic chair designed for lumbar support."
    }
  ];

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <div className="product-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              description={product.description}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
