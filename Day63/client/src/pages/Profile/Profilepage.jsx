import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/api";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/Spinner";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email) errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Invalid email.";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const { data } = await authService.updateProfile(formData);
      updateUser(data.user);
      toast.success("Profile updated successfully.");
      setEditing(false);
      setErrors({});
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "", email: user?.email || "" });
    setErrors({});
    setEditing(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Avatar & Role Card */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-2xl ring-4 ring-brand-100 dark:ring-brand-900/50 shadow-lg"
              />
              <span className={`absolute -bottom-2 -right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${user?.role === "admin" ? "badge-admin" : "badge-user"}`}>
                {user?.role}
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Active account
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {formatDate(user?.createdAt).split(" at")[0]}
                </div>
              </div>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-secondary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Edit Form or Info Card */}
        {editing ? (
          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-5">
              Edit Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => { setFormData((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: "" })); }}
                  className={`input-field ${errors.name ? "border-red-400 focus:ring-red-500" : ""}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: "" })); }}
                  className={`input-field ${errors.email ? "border-red-400 focus:ring-red-500" : ""}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={loading} className="btn-primary">
                  {loading && <Spinner size="sm" color="white" />}
                  {loading ? "Saving…" : "Save changes"}
                </button>
                <button onClick={handleCancel} disabled={loading} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-5">Account Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name", value: user?.name },
                { label: "Email", value: user?.email },
                { label: "Role", value: <span className={user?.role === "admin" ? "badge-admin" : "badge-user"}>{user?.role}</span> },
                { label: "Account Status", value: <span className="badge-user text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">Active</span> },
                { label: "Member Since", value: formatDate(user?.createdAt) },
                { label: "Last Login", value: formatDate(user?.lastLogin) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</dt>
                  <dd className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Permissions Card */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-4">Permissions</h3>
          <div className="space-y-2.5">
            {[
              { label: "View profile", allowed: true },
              { label: "Update profile", allowed: true },
              { label: "Access admin dashboard", allowed: user?.role === "admin" },
              { label: "Manage users", allowed: user?.role === "admin" },
              { label: "Change user roles", allowed: user?.role === "admin" },
              { label: "Delete users", allowed: user?.role === "admin" },
            ].map(({ label, allowed }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
                {allowed ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Allowed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Restricted
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}