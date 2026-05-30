# Express + Mongoose CRUD API

A complete REST API with Express and Mongoose.

---

## 📁 Project Structure

```
Day47/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── productController.js  # Route logic
├── models/
│   └── Product.js         # Mongoose schema
├── routes/
│   └── productRoutes.js   # Route definitions
├── .env                   # Environment variables
├── package.json
└── server.js              # Entry point
```

---

## ⚙️ Setup

```bash
# 1. Install dependencies
npm install

# 2. Make sure MongoDB is running locally
# (Install MongoDB from https://www.mongodb.com/try/download/community)

# 3. Start the server (development)
npm run dev

# OR production
npm start
```

---

## 🔗 API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/products         | Get all products   |
| GET    | /api/products/:id     | Get one product    |
| POST   | /api/products         | Create product     |
| PUT    | /api/products/:id     | Update product     |
| DELETE | /api/products/:id     | Delete product     |

---

## 📦 Request Examples

### Create a product
```
POST /api/products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 999,
  "category": "electronics",
  "inStock": true
}
```

### Update a product
```
PUT /api/products/<id>
Content-Type: application/json

{
  "price": 899,
  "inStock": false
}
```

---

## ✅ Sample Response

```json
{
  "success": true,
  "data": {
    "_id": "65f3a...",
    "name": "Laptop",
    "price": 999,
    "category": "electronics",
    "inStock": true,
    "createdAt": "2024-03-15T10:00:00.000Z",
    "updatedAt": "2024-03-15T10:00:00.000Z"
  }
}
```