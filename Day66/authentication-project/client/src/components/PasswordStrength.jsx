const getStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
};

const LABELS = ["Too weak", "Weak", "Okay", "Strong", "Very strong"];
const COLORS = ["bg-danger", "bg-danger", "bg-amber-500", "bg-teal-500", "bg-success"];

export default function PasswordStrength({ password }) {
  const strength = getStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < strength ? COLORS[strength] : "bg-ink-700"
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-slate-400">{LABELS[strength]}</p>
    </div>
  );
}
