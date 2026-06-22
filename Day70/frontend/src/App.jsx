import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
            </Routes>
          </main>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
