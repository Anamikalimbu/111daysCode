import { useState } from "react";

const concepts = [
  {
    id: "api-features",
    title: "APIFeatures Class",
    icon: "⚡",
    color: "#6366f1",
    summary: "Chains Search → Filter → Sort → Paginate on a Mongoose query",
    code: `class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;       // Mongoose query
    this.queryStr = queryStr; // req.query
  }

  search() {
    const keyword = this.queryStr.search
      ? { name: { $regex: this.queryStr.search, $options: "i" } }
      : {};
    this.query = this.query.find(keyword);
    return this; // enables chaining
  }

  filter() {
    const queryObj = { ...this.queryStr };
    ["search","sort","page","limit"].forEach(f => delete queryObj[f]);
    // Convert gt/gte/lt/lte → $gt/$gte/$lt/$lte
    let str = JSON.stringify(queryObj);
    str = str.replace(/\\b(gt|gte|lt|lte)\\b/g, m => \`$\${m}\`);
    this.query = this.query.find(JSON.parse(str));
    return this;
  }

  sort() {
    const sortBy = this.queryStr.sort
      ? this.queryStr.sort.split(",").join(" ")
      : "-createdAt"; // default: newest first
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page  = parseInt(this.queryStr.page)  || 1;
    const limit = parseInt(this.queryStr.limit) || 10;
    this.query  = this.query.skip((page - 1) * limit).limit(limit);
    return this;
  }
}

// Usage in controller:
const features = new APIFeatures(Product.find(), req.query)
  .search()
  .filter()
  .sort()
  .paginate();
const products = await features.query;`,
    explanation: "The class takes a Mongoose query and req.query. Each method modifies `this.query` and returns `this`, enabling method chaining. The controller calls `.query` at the end to execute."
  },
  {
    id: "app-error",
    title: "AppError Class",
    icon: "🔴",
    color: "#ef4444",
    summary: "Custom error class that carries statusCode and isOperational flag",
    code: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);           // calls Error constructor
    this.statusCode = statusCode;
    this.status = \`\${statusCode}\`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // known/expected error

    Error.captureStackTrace(this, this.constructor);
  }
}

// Throw anywhere in your app:
throw new AppError("Product not found", 404);
throw new AppError("Unauthorized", 401);

// In middleware:
return next(new AppError("Route not found", 404));`,
    explanation: "isOperational = true means we trust the error and can send its message to the client. Programming errors (bugs) will NOT have this flag — the global handler sends a generic message instead."
  },
  {
    id: "async-handler",
    title: "asyncHandler",
    icon: "🔄",
    color: "#10b981",
    summary: "Eliminates try/catch from every controller function",
    code: `// Without asyncHandler — repetitive:
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err); // pass to global error handler
  }
};

// ✅ With asyncHandler — clean:
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Not found", 404));
  res.json({ success: true, data: { product } });
});`,
    explanation: "asyncHandler wraps the controller in a function that catches any rejected promise and passes it to next() — which routes it to the global error handler."
  },
  {
    id: "error-middleware",
    title: "Global Error Handler",
    icon: "🛡️",
    color: "#f59e0b",
    summary: "One middleware handles ALL errors in the app",
    code: `// errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  // 4 params = Express error middleware
  err.statusCode = err.statusCode || 500;
  err.status     = err.status     || "error";

  if (process.env.NODE_ENV === "development") {
    // Dev: show full error + stack trace
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    // Production: only show safe messages
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message
      });
    } else {
      // Unknown error — don't leak details
      res.status(500).json({
        success: false,
        message: "Something went wrong."
      });
    }
  }
};

// Register LAST in server.js:
app.use(errorMiddleware);`,
    explanation: "This runs only when next(err) is called. Dev mode shows full details; production only shows message for operational errors. Unknown bugs get a generic message."
  },
  {
    id: "security",
    title: "Security Best Practices",
    icon: "🔒",
    color: "#8b5cf6",
    summary: "helmet + rate limiting + CORS + body size limit",
    code: `const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const cors       = require("cors");

// 1. Secure HTTP headers
app.use(helmet());

// 2. Rate limiting: 100 req / 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests" }
});
app.use("/api", limiter);

// 3. CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET","POST","PUT","DELETE"]
}));

// 4. Limit request body size
app.use(express.json({ limit: "10kb" }));`,
    explanation: "helmet sets 11 security headers automatically. Rate limiting prevents brute-force attacks. CORS controls which origins can call your API. Body size limit prevents payload attacks."
  },
  {
    id: "response-format",
    title: "Consistent Response Format",
    icon: "📦",
    color: "#06b6d4",
    summary: "Always return { success, message, data } — frontend can rely on it",
    code: `// ✅ Standard success response:
res.status(200).json({
  success: true,
  message: "Products fetched successfully",
  count: products.length,
  totalCount: 50,
  pagination: {
    currentPage: 1,
    totalPages: 5,
    hasNextPage: true,
    hasPrevPage: false
  },
  data: { products }
});

// ✅ Standard error response (from errorMiddleware):
res.status(404).json({
  success: false,
  status: "fail",
  message: "Product not found"
});

// ❌ Inconsistent — avoid this:
res.json(products);           // no metadata
res.json({ data: products }); // missing success flag`,
    explanation: "Consistency means your frontend team can always check response.success and response.message without guessing. Every endpoint follows the same contract."
  },
];

const queryExamples = [
  { label: "Search", query: "?search=laptop", desc: "Find products with 'laptop' in name/description" },
  { label: "Filter by Category", query: "?category=electronics", desc: "Only electronics" },
  { label: "Price Range", query: "?price[gte]=500&price[lte]=2000", desc: "Between ₹500 and ₹2000" },
  { label: "Sort", query: "?sort=-price", desc: "Highest price first (- = descending)" },
  { label: "Paginate", query: "?page=2&limit=5", desc: "Page 2, 5 items per page" },
  { label: "Combined", query: "?search=phone&category=electronics&price[gte]=100&sort=-price&page=1&limit=10", desc: "Everything at once!" },
];

export default function Day75Lesson() {
  const [active, setActive] = useState("api-features");
  const [copiedQuery, setCopiedQuery] = useState(null);

  const current = concepts.find((c) => c.id === active);

  const copyQuery = (query, i) => {
    navigator.clipboard.writeText(`GET http://localhost:5000/api/v1/products${query}`);
    setCopiedQuery(i);
    setTimeout(() => setCopiedQuery(null), 1500);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#0f0f14", minHeight: "100vh", color: "#e2e8f0", padding: "24px" }}>
      {/* Header */}
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <span style={{ background: "#6366f1", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 1 }}>DAY 75</span>
          <span style={{ color: "#64748b", fontSize: 13 }}>#111DaysOfLearningForChange</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: "#f1f5f9" }}>REST API Best Practices</h1>
        <p style={{ color: "#64748b", margin: "0 0 32px", fontSize: 14 }}>Phase 2 Capstone — Production-ready Express + MongoDB API</p>

        {/* Concept tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {concepts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background: active === c.id ? c.color : "#1e1e2e",
                color: active === c.id ? "#fff" : "#94a3b8",
                transition: "all 0.2s",
              }}
            >
              {c.icon} {c.title}
            </button>
          ))}
        </div>

        {/* Concept card */}
        {current && (
          <div style={{ background: "#1a1a2e", borderRadius: 16, overflow: "hidden", marginBottom: 32, border: `1px solid ${current.color}30` }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${current.color}30`, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{current.icon}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, color: "#f1f5f9" }}>{current.title}</h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{current.summary}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 0 }}>
              {/* Code */}
              <div style={{ padding: 24, borderRight: `1px solid ${current.color}20` }}>
                <pre style={{
                  background: "#0d0d18",
                  borderRadius: 10,
                  padding: 20,
                  fontSize: 12,
                  lineHeight: 1.7,
                  overflow: "auto",
                  margin: 0,
                  color: "#a5f3fc",
                  border: `1px solid ${current.color}20`,
                }}>
                  <code>{current.code}</code>
                </pre>
              </div>

              {/* Explanation */}
              <div style={{ padding: 24, background: "#16162a" }}>
                <h3 style={{ color: current.color, fontSize: 13, fontWeight: 700, marginTop: 0, textTransform: "uppercase", letterSpacing: 1 }}>💡 Why This Matters</h3>
                <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{current.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Query Examples */}
        <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 24, marginBottom: 32, border: "1px solid #6366f120" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#f1f5f9" }}>🔗 Query String Examples</h2>
          <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>All supported by one endpoint: <code style={{ color: "#6366f1" }}>GET /api/v1/products</code></p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {queryExamples.map((q, i) => (
              <div
                key={i}
                onClick={() => copyQuery(q.query, i)}
                style={{
                  background: "#0f0f14",
                  borderRadius: 10,
                  padding: "12px 16px",
                  cursor: "pointer",
                  border: copiedQuery === i ? "1px solid #10b981" : "1px solid #1e2030",
                  transition: "border 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.5 }}>{q.label}</span>
                  <span style={{ fontSize: 10, color: copiedQuery === i ? "#10b981" : "#475569" }}>
                    {copiedQuery === i ? "✓ Copied!" : "Click to copy"}
                  </span>
                </div>
                <code style={{ fontSize: 11, color: "#a5f3fc", wordBreak: "break-all" }}>{q.query}</code>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>{q.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* File Structure */}
        <div style={{ background: "#1a1a2e", borderRadius: 16, padding: 24, border: "1px solid #10b98120" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#f1f5f9" }}>📁 Project Structure</h2>
          <pre style={{ background: "#0f0f14", borderRadius: 10, padding: 20, fontSize: 12, color: "#a5f3fc", margin: 0, lineHeight: 1.8, border: "1px solid #10b98120" }}>
{`day75-rest-api-best-practices/
├── config/
│   └── db.js                  ← MongoDB connection
├── controllers/
│   └── productController.js   ← CRUD + stats logic
├── middleware/
│   ├── asyncHandler.js        ← Eliminates try/catch
│   ├── errorMiddleware.js     ← Global error handler
│   └── validateRequest.js     ← express-validator rules
├── models/
│   └── Product.js             ← Mongoose schema
├── routes/
│   └── productRoutes.js       ← Express Router
├── utils/
│   ├── AppError.js            ← Custom error class
│   └── apiFeatures.js         ← Search/Filter/Sort/Paginate
├── .env
└── server.js                  ← helmet + CORS + rate limit`}
          </pre>
        </div>

        <div style={{ marginTop: 24, textAlign: "center", color: "#334155", fontSize: 12 }}>
          Day 75 of 111 · Phase 2 Complete 🎉 · Next: Phase 3 — File Upload & Cloudinary
        </div>
      </div>
    </div>
  );
}