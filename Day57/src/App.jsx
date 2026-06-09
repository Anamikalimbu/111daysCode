import { useState, createContext, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
  NavLink,
} from "react-router-dom";

// ─── Cart Context ────────────────────────────────────────────────────────────
const CartContext = createContext();
function useCart() {
  return useContext(CartContext);
}

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Obsidian Desk Mat", category: "workspace", price: 49, rating: 4.8, reviews: 312, emoji: "🖤", desc: "Full-grain leather surface, non-slip base. 90×45 cm. Ages beautifully." },
  { id: 2, name: "Walnut Monitor Stand", category: "workspace", price: 129, rating: 4.9, reviews: 187, emoji: "🪵", desc: "Solid American walnut. Fits monitors up to 34\". Cable channel underneath." },
  { id: 3, name: "Linen Cable Organizer", category: "workspace", price: 19, rating: 4.6, reviews: 540, emoji: "🧵", desc: "Natural linen sleeve, brass zipper. Holds up to 8 cables." },
  { id: 4, name: "Ceramic Pen Cup", category: "accessories", price: 34, rating: 4.7, reviews: 229, emoji: "🏺", desc: "Wheel-thrown stoneware, matte glaze. Holds 12+ pens comfortably." },
  { id: 5, name: "Architect's Ruler Set", category: "accessories", price: 28, rating: 4.5, reviews: 96, emoji: "📐", desc: "Stainless steel, 3 scales. Laser-etched markings that won't wear off." },
  { id: 6, name: "Bamboo Notebook", category: "stationery", price: 22, rating: 4.8, reviews: 415, emoji: "📓", desc: "Sustainably sourced cover, dot-grid ivory paper, lay-flat binding." },
  { id: 7, name: "Brass Bookmark Set", category: "stationery", price: 16, rating: 4.6, reviews: 178, emoji: "🔖", desc: "Set of 4. Satin-finish brass, subtly engraved. Won't crease your pages." },
  { id: 8, name: "Frosted Glass Lamp", category: "lighting", price: 89, rating: 4.9, reviews: 264, emoji: "💡", desc: "3000K warm white, touch dimmer, USB-C powered. Flicker-free." },
];

const CATEGORIES = ["all", "workspace", "accessories", "stationery", "lighting"];

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:    #1a1714;
    --muted:  #6b6560;
    --border: #e8e3dc;
    --bg:     #faf8f5;
    --cream:  #f2ede6;
    --accent: #b85c2a;
    --accent2:#e8a87c;
    --white:  #ffffff;
    --radius: 10px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }

  a { color: inherit; text-decoration: none; }

  /* NAV */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: var(--white); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 62px;
  }
  .nav-brand { font-family: 'DM Serif Display', serif; font-size: 1.35rem; letter-spacing: -.3px; }
  .nav-brand span { color: var(--accent); }
  .nav-links { display: flex; gap: 1.8rem; }
  .nav-links a { font-size: .9rem; font-weight: 500; color: var(--muted); transition: color .15s; }
  .nav-links a:hover, .nav-links a.active { color: var(--ink); }
  .nav-cart {
    display: flex; align-items: center; gap: .45rem;
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    padding: .5rem 1.1rem; border-radius: 99px; font-size: .88rem; font-weight: 600;
    transition: opacity .15s;
  }
  .nav-cart:hover { opacity: .88; }
  .badge {
    background: #fff; color: var(--accent);
    border-radius: 99px; font-size: .72rem; font-weight: 700;
    min-width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center;
    padding: 0 4px;
  }

  /* HERO */
  .hero {
    background: var(--cream);
    padding: 5rem 2rem 4.5rem;
    text-align: center;
    border-bottom: 1px solid var(--border);
  }
  .hero-eyebrow { font-size: .78rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin-bottom: .8rem; }
  .hero h1 { font-family: 'DM Serif Display', serif; font-size: clamp(2.4rem,5vw,3.8rem); line-height: 1.12; max-width: 640px; margin: 0 auto .9rem; }
  .hero p { color: var(--muted); font-size: 1.05rem; max-width: 420px; margin: 0 auto 1.8rem; }
  .btn-primary {
    display: inline-block; background: var(--accent); color: #fff;
    padding: .75rem 2rem; border-radius: 99px; font-weight: 600; font-size: .95rem;
    transition: opacity .15s;
  }
  .btn-primary:hover { opacity: .85; }

  /* SHOP LAYOUT */
  .shop { max-width: 1200px; margin: 0 auto; padding: 2.5rem 2rem; }
  .shop-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: .8rem; }
  .shop-title { font-family: 'DM Serif Display', serif; font-size: 1.6rem; }
  .cat-tabs { display: flex; gap: .5rem; flex-wrap: wrap; }
  .cat-tab {
    padding: .38rem .9rem; border-radius: 99px; font-size: .82rem; font-weight: 500;
    border: 1.5px solid var(--border); background: transparent; cursor: pointer; transition: all .15s;
    color: var(--muted);
  }
  .cat-tab.active, .cat-tab:hover { background: var(--ink); color: #fff; border-color: var(--ink); }

  /* GRID */
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.4rem; }
  .product-card {
    background: var(--white); border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden; transition: box-shadow .2s, transform .2s; cursor: pointer;
  }
  .product-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.09); transform: translateY(-3px); }
  .product-thumb {
    background: var(--cream); height: 160px;
    display: flex; align-items: center; justify-content: center; font-size: 3.5rem;
  }
  .product-info { padding: 1rem 1.1rem 1.2rem; }
  .product-cat { font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin-bottom: .3rem; }
  .product-name { font-weight: 600; font-size: .98rem; margin-bottom: .3rem; }
  .product-price { font-size: 1.05rem; font-weight: 700; }
  .product-rating { font-size: .78rem; color: var(--muted); margin-top: .25rem; }

  /* PRODUCT DETAIL */
  .detail { max-width: 900px; margin: 2.5rem auto; padding: 0 2rem; }
  .detail-back { font-size: .85rem; color: var(--muted); display: inline-flex; align-items: center; gap: .3rem; margin-bottom: 1.5rem; }
  .detail-back:hover { color: var(--ink); }
  .detail-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
  @media (max-width: 600px) { .detail-inner { grid-template-columns: 1fr; } }
  .detail-img {
    background: var(--cream); border-radius: var(--radius);
    height: 340px; display: flex; align-items: center; justify-content: center; font-size: 7rem;
  }
  .detail-cat { font-size: .75rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin-bottom: .5rem; }
  .detail h2 { font-family: 'DM Serif Display', serif; font-size: 2rem; line-height: 1.2; margin-bottom: .6rem; }
  .detail-desc { color: var(--muted); line-height: 1.65; margin-bottom: 1.2rem; }
  .detail-price { font-size: 1.6rem; font-weight: 700; margin-bottom: 1.4rem; }
  .detail-rating { font-size: .85rem; color: var(--muted); margin-bottom: 1.5rem; }
  .btn-add {
    width: 100%; padding: .85rem; background: var(--accent); color: #fff;
    border: none; border-radius: var(--radius); font-size: 1rem; font-weight: 600; cursor: pointer;
    transition: opacity .15s; margin-bottom: .7rem;
  }
  .btn-add:hover { opacity: .85; }
  .btn-add.added { background: #2a7a4b; }
  .btn-outline {
    width: 100%; padding: .75rem; background: transparent; color: var(--ink);
    border: 1.5px solid var(--border); border-radius: var(--radius); font-size: .95rem; font-weight: 500; cursor: pointer;
    transition: border-color .15s;
  }
  .btn-outline:hover { border-color: var(--ink); }

  /* CART */
  .cart-page { max-width: 720px; margin: 2.5rem auto; padding: 0 2rem; }
  .cart-page h1 { font-family: 'DM Serif Display', serif; font-size: 2rem; margin-bottom: 1.8rem; }
  .cart-empty { text-align: center; padding: 4rem 0; color: var(--muted); }
  .cart-empty a { color: var(--accent); font-weight: 600; }
  .cart-item {
    display: flex; align-items: center; gap: 1rem;
    border-bottom: 1px solid var(--border); padding: 1rem 0;
  }
  .cart-item-emoji { font-size: 2.4rem; background: var(--cream); border-radius: 8px; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-weight: 600; font-size: .95rem; }
  .cart-item-price { font-size: .85rem; color: var(--muted); }
  .cart-qty { display: flex; align-items: center; gap: .5rem; }
  .qty-btn { background: var(--cream); border: none; border-radius: 6px; width: 28px; height: 28px; cursor: pointer; font-size: 1rem; font-weight: 600; }
  .cart-summary { margin-top: 1.8rem; background: var(--cream); border-radius: var(--radius); padding: 1.4rem; }
  .cart-row { display: flex; justify-content: space-between; margin-bottom: .5rem; font-size: .92rem; }
  .cart-total { font-weight: 700; font-size: 1.1rem; border-top: 1px solid var(--border); padding-top: .8rem; margin-top: .5rem; }
  .btn-checkout {
    width: 100%; padding: .9rem; background: var(--accent); color: #fff;
    border: none; border-radius: var(--radius); font-size: 1rem; font-weight: 600;
    cursor: pointer; margin-top: 1rem; transition: opacity .15s;
  }
  .btn-checkout:hover { opacity: .85; }

  /* CHECKOUT */
  .checkout { max-width: 540px; margin: 2.5rem auto; padding: 0 2rem 4rem; }
  .checkout h1 { font-family: 'DM Serif Display', serif; font-size: 2rem; margin-bottom: 1.6rem; }
  .form-group { margin-bottom: 1.1rem; }
  .form-group label { display: block; font-size: .82rem; font-weight: 600; margin-bottom: .35rem; color: var(--muted); }
  .form-group input {
    width: 100%; padding: .65rem .9rem; border: 1.5px solid var(--border);
    border-radius: 8px; font-size: .95rem; font-family: inherit; background: var(--white);
    outline: none; transition: border-color .15s;
  }
  .form-group input:focus { border-color: var(--accent); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .section-label { font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin: 1.6rem 0 .8rem; }
  .success-page { text-align: center; padding: 5rem 2rem; }
  .success-page .check { font-size: 4rem; margin-bottom: 1rem; }
  .success-page h2 { font-family: 'DM Serif Display', serif; font-size: 2.2rem; margin-bottom: .7rem; }
  .success-page p { color: var(--muted); margin-bottom: 2rem; }

  /* ABOUT */
  .about { max-width: 700px; margin: 3rem auto; padding: 0 2rem; }
  .about h1 { font-family: 'DM Serif Display', serif; font-size: 2.6rem; margin-bottom: 1.2rem; }
  .about p { color: var(--muted); line-height: 1.75; margin-bottom: 1rem; font-size: 1.02rem; }
  .about-values { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.2rem; margin-top: 2.5rem; }
  @media (max-width: 520px) { .about-values { grid-template-columns: 1fr; } }
  .value-card { background: var(--cream); padding: 1.3rem; border-radius: var(--radius); }
  .value-card .icon { font-size: 1.8rem; margin-bottom: .5rem; }
  .value-card h3 { font-weight: 600; margin-bottom: .3rem; font-size: .95rem; }
  .value-card p { font-size: .84rem; color: var(--muted); margin: 0; line-height: 1.55; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 999;
    background: var(--ink); color: #fff; padding: .75rem 1.3rem;
    border-radius: 99px; font-size: .88rem; font-weight: 500;
    animation: fadeIn .2s ease;
    pointer-events: none;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return msg ? <div className="toast">{msg}</div> : null;
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ onCartClick }) {
  const { count } = useCart();
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">grain<span>&</span>form</Link>
      <div className="nav-links">
        <NavLink to="/shop" className={({ isActive }) => isActive ? "active" : ""}>Shop</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink>
      </div>
      <button className="nav-cart" onClick={onCartClick}>
        🛍 Cart {count > 0 && <span className="badge">{count}</span>}
      </button>
    </nav>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home() {
  const featured = PRODUCTS.slice(0, 4);
  const navigate = useNavigate();
  return (
    <>
      <div className="hero">
        <p className="hero-eyebrow">Thoughtfully made objects</p>
        <h1>Your desk, done with intention.</h1>
        <p>Premium workspace and stationery goods — no noise, no clutter, nothing unnecessary.</p>
        <Link to="/shop" className="btn-primary">Shop the collection →</Link>
      </div>
      <div className="shop">
        <div className="shop-header">
          <h2 className="shop-title">Featured</h2>
          <Link to="/shop" style={{ fontSize: ".88rem", color: "var(--accent)", fontWeight: 600 }}>View all →</Link>
        </div>
        <div className="product-grid">
          {featured.map(p => (
            <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="product-thumb">{p.emoji}</div>
              <div className="product-info">
                <div className="product-cat">{p.category}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-price">${p.price}</div>
                <div className="product-rating">★ {p.rating} ({p.reviews})</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Shop ─────────────────────────────────────────────────────────────────────
function Shop() {
  const [cat, setCat] = useState("all");
  const navigate = useNavigate();
  const filtered = cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  return (
    <div className="shop">
      <div className="shop-header">
        <h1 className="shop-title">All Products</h1>
        <div className="cat-tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-tab${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {filtered.map(p => (
          <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
            <div className="product-thumb">{p.emoji}</div>
            <div className="product-info">
              <div className="product-cat">{p.category}</div>
              <div className="product-name">{p.name}</div>
              <div className="product-price">${p.price}</div>
              <div className="product-rating">★ {p.rating} ({p.reviews})</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────
function ProductDetail({ showToast }) {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  if (!product) return <div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Product not found. <Link to="/shop" style={{ color: "var(--accent)" }}>Back to shop</Link></div>;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    showToast(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="detail">
      <button className="detail-back" style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-inner">
        <div className="detail-img">{product.emoji}</div>
        <div>
          <div className="detail-cat">{product.category}</div>
          <h2>{product.name}</h2>
          <div className="detail-rating">★ {product.rating} · {product.reviews} reviews</div>
          <p className="detail-desc">{product.desc}</p>
          <div className="detail-price">${product.price}</div>
          <button className={`btn-add${added ? " added" : ""}`} onClick={handleAdd}>
            {added ? "✓ Added to cart" : "Add to cart"}
          </button>
          <button className="btn-outline" onClick={() => navigate("/shop")}>Continue shopping</button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
function CartPage() {
  const { cart, removeFromCart, updateQty, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="cart-page">
      <h1>Your cart</h1>
      <div className="cart-empty">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍</div>
        <p>Nothing here yet. <Link to="/shop">Start shopping →</Link></p>
      </div>
    </div>
  );

  return (
    <div className="cart-page">
      <h1>Your cart</h1>
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <div className="cart-item-emoji">{item.emoji}</div>
          <div className="cart-item-info">
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-price">${item.price} each</div>
          </div>
          <div className="cart-qty">
            <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
            <span style={{ minWidth: 20, textAlign: "center" }}>{item.qty}</span>
            <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
          </div>
          <div style={{ fontWeight: 700, minWidth: 52, textAlign: "right" }}>${item.price * item.qty}</div>
          <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "1.1rem" }}>×</button>
        </div>
      ))}
      <div className="cart-summary">
        <div className="cart-row"><span>Subtotal</span><span>${total}</span></div>
        <div className="cart-row"><span>Shipping</span><span>Free</span></div>
        <div className="cart-row cart-total"><span>Total</span><span>${total}</span></div>
        <button className="btn-checkout" onClick={() => navigate("/checkout")}>Proceed to checkout →</button>
      </div>
    </div>
  );
}

// ─── Checkout ─────────────────────────────────────────────────────────────────
function Checkout() {
  const { cart, total } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);

  if (cart.length === 0 && !placed) {
    return <div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>
      Your cart is empty. <Link to="/shop" style={{ color: "var(--accent)" }}>Shop now →</Link>
    </div>;
  }

  if (placed) return (
    <div className="success-page">
      <div className="check">✅</div>
      <h2>Order placed!</h2>
      <p>Thanks for your purchase. You'll receive a confirmation shortly.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="section-label">Delivery</div>
      <div className="form-group"><label>Full name</label><input placeholder="Jane Smith" /></div>
      <div className="form-group"><label>Email</label><input type="email" placeholder="jane@example.com" /></div>
      <div className="form-group"><label>Address</label><input placeholder="123 Main St" /></div>
      <div className="form-row">
        <div className="form-group"><label>City</label><input placeholder="New York" /></div>
        <div className="form-group"><label>ZIP</label><input placeholder="10001" /></div>
      </div>
      <div className="section-label">Payment</div>
      <div className="form-group"><label>Card number</label><input placeholder="4242 4242 4242 4242" /></div>
      <div className="form-row">
        <div className="form-group"><label>Expiry</label><input placeholder="MM / YY" /></div>
        <div className="form-group"><label>CVC</label><input placeholder="123" /></div>
      </div>
      <div style={{ marginTop: "1.4rem", background: "var(--cream)", borderRadius: "var(--radius)", padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
        <span>Order total</span><span>${total}</span>
      </div>
      <button className="btn-checkout" style={{ marginTop: "1.2rem" }} onClick={() => setPlaced(true)}>
        Place order →
      </button>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <div className="about">
      <h1>We make fewer, better things.</h1>
      <p>grain&form started as a one-person studio with a single conviction: the objects on your desk shape how you think. We source materials with long lives — solid wood, full-grain leather, hand-thrown ceramics — and work with small workshops who share that philosophy.</p>
      <p>Every product in our range is something we use ourselves. If it doesn't earn a permanent place on our own desks, it doesn't make it into the shop.</p>
      <div className="about-values">
        {[
          { icon: "🌲", title: "Material honesty", desc: "No veneers, no faux finishes. What you see is what it's made of." },
          { icon: "🔧", title: "Repairability", desc: "Everything we sell can be maintained and repaired. No planned obsolescence." },
          { icon: "📦", title: "Zero waste packaging", desc: "Recycled materials only. No plastic, no filler, no excess." },
        ].map(v => (
          <div key={v.title} className="value-card">
            <div className="icon">{v.icon}</div>
            <h3>{v.title}</h3>
            <p>{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <style>{css}</style>
        <Nav onCartClick={() => window.location.assign("/cart")} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail showToast={showToast} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Page not found. <Link to="/" style={{ color: "var(--accent)" }}>Go home →</Link></div>} />
        </Routes>
        <Toast msg={toast} />
      </BrowserRouter>
    </CartProvider>
  );
}