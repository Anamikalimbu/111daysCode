import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/Spinner";

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required.";
    else if (formData.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!formData.email) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Enter a valid email.";
    if (!formData.password) errs.password = "Password is required.";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    setLoading(false);

    if (result.success) {
      toast.success("Account created! Welcome aboard.");
      navigate(result.user.role === "admin" ? "/admin/dashboard" : "/profile", { replace: true });
    } else {
      toast.error(result.message);
      setErrors({ general: result.message });
    }
  };

  const strengthScore = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"];
  const score = strengthScore();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Join RBAC Dashboard — free to start
          </p>
        </div>

        <div className="card p-8">
          {errors.general && (
            <div className="mb-4 p-3.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
              <input
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className={`input-field ${errors.name ? "border-red-400 focus:ring-red-500" : ""}`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input-field ${errors.email ? "border-red-400 focus:ring-red-500" : ""}`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Account type</label>
              <div className="grid grid-cols-2 gap-2">
                {["user", "admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, role: r }))}
                    className={`py-2.5 text-sm font-medium rounded-lg border transition-all capitalize ${
                      formData.role === r
                        ? "bg-brand-600 border-brand-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300"
                    }`}
                  >
                    {r === "admin" ? "🛡️ Admin" : "👤 User"}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">Admin accounts have access to the management dashboard.</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`input-field pr-10 ${errors.password ? "border-red-400 focus:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              </div>
              {/* Strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? strengthColor[score] : "bg-slate-200 dark:bg-slate-700"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">{strengthLabel[score]}</p>
                </div>
              )}
              {errors.password && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm password</label>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`input-field ${errors.confirmPassword ? "border-red-400 focus:ring-red-500" : ""}`}
              />
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading && <Spinner size="sm" color="white" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}