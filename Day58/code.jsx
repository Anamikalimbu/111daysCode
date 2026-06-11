import { useState, createContext, useContext } from "react";

// ─────────────────────────────────────────────
// THEME / DESIGN TOKENS
// ─────────────────────────────────────────────
const T = {
  bg:        "#0b0e17",
  surface:   "#111520",
  card:      "#161b2a",
  border:    "#1e2740",
  borderHov: "#2e3a5c",
  primary:   "#6366f1",
  primaryDim:"#1e204a",
  green:     "#22c55e",
  greenDim:  "#0f2b1a",
  red:       "#ef4444",
  redDim:    "#2b0f0f",
  amber:     "#f59e0b",
  text:      "#e8edf5",
  textMid:   "#94a3b8",
  textDim:   "#4a5568",
  code:      "#0d1117",
  mono:      "'Fira Code','Consolas','Courier New',monospace",
  sans:      "'Inter','Segoe UI',sans-serif",
};

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const LESSONS = [
  {
    id: 0,
    emoji: "🧠",
    title: "What is React Query?",
    subtitle: "Server state vs client state",
    body: "React Query (TanStack Query) manages server state — data that lives on a backend. It handles fetching, caching, syncing, and background updates automatically. This replaces the messy useState + useEffect pattern most MERN apps start with.",
    label: "The Problem",
    before: `// ❌ Old pattern — repetitive boilerplate every component
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/complaints')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
}, []);`,
    after: `// ✅ With React Query — cache, loading, error handled for you
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, isError } = useQuery({
  queryKey: ['complaints'],
  queryFn: () =>
    fetch('/api/complaints').then(r => r.json()),
});`,
    points: [
      "Auto caching — same queryKey = reuses cached result",
      "Background refetch when window regains focus",
      "isLoading and isError states out of the box",
      "No more cleanup functions inside useEffect",
    ],
  },
  {
    id: 1,
    emoji: "⚙️",
    title: "Setup & QueryClient",
    subtitle: "Wrapping your app correctly",
    body: "Before any hook can work, you must create a QueryClient and wrap your app in QueryClientProvider. The QueryClient holds the global cache. All components share it through React context.",
    label: "App Setup",
    before: `// Install the packages first:
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools`,
    after: `// main.jsx
import { QueryClient, QueryClientProvider }
  from '@tanstack/react-query';
import { ReactQueryDevtools }
  from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 }, // 5 min default
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourRoutes />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}`,
    points: [
      "QueryClient is the global cache store",
      "QueryClientProvider passes it to all child components",
      "defaultOptions sets global staleTime / retry / gcTime",
      "ReactQueryDevtools only renders in development mode",
    ],
  },
  {
    id: 2,
    emoji: "📡",
    title: "useQuery — Fetching Data",
    subtitle: "The main read hook",
    body: "useQuery fetches and caches server data. Give it a queryKey (unique cache ID) and a queryFn (async function). React Query handles the rest — loading state, error state, caching, and background refetching.",
    label: "useQuery in Sewalaya",
    before: `// queryKey shapes — choose wisely:
['complaints']              // all complaints
['complaints', id]          // single complaint
['complaints', { status }]  // filtered list
['users', userId, 'complaints'] // nested`,
    after: `// ComplaintList.jsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function ComplaintList() {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const res = await axios.get('/api/complaints');
      return res.data;
    },
    staleTime: 30_000,   // fresh for 30 seconds
  });

  if (isLoading) return <Spinner />;
  if (isError)   return <p>Error: {error.message}</p>;

  return (
    <>
      {isFetching && <p>Refreshing...</p>}
      {data.map(c => (
        <ComplaintCard key={c._id} complaint={c} />
      ))}
    </>
  );
}`,
    points: [
      "isLoading = true only on first fetch (no cached data yet)",
      "isFetching = true on every fetch including background ones",
      "staleTime: 30_000 → won't refetch for 30 seconds",
      "queryKey array can include params for per-param caching",
    ],
  },
  {
    id: 3,
    emoji: "✏️",
    title: "useMutation — Changing Data",
    subtitle: "POST, PUT, DELETE the right way",
    body: "useMutation handles write operations. After a successful mutation, call invalidateQueries to tell React Query the cached data is stale — it will automatically refetch and update the UI.",
    label: "Submit a Complaint",
    before: `// ❌ Old approach — manual state juggling
const handleSubmit = async (form) => {
  setLoading(true);
  try {
    await axios.post('/api/complaints', form);
    fetchComplaints(); // have to call this manually
  } catch(e) {
    setError(e);
  } finally {
    setLoading(false);
  }
};`,
    after: `// NewComplaintForm.jsx
import { useMutation, useQueryClient }
  from '@tanstack/react-query';

function NewComplaintForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComplaint) =>
      axios.post('/api/complaints', newComplaint)
           .then(r => r.data),

    onSuccess: () => {
      // Mark 'complaints' cache stale → auto-refetch
      queryClient.invalidateQueries({
        queryKey: ['complaints'],
      });
    },
    onError: (err) => {
      alert('Failed: ' + err.message);
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({
        title: 'Broken streetlight',
        dept: 'Infrastructure',
      })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Submitting…' : 'Submit Complaint'}
    </button>
  );
}`,
    points: [
      "mutationFn is the async function sending the request",
      "onSuccess fires after a successful server response",
      "invalidateQueries triggers auto-refetch of matching keys",
      "mutation.isPending replaces manual loading state",
    ],
  },
  {
    id: 4,
    emoji: "⏱️",
    title: "staleTime vs gcTime",
    subtitle: "Cache tuning for performance",
    body: "Two timers control React Query's behaviour: staleTime (how long data is fresh — no refetch during this window) and gcTime (how long unused data stays in memory before being garbage collected).",
    label: "Per-query Tuning",
    before: `// Defaults (no config):
staleTime: 0          // always stale → refetch on every mount
gcTime:    5 minutes  // remove from cache 5 min after unmount`,
    after: `// Different queries need different freshness:

// Departments rarely change — cache aggressively
useQuery({
  queryKey: ['departments'],
  queryFn: fetchDepartments,
  staleTime: 1000 * 60 * 10,  // fresh 10 min
  gcTime:    1000 * 60 * 30,  // keep in memory 30 min
});

// Notifications change fast — poll every 10s
useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 0,
  refetchInterval: 10_000,   // auto-refetch every 10s
});

// Complaints list — moderate freshness
useQuery({
  queryKey: ['complaints'],
  queryFn: fetchComplaints,
  staleTime: 30_000,          // fresh 30 seconds
});`,
    points: [
      "staleTime reduces network requests → better performance",
      "gcTime controls memory usage, not network behaviour",
      "refetchInterval turns any query into a polling query",
      "Match staleTime to how often data actually changes",
    ],
  },
];

const QUIZ = [
  {
    q: "What is the purpose of queryKey in useQuery?",
    options: [
      "It's the API endpoint URL to fetch from",
      "It uniquely identifies data in the React Query cache",
      "It's the name of the useState variable",
      "It sets the HTTP timeout for the request",
    ],
    correct: 1,
    explanation:
      "queryKey acts as the cache identifier. Identical key = same cached data reused. Include params inside the array like ['complaints', userId] to cache separately per user.",
  },
  {
    q: "Which hook handles POST / PUT / DELETE in React Query?",
    options: ["useQuery", "usePost", "useMutation", "useFetch"],
    correct: 2,
    explanation:
      "useMutation is for all write operations. useQuery is read-only. This separation keeps your code intentions explicit.",
  },
  {
    q: "What does queryClient.invalidateQueries() do?",
    options: [
      "Permanently deletes data from the database",
      "Removes the query from cache permanently",
      "Marks cached data as stale, triggering a refetch",
      "Cancels an in-progress network request",
    ],
    correct: 2,
    explanation:
      "invalidateQueries marks matching cache entries as stale. React Query then refetches them automatically on next render, keeping the UI in sync after mutations.",
  },
  {
    q: "What does staleTime: 60000 mean?",
    options: [
      "Request will timeout after 60 seconds",
      "Data is deleted from cache after 60 seconds",
      "Data stays fresh for 60 seconds — no refetch during this window",
      "Query retries 60,000 times on failure",
    ],
    correct: 2,
    explanation:
      "staleTime controls the freshness window. While fresh, React Query won't refetch even if the component unmounts and remounts. After 60s it becomes stale.",
  },
  {
    q: "What is the difference between isLoading and isFetching?",
    options: [
      "They are identical — both mean a request is in-flight",
      "isLoading: true only on first fetch with no cached data; isFetching: true on every in-flight request",
      "isLoading is for mutations; isFetching is for queries",
      "isFetching is only true the first time; isLoading is always true",
    ],
    correct: 1,
    explanation:
      "isLoading is true only when there is no cached data AND a fetch is happening (initial load). isFetching is true any time a request is in-flight, including silent background refreshes.",
  },
  {
    q: "Where must <QueryClientProvider> be placed?",
    options: [
      "Inside every component that calls useQuery",
      "Only around components that call useMutation",
      "At the top of the component tree, wrapping the whole app",
      "Inside public/index.html",
    ],
    correct: 2,
    explanation:
      "QueryClientProvider provides the QueryClient through React context. It must wrap every component that uses any React Query hook — so it goes at the top of the tree.",
  },
];

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

// ─────────────────────────────────────────────
// SMALL ATOMS
// ─────────────────────────────────────────────
function Badge({ children, color = T.primary }) {
  return (
    <span style={{
      display: "inline-block",
      background: color + "22",
      border: `1px solid ${color}44`,
      color,
      borderRadius: 6,
      padding: "2px 10px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}

function ProgressBar({ value, max, color = T.primary }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ height: 3, background: T.border, borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: color,
        transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, style: s }) {
  const base = {
    border: "none", borderRadius: 8, padding: "9px 20px",
    fontWeight: 700, fontSize: 13, cursor: disabled ? "default" : "pointer",
    fontFamily: T.sans, transition: "opacity 0.15s",
    opacity: disabled ? 0.4 : 1,
  };
  const variants = {
    primary:  { background: T.primary, color: "#fff" },
    ghost:    { background: "transparent", border: `1px solid ${T.border}`, color: T.textMid },
    success:  { background: T.green, color: "#fff" },
  };
  return (
    <button onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...s }}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// CODE BLOCK
// ─────────────────────────────────────────────
function CodeBlock({ code, label, color }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#0a0d14", padding: "8px 14px",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 1, textTransform: "uppercase" }}>
          {label}
        </span>
        <button onClick={copy} style={{
          background: "none", border: "none", color: copied ? T.green : T.textDim,
          cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: T.sans,
        }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre style={{
        margin: 0, padding: "14px 16px",
        background: T.code,
        fontFamily: T.mono, fontSize: 12, lineHeight: 1.75,
        color: "#cdd9f0", overflowX: "auto",
        whiteSpace: "pre",
      }}>
        {code}
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────
// LESSON SIDEBAR
// ─────────────────────────────────────────────
function LessonSidebar() {
  const { lessonIdx, setLessonIdx, completed } = useApp();
  return (
    <nav style={{ width: 210, flexShrink: 0 }}>
      <p style={{
        margin: "0 0 10px",
        fontSize: 10, fontWeight: 800,
        letterSpacing: 2, textTransform: "uppercase",
        color: T.textDim,
      }}>Lessons</p>
      {LESSONS.map((l, i) => {
        const active = lessonIdx === i;
        const done = completed.has(i);
        return (
          <button key={l.id} onClick={() => setLessonIdx(i)}
            style={{
              width: "100%", textAlign: "left",
              background: active ? T.primaryDim : "transparent",
              border: `1px solid ${active ? T.primary + "66" : "transparent"}`,
              borderRadius: 9, padding: "10px 12px", marginBottom: 4,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 9,
              transition: "all 0.15s",
            }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>
              {done ? "✅" : l.emoji}
            </span>
            <div>
              <div style={{
                fontSize: 12, fontWeight: active ? 700 : 500,
                color: active ? "#a5b4fc" : T.textMid,
                lineHeight: 1.35,
              }}>
                {l.title}
              </div>
              <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>
                {l.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────
// LESSON BODY
// ─────────────────────────────────────────────
function LessonKeyPoints({ points }) {
  return (
    <div style={{ marginTop: 20 }}>
      <p style={{
        margin: "0 0 10px", fontSize: 10, fontWeight: 800,
        letterSpacing: 2, textTransform: "uppercase", color: T.textDim,
      }}>Key Takeaways</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {points.map((pt, i) => (
          <div key={i} style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "10px 14px",
          }}>
            <span style={{ color: T.primary, flexShrink: 0, marginTop: 1 }}>▸</span>
            <span style={{ fontSize: 13, color: T.textMid, lineHeight: 1.55 }}>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonCodeTabs({ lesson }) {
  const [tab, setTab] = useState("before");
  return (
    <div style={{ marginTop: 20 }}>
      <p style={{
        margin: "0 0 10px", fontSize: 10, fontWeight: 800,
        letterSpacing: 2, textTransform: "uppercase", color: T.textDim,
      }}>{lesson.label}</p>

      <div style={{ display: "flex", gap: 6, marginBottom: -1 }}>
        {["before", "after"].map(t => {
          const active = tab === t;
          const isBefore = t === "before";
          const accent = isBefore ? T.red : T.green;
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              background: active ? (isBefore ? T.redDim : T.greenDim) : T.card,
              border: `1px solid ${active ? accent + "88" : T.border}`,
              borderBottom: active ? `1px solid ${isBefore ? T.redDim : T.greenDim}` : `1px solid ${T.border}`,
              borderRadius: "8px 8px 0 0",
              padding: "6px 16px",
              color: active ? accent : T.textDim,
              fontWeight: 700, fontSize: 12, cursor: "pointer",
              fontFamily: T.sans, letterSpacing: 0.5,
            }}>
              {isBefore ? "❌ Before" : "✅ After"}
            </button>
          );
        })}
      </div>
      <CodeBlock
        code={tab === "before" ? lesson.before : lesson.after}
        label={tab === "before" ? "old pattern" : "with react query"}
        color={tab === "before" ? T.red : T.green}
      />
    </div>
  );
}

function LessonNavBar({ lesson }) {
  const { lessonIdx, setLessonIdx, completed, markDone, setView } = useApp();
  const isDone = completed.has(lessonIdx);

  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", marginTop: 24, flexWrap: "wrap", gap: 10,
    }}>
      <Btn variant="ghost"
        disabled={lessonIdx === 0}
        onClick={() => setLessonIdx(l => l - 1)}>
        ← Previous
      </Btn>
      <div style={{ display: "flex", gap: 8 }}>
        {lessonIdx === LESSONS.length - 1 && (
          <Btn variant="success" onClick={() => setView("quiz")}>
            Take Quiz →
          </Btn>
        )}
        <Btn
          variant={isDone ? "ghost" : "primary"}
          onClick={() => {
            markDone(lessonIdx);
            if (lessonIdx < LESSONS.length - 1) setLessonIdx(l => l + 1);
          }}
        >
          {isDone ? "✅ Done" : lessonIdx < LESSONS.length - 1 ? "Mark Done & Next →" : "Mark Done ✓"}
        </Btn>
      </div>
    </div>
  );
}

function LessonView() {
  const { lessonIdx } = useApp();
  const lesson = LESSONS[lessonIdx];

  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14, overflow: "hidden",
    }}>
      {/* Lesson header */}
      <div style={{
        padding: "22px 26px 20px",
        borderBottom: `1px solid ${T.border}`,
        background: T.card,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 30 }}>{lesson.emoji}</span>
          <div>
            <Badge>{`Lesson ${lessonIdx + 1} of ${LESSONS.length}`}</Badge>
          </div>
        </div>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: T.text }}>
          {lesson.title}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>
          {lesson.body}
        </p>
      </div>

      {/* Lesson content */}
      <div style={{ padding: "20px 26px 26px" }}>
        <LessonCodeTabs lesson={lesson} />
        <LessonKeyPoints points={lesson.points} />
        <LessonNavBar lesson={lesson} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUIZ COMPONENTS
// ─────────────────────────────────────────────
function QuizOption({ index, text, selected, correct, revealed, onSelect }) {
  let bg = T.card, border = T.border, color = T.textMid;
  if (revealed) {
    if (index === correct)          { bg = T.greenDim; border = T.green;  color = "#86efac"; }
    else if (index === selected)    { bg = T.redDim;   border = T.red;    color = "#fca5a5"; }
  } else if (selected === index)    { bg = T.primaryDim; border = T.primary; color = "#a5b4fc"; }

  const labels = ["A", "B", "C", "D"];
  return (
    <button onClick={() => !revealed && onSelect(index)} style={{
      width: "100%", textAlign: "left",
      background: bg, border: `1px solid ${border}`,
      borderRadius: 10, padding: "13px 16px",
      color, fontSize: 13, fontFamily: T.sans,
      cursor: revealed ? "default" : "pointer",
      fontWeight: revealed && index === correct ? 700 : 400,
      transition: "all 0.18s",
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <span style={{ color: T.textDim, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
        {labels[index]}.
      </span>
      {text}
    </button>
  );
}

function QuizExplanation({ text }) {
  return (
    <div style={{
      marginTop: 16,
      background: T.code, border: `1px solid ${T.border}`,
      borderRadius: 10, padding: "14px 16px",
      borderLeft: `3px solid ${T.primary}`,
    }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: T.primary, letterSpacing: 1 }}>
        💡 EXPLANATION
      </span>
      <p style={{ margin: "6px 0 0", fontSize: 13, color: T.textMid, lineHeight: 1.65 }}>
        {text}
      </p>
    </div>
  );
}

function QuizResults({ score }) {
  const { setView, resetQuiz } = useApp();
  const pct = Math.round((score / QUIZ.length) * 100);
  const medal = pct >= 80 ? "🏆" : pct >= 60 ? "📈" : "📚";
  const msg =
    pct >= 80 ? "Excellent! You've nailed React Query fundamentals. Time to use it in Sewalaya! 🚀"
    : pct >= 60 ? "Good effort! Review the lessons on missed questions, then retry."
    : "Keep at it — re-read the lessons carefully. React Query clicks once you use it hands-on.";

  const scoreColor = pct >= 80 ? T.green : pct >= 60 ? T.amber : T.red;

  return (
    <div style={{
      flex: 1,
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "48px 32px",
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>{medal}</div>
      <h2 style={{ margin: "0 0 4px", fontSize: 32, fontWeight: 900, color: T.text }}>
        {score} / {QUIZ.length}
      </h2>
      <div style={{
        fontSize: 52, fontWeight: 900, color: scoreColor,
        lineHeight: 1.1, marginBottom: 14,
      }}>
        {pct}%
      </div>
      <div style={{ marginBottom: 12 }}>
        <Badge color={scoreColor}>{pct >= 80 ? "Passed" : pct >= 60 ? "Almost" : "Retry"}</Badge>
      </div>
      <p style={{ maxWidth: 400, color: T.textMid, fontSize: 14, lineHeight: 1.65, marginBottom: 32 }}>
        {msg}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <Btn variant="ghost" onClick={() => { resetQuiz(); }}>
          Retry Quiz
        </Btn>
        <Btn variant="primary" onClick={() => { resetQuiz(); setView("lessons"); }}>
          Back to Lessons
        </Btn>
      </div>
    </div>
  );
}

function QuizView() {
  const [qIdx, setQIdx]       = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setReveal]   = useState(false);
  const [score, setScore]       = useState(0);
  const [done, setDone]         = useState(false);

  const q = QUIZ[qIdx];

  const handleSelect = (i) => {
    if (revealed) return;
    setSelected(i);
    setReveal(true);
    if (i === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (qIdx + 1 < QUIZ.length) {
      setQIdx(i => i + 1);
      setSelected(null);
      setReveal(false);
    } else {
      setDone(true);
    }
  };

  if (done) return <QuizResults score={score} />;

  return (
    <div style={{
      flex: 1,
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 14, overflow: "hidden",
    }}>
      {/* Quiz header */}
      <div style={{
        background: T.card,
        padding: "16px 24px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <Badge color={T.primary}>Day 58 Quiz</Badge>
        </div>
        <span style={{ fontSize: 12, color: T.textDim, fontWeight: 600 }}>
          {qIdx + 1} / {QUIZ.length}
        </span>
      </div>
      <ProgressBar value={qIdx} max={QUIZ.length} />

      <div style={{ padding: "28px 26px" }}>
        <p style={{
          margin: "0 0 22px",
          fontSize: 16, fontWeight: 700, color: T.text, lineHeight: 1.55,
        }}>
          {q.q}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {q.options.map((opt, i) => (
            <QuizOption key={i}
              index={i} text={opt}
              selected={selected} correct={q.correct}
              revealed={revealed} onSelect={handleSelect}
            />
          ))}
        </div>

        {revealed && <QuizExplanation text={q.explanation} />}

        {revealed && (
          <div style={{ marginTop: 20 }}>
            <Btn onClick={handleNext}>
              {qIdx + 1 < QUIZ.length ? "Next Question →" : "See Results →"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────
function Header() {
  const { view, setView, completed, resetQuiz } = useApp();

  return (
    <header style={{
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      padding: "16px 24px",
    }}>
      <div style={{
        maxWidth: 940, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{
            fontSize: 10, color: T.primary, fontWeight: 800,
            letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 4,
          }}>
            MERN Stack · Day 58
          </div>
          <h1 style={{
            margin: 0, fontSize: 20, fontWeight: 900, color: T.text,
            letterSpacing: -0.3,
          }}>
            React Query & Server State
          </h1>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "5px 13px",
            fontSize: 12, color: T.textMid, fontWeight: 600,
          }}>
            {completed.size} / {LESSONS.length} done
          </div>

          {view === "lessons" ? (
            <Btn onClick={() => { resetQuiz(); setView("quiz"); }}>
              Take Quiz →
            </Btn>
          ) : (
            <Btn variant="ghost" onClick={() => { resetQuiz(); setView("lessons"); }}>
              ← Lessons
            </Btn>
          )}
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// ROOT — state + context provider
// ─────────────────────────────────────────────
export default function Day58App() {
  const [view, setView]         = useState("lessons");   // "lessons" | "quiz"
  const [lessonIdx, setLessonIdx] = useState(0);
  const [completed, setCompleted] = useState(new Set());

  const markDone = (i) => setCompleted(prev => new Set([...prev, i]));
  const resetQuiz = () => {};   // quiz manages its own state; this is a hook for future use

  return (
    <AppCtx.Provider value={{
      view, setView,
      lessonIdx, setLessonIdx,
      completed, markDone,
      resetQuiz,
    }}>
      <div style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: T.sans,
        color: T.text,
      }}>
        <Header />
        <main style={{
          maxWidth: 940, margin: "0 auto",
          padding: "24px 16px",
          display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start",
        }}>
          {view === "lessons" ? (
            <>
              <LessonSidebar />
              <LessonView key={lessonIdx} />
            </>
          ) : (
            <QuizView key={view} />
          )}
        </main>
      </div>
    </AppCtx.Provider>
  );
}
