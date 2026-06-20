import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [lightPreview, setLightPreview] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="token-text text-xs uppercase tracking-widest text-teal-500">Dashboard</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-slate-100">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
        </div>

        {/* Bonus: theme preview toggle */}
        <button
          onClick={() => setLightPreview((v) => !v)}
          className="rounded-md border border-ink-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-teal-500 hover:text-teal-400 transition-colors"
        >
          {lightPreview ? "Dark preview" : "Light preview"}
        </button>
      </div>

      <div
        className={`mt-8 rounded-2xl border p-8 transition-colors ${
          lightPreview ? "bg-slate-50 border-slate-200" : "bg-ink-800 border-ink-700"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/15 font-display text-lg font-semibold text-teal-400">
            {initials}
          </div>
          <div>
            <p className={`font-display text-lg font-semibold ${lightPreview ? "text-ink-900" : "text-slate-100"}`}>
              {user?.name}
            </p>
            <p className={`text-sm ${lightPreview ? "text-slate-600" : "text-slate-400"}`}>{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className={`rounded-xl border p-4 ${lightPreview ? "border-slate-200" : "border-ink-700"}`}>
            <p className={`text-xs uppercase tracking-wide ${lightPreview ? "text-slate-500" : "text-slate-500"}`}>
              Verification status
            </p>
            <p
              className={`mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium ${
                user?.isVerified ? "text-success" : "text-amber-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${user?.isVerified ? "bg-success" : "bg-amber-400"}`} />
              {user?.isVerified ? "Verified" : "Pending verification"}
            </p>
          </div>

          <div className={`rounded-xl border p-4 ${lightPreview ? "border-slate-200" : "border-ink-700"}`}>
            <p className="text-xs uppercase tracking-wide text-slate-500">Member since</p>
            <p className={`mt-1.5 text-sm font-medium ${lightPreview ? "text-ink-900" : "text-slate-100"}`}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        This page is protected — it loaded only because your session JWT was verified by the server.
      </p>
    </div>
  );
}
