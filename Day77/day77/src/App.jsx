import { useState } from "react";

const NAV_TABS = ["Lesson", "Code", "Project", "Quiz"];

const LESSON_SECTIONS = [
  {
    id: "why",
    title: "Why Multiple File Upload?",
    content: `Single file upload covers one photo or document at a time. Real-world apps—product listings, portfolios, complaint attachments—need to accept many files in a single request. Multer supports this out of the box with .array() and .fields(), giving you a clean array of file objects on req.files instead of a single req.file.`,
    highlight: "req.files is an array — loop it, validate each, store all.",
  },
  {
    id: "multer-array",
    title: "multer.array() — Same Field, Many Files",
    content: `Use .array(fieldName, maxCount) when all files share one input name (e.g. a "photos" input with multiple). Multer collects them into req.files.`,
    code: `// middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

// .array('photos', 5) — field name, max 5 files
module.exports = { upload };`,
  },
  {
    id: "route-array",
    title: "Route: Handling req.files Array",
    code: `// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { uploadMany } = require('../controllers/uploadController');

// POST /api/upload/many
router.post('/many', upload.array('photos', 5), uploadMany);

module.exports = router;

// controllers/uploadController.js
const uploadMany = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileData = req.files.map(file => ({
      originalName: file.originalname,
      savedAs: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      path: \`/uploads/\${file.filename}\`
    }));

    res.status(200).json({
      message: \`\${req.files.length} file(s) uploaded successfully\`,
      files: fileData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadMany };`,
  },
  {
    id: "fields",
    title: "multer.fields() — Different Field Names",
    content: `Use .fields() when your form has multiple distinct file inputs — like a product listing with a cover image AND a gallery. Each field gets its own array inside req.files.`,
    code: `// Middleware
const uploadFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]);

// Route
router.post('/product', uploadFields, async (req, res) => {
  const cover = req.files['coverImage']?.[0];
  const gallery = req.files['gallery'] || [];

  if (!cover) {
    return res.status(400).json({ message: 'Cover image is required' });
  }

  res.status(200).json({
    cover: {
      name: cover.filename,
      path: \`/uploads/\${cover.filename}\`
    },
    gallery: gallery.map(f => ({
      name: f.filename,
      path: \`/uploads/\${f.filename}\`
    }))
  });
});`,
  },
  {
    id: "validation",
    title: "Validating Multiple Files",
    content: `Beyond Multer's built-in fileFilter and limits, add your own business rules in the controller: minimum count, total size cap, duplicate name check.`,
    code: `const uploadMany = async (req, res) => {
  const files = req.files || [];

  // Rule 1: At least 2 files required
  if (files.length < 2) {
    return res.status(400).json({ message: 'Upload at least 2 files' });
  }

  // Rule 2: Total size under 20MB
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > 20 * 1024 * 1024) {
    return res.status(400).json({ message: 'Total upload exceeds 20MB' });
  }

  // Rule 3: No duplicate original names
  const names = files.map(f => f.originalname);
  const unique = new Set(names);
  if (unique.size !== names.length) {
    return res.status(400).json({ message: 'Duplicate file names detected' });
  }

  // All good — proceed
  res.json({ uploaded: files.length });
};`,
  },
  {
    id: "frontend",
    title: "React Frontend for Multiple Upload",
    code: `// FileUploadForm.jsx
import { useState } from 'react';
import axios from 'axios';

export default function FileUploadForm() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setError('');

    // Generate previews
    const urls = selected.map(f => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return setError('Select at least one file');

    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));

    try {
      setUploading(true);
      const res = await axios.post('/api/upload/many', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {previews.map((url, i) => (
          <img key={i} src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover' }} />
        ))}
      </div>
      <button onClick={handleSubmit} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}`,
  },
];

const PROJECT_STEPS = [
  {
    step: 1,
    title: "Set up folder structure",
    desc: "Create uploads/ directory at project root. Add it to .gitignore. Install multer.",
    cmd: "npm install multer\nmkdir uploads",
  },
  {
    step: 2,
    title: "Build upload middleware",
    desc: "Create middleware/upload.js with diskStorage, fileFilter (images only), and 5MB per-file limit.",
  },
  {
    step: 3,
    title: "Create the route + controller",
    desc: "POST /api/upload/many uses upload.array('photos', 5). Controller validates and returns file metadata array.",
  },
  {
    step: 4,
    title: "Add .fields() route",
    desc: "POST /api/upload/product accepts coverImage (1) + gallery (8). Test with Postman using form-data.",
  },
  {
    step: 5,
    title: "React upload form",
    desc: "Build FileUploadForm.jsx with multiple file input, local previews, FormData POST, and result display.",
  },
];

const QUIZ = [
  {
    q: "Which Multer method handles multiple files from the same field name?",
    options: [".single()", ".array()", ".fields()", ".any()"],
    answer: 1,
    explanation: ".array('fieldName', maxCount) collects all files from one input into req.files.",
  },
  {
    q: "What does req.files contain when using .array()?",
    options: [
      "A single file object",
      "An object keyed by field name",
      "An array of file objects",
      "undefined",
    ],
    answer: 2,
    explanation: "With .array(), req.files is a plain array. With .fields(), it's an object keyed by field name.",
  },
  {
    q: "You need a product form with a 'cover' (1 file) and 'gallery' (up to 6 files). Which method?",
    options: [".array()", ".single()", ".fields()", ".none()"],
    answer: 2,
    explanation: ".fields([{ name: 'cover', maxCount: 1 }, { name: 'gallery', maxCount: 6 }]) handles multiple distinct inputs.",
  },
  {
    q: "How do you send multiple files from React using axios?",
    options: [
      "JSON.stringify the file array",
      "Append each file to FormData then POST with multipart/form-data",
      "Use URL.createObjectURL and send the string",
      "Send files as base64 in request body",
    ],
    answer: 1,
    explanation: "Use FormData, call formData.append('photos', file) for each file, then axios.post with Content-Type: multipart/form-data.",
  },
  {
    q: "Which limit option in Multer restricts per-file size?",
    options: ["maxSize", "fileSize", "sizeLimit", "maxFileSize"],
    answer: 1,
    explanation: "limits: { fileSize: 5 * 1024 * 1024 } sets a 5MB per-file cap.",
  },
];

//  Code Block 
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ position: "relative", margin: "12px 0" }}>
      <pre
        style={{
          background: "#0d1117",
          color: "#c9d1d9",
          padding: "16px 16px 16px 16px",
          borderRadius: 8,
          fontSize: 13,
          overflowX: "auto",
          border: "1px solid #30363d",
          lineHeight: 1.6,
        }}
      >
        {code}
      </pre>
      <button
        onClick={copy}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: copied ? "#238636" : "#21262d",
          color: copied ? "#fff" : "#8b949e",
          border: "1px solid #30363d",
          borderRadius: 6,
          padding: "3px 10px",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

// ─── Lesson Tab ───────────────────────────────────────────────
function LessonTab() {
  const [open, setOpen] = useState("why");
  return (
    <div>
      {/* Key differences callout */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a2744 0%, #0f1f3d 100%)",
          border: "1px solid #2563eb44",
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 20,
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: ".array()", desc: "Same field, many files → req.files[]" },
          { label: ".fields()", desc: "Different fields → req.files['name'][]" },
          { label: ".single()", desc: "One file → req.file" },
        ].map((item) => (
          <div key={item.label}>
            <span
              style={{
                fontFamily: "monospace",
                color: "#60a5fa",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {item.label}
            </span>
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {LESSON_SECTIONS.map((sec) => (
        <div
          key={sec.id}
          style={{
            border: "1px solid",
            borderColor: open === sec.id ? "#2563eb66" : "#1e293b",
            borderRadius: 10,
            marginBottom: 10,
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}
        >
          <button
            onClick={() => setOpen(open === sec.id ? null : sec.id)}
            style={{
              width: "100%",
              background: open === sec.id ? "#1e3a5f" : "#111827",
              border: "none",
              padding: "13px 18px",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>
              {sec.title}
            </span>
            <span style={{ color: "#60a5fa", fontSize: 18 }}>
              {open === sec.id ? "−" : "+"}
            </span>
          </button>
          {open === sec.id && (
            <div style={{ background: "#0f172a", padding: "16px 18px" }}>
              {sec.content && (
                <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 10, lineHeight: 1.7 }}>
                  {sec.content}
                </p>
              )}
              {sec.highlight && (
                <div
                  style={{
                    background: "#1e3a5f",
                    border: "1px solid #2563eb55",
                    borderRadius: 6,
                    padding: "8px 14px",
                    color: "#93c5fd",
                    fontSize: 13,
                    fontStyle: "italic",
                    marginBottom: 12,
                  }}
                >
                  💡 {sec.highlight}
                </div>
              )}
              {sec.code && <CodeBlock code={sec.code} />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Code Tab ─────────────────────────────────────────────────
const FULL_CODE = {
  "middleware/upload.js": `const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only JPEG, PNG, WebP allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { upload };`,

  "controllers/uploadController.js": `const uploadMany = async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0)
      return res.status(400).json({ message: 'No files uploaded' });

    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    if (totalBytes > 20 * 1024 * 1024)
      return res.status(400).json({ message: 'Total size exceeds 20MB' });

    const fileData = files.map(file => ({
      originalName: file.originalname,
      savedAs: file.filename,
      size: \`\${(file.size / 1024).toFixed(1)} KB\`,
      path: \`/uploads/\${file.filename}\`
    }));

    res.status(200).json({
      message: \`\${files.length} file(s) uploaded\`,
      files: fileData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadProduct = async (req, res) => {
  const cover = req.files['coverImage']?.[0];
  const gallery = req.files['gallery'] || [];

  if (!cover)
    return res.status(400).json({ message: 'Cover image required' });

  res.status(200).json({
    cover: { name: cover.filename, path: \`/uploads/\${cover.filename}\` },
    gallery: gallery.map(f => ({ name: f.filename, path: \`/uploads/\${f.filename}\` }))
  });
};

module.exports = { uploadMany, uploadProduct };`,

  "routes/uploadRoutes.js": `const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { uploadMany, uploadProduct } = require('../controllers/uploadController');

// Multiple same-field files
router.post('/many', upload.array('photos', 5), uploadMany);

// Different field names
router.post('/product', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]), uploadProduct);

module.exports = router;`,

  "React: FileUploadForm.jsx": `import { useState } from 'react';
import axios from 'axios';

export default function FileUploadForm() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setError('');
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const handleUpload = async () => {
    if (!files.length) return setError('Select at least one file');
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));

    try {
      setUploading(true);
      const res = await axios.post('/api/upload/many', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-form">
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <div className="previews">
        {previews.map((url, i) => (
          <img key={i} src={url} alt="" />
        ))}
      </div>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : \`Upload \${files.length} File(s)\`}
      </button>
      {error && <p className="error">{error}</p>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}`,
};

function CodeTab() {
  const [active, setActive] = useState(Object.keys(FULL_CODE)[0]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 16,
          background: "#0d1117",
          padding: 8,
          borderRadius: 8,
          border: "1px solid #21262d",
        }}
      >
        {Object.keys(FULL_CODE).map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            style={{
              background: active === f ? "#1f6feb" : "transparent",
              color: active === f ? "#fff" : "#8b949e",
              border: "none",
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <CodeBlock code={FULL_CODE[active]} />
    </div>
  );
}

//  Project Tab 
function ProjectTab() {
  const [done, setDone] = useState({});
  const toggle = (i) => setDone((p) => ({ ...p, [i]: !p[i] }));
  const count = Object.values(done).filter(Boolean).length;

  return (
    <div>
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 10,
          padding: "14px 18px",
          marginBottom: 20,
        }}
      >
        <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>
          🎯 Mini Project: Multi-Image Upload API
        </div>
        <div style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.6 }}>
          Build a backend that accepts up to 5 images, validates them, and returns
          metadata. Add a React form with live previews and upload progress.
        </div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 6,
              background: "#1e293b",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(count / PROJECT_STEPS.length) * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                transition: "width 0.3s",
              }}
            />
          </div>
          <span style={{ color: "#60a5fa", fontSize: 13, minWidth: 50 }}>
            {count}/{PROJECT_STEPS.length}
          </span>
        </div>
      </div>

      {PROJECT_STEPS.map((step, i) => (
        <div
          key={i}
          onClick={() => toggle(i)}
          style={{
            background: done[i] ? "#0a1628" : "#111827",
            border: "1px solid",
            borderColor: done[i] ? "#2563eb55" : "#1e293b",
            borderRadius: 10,
            padding: "14px 18px",
            marginBottom: 10,
            cursor: "pointer",
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: done[i] ? "#2563eb" : "#374151",
              background: done[i] ? "#2563eb" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
              fontSize: 13,
            }}
          >
            {done[i] && <span style={{ color: "#fff" }}>✓</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                color: done[i] ? "#60a5fa" : "#e2e8f0",
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              Step {step.step}: {step.title}
            </div>
            <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6 }}>
              {step.desc}
            </div>
            {step.cmd && <CodeBlock code={step.cmd} />}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Quiz Tab ─────────────────────────────────────────────────
function QuizTab() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const pick = (qi, oi) => {
    if (submitted) return;
    setAnswers((p) => ({ ...p, [qi]: oi }));
  };

  const score = QUIZ.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div>
      {QUIZ.map((q, qi) => (
        <div
          key={qi}
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 10,
            padding: "16px 18px",
            marginBottom: 14,
          }}
        >
          <div
            style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14, marginBottom: 12 }}
          >
            {qi + 1}. {q.q}
          </div>
          {q.options.map((opt, oi) => {
            const selected = answers[qi] === oi;
            const correct = q.answer === oi;
            let bg = "#1e293b";
            let border = "#374151";
            let color = "#94a3b8";
            if (submitted) {
              if (correct) { bg = "#14532d"; border = "#16a34a"; color = "#86efac"; }
              else if (selected && !correct) { bg = "#4c0519"; border = "#dc2626"; color = "#fca5a5"; }
            } else if (selected) {
              bg = "#1e3a5f"; border = "#2563eb"; color = "#93c5fd";
            }
            return (
              <div
                key={oi}
                onClick={() => pick(qi, oi)}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 7,
                  padding: "9px 14px",
                  marginBottom: 7,
                  cursor: submitted ? "default" : "pointer",
                  color,
                  fontSize: 13,
                  transition: "all 0.15s",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: "monospace", opacity: 0.6 }}>
                  {String.fromCharCode(65 + oi)}.
                </span>
                {opt}
                {submitted && correct && <span style={{ marginLeft: "auto" }}>✓</span>}
              </div>
            );
          })}
          {submitted && (
            <div
              style={{
                marginTop: 8,
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 6,
                padding: "8px 12px",
                color: "#60a5fa",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              💡 {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < QUIZ.length}
          style={{
            background:
              Object.keys(answers).length < QUIZ.length ? "#1e293b" : "#2563eb",
            color:
              Object.keys(answers).length < QUIZ.length ? "#475569" : "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 14,
            cursor:
              Object.keys(answers).length < QUIZ.length
                ? "not-allowed"
                : "pointer",
            fontWeight: 600,
            width: "100%",
          }}
        >
          Submit ({Object.keys(answers).length}/{QUIZ.length} answered)
        </button>
      ) : (
        <div
          style={{
            background:
              score === QUIZ.length
                ? "#14532d"
                : score >= 3
                ? "#1e3a5f"
                : "#4c0519",
            border: "1px solid",
            borderColor:
              score === QUIZ.length
                ? "#16a34a"
                : score >= 3
                ? "#2563eb"
                : "#dc2626",
            borderRadius: 10,
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 4 }}>
            {score === QUIZ.length ? "🎉" : score >= 3 ? "👍" : "📚"}
          </div>
          <div
            style={{
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 4,
            }}
          >
            {score}/{QUIZ.length} correct
          </div>
          <div style={{ color: "#94a3b8", fontSize: 13 }}>
            {score === QUIZ.length
              ? "Perfect! You've mastered multiple file upload."
              : score >= 3
              ? "Good work — review the explanations above."
              : "Re-read the lesson sections and try again."}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function Day77() {
  const [tab, setTab] = useState("Lesson");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0f1e",
        color: "#e2e8f0",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: "0 0 48px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d1b35 0%, #0a0f1e 100%)",
          borderBottom: "1px solid #1e293b",
          padding: "24px 24px 0",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <span
              style={{
                background: "#1e3a5f",
                color: "#60a5fa",
                borderRadius: 6,
                padding: "3px 10px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              DAY 77
            </span>
            <span style={{ color: "#475569", fontSize: 13 }}>
              Phase 3 · File Upload & Cloud
            </span>
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#f1f5f9",
              margin: "0 0 6px",
            }}
          >
            Multiple File Upload
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 20px" }}>
            multer.array() · multer.fields() · validation · React previews
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2 }}>
            {NAV_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? "#0a0f1e" : "transparent",
                  color: tab === t ? "#60a5fa" : "#64748b",
                  border: "none",
                  borderTop: tab === t ? "2px solid #2563eb" : "2px solid transparent",
                  borderRadius: "6px 6px 0 0",
                  padding: "9px 18px",
                  fontSize: 14,
                  fontWeight: tab === t ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 24px 0" }}>
        {tab === "Lesson" && <LessonTab />}
        {tab === "Code" && <CodeTab />}
        {tab === "Project" && <ProjectTab />}
        {tab === "Quiz" && <QuizTab />}
      </div>
    </div>
  );
}
