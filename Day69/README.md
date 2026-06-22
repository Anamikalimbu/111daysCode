# Multi-Vendor Marketplace (MERN)

A full-stack multi-vendor e-commerce marketplace built with MongoDB, Express, React, and Node.js, styled with Tailwind CSS.

## Features

- **Auth**: JWT-based register/login for customers, vendors, and admin (roles)
- **Vendors**: Apply as a seller, get admin-approved, manage their own store, products, and orders
- **Products**: Search, category/price filter, sort, pagination, image upload (Cloudinary), reviews/ratings
- **Cart & Checkout**: Persistent server-side cart, shipping address, order placement
- **Payments**: Khalti and eSewa verification endpoints wired in (stub UI included — swap in the real checkout widgets)
- **Orders**: Multi-vendor order splitting — each vendor manages only their own items' status (pending → delivered)
- **Admin dashboard**: Approve/suspend vendors, view all users, platform-wide stats

## Folder Structure

```
marketplace/
├── server/              # Express + MongoDB backend
│   ├── config/          # DB & Cloudinary config
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route handlers
│   ├── routes/          # Express routers
│   ├── middleware/      # Auth, error handling, file upload
│   ├── utils/           # Helpers (asyncHandler, JWT, ApiError)
│   └── server.js
└── client/              # React + Vite + Tailwind frontend
    └── src/
        ├── components/  # Navbar, ProductCard, ProtectedRoute
        ├── context/      # AuthContext, CartContext
        ├── pages/        # All route pages (incl. vendor/, admin/)
        └── services/      # Axios instance
```

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, CLOUDINARY_*, KHALTI_SECRET_KEY, ESEWA_MERCHANT_CODE
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 3. Create your first admin

There's no public admin signup (by design). Register a normal user, then manually update their role in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

### 4. Vendor approval flow

1. A user registers with role `vendor` → a `Vendor` document is auto-created with `status: "pending"`.
2. Vendor **cannot list products** until an admin sets their status to `approved` (Admin Dashboard → Vendors).
3. Once approved, the vendor can add products from their dashboard.

## Payment Integration Notes

The backend has real verification logic for **Khalti** (`/api/payment/khalti/verify`) and **eSewa** (`/api/payment/esewa/verify`), using their respective server-side verification APIs. You'll need to:

1. Sign up for Khalti/eSewa merchant (test/sandbox) accounts.
2. Add their checkout widget/SDK on the frontend `PaymentGateway.jsx` page (currently a placeholder "Simulate Payment" button).
3. Once the gateway returns a token/transaction ID, the existing verify calls will mark the order as paid.

## What's left to wire up for a production launch

- Real Khalti/eSewa frontend widgets (backend verification is ready)
- Email sending for order confirmation / vendor approval (you already have Nodemailer experience from Day 64 — reuse that setup here)
- Image optimization / CDN settings on Cloudinary
- Rate limiting & input validation hardening (e.g. `express-validator`)
- Deployment configs (you'll cover this in Phase 8 of your roadmap, Day 108-111)
