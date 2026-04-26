import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import SearchModal from './components/SearchModal';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import './index.css';

function App() {
  return (
    <SearchProvider>
      <WishlistProvider>
        <CartProvider>
          <Navbar />
          <CartSidebar />
          <SearchModal />
          <main>
            <Hero />
            <ProductList />
          </main>
          <Footer />
        </CartProvider>
      </WishlistProvider>
    </SearchProvider>
  );
}

export default App;
