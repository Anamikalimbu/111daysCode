import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: "🔐",
    title: "JWT Authentication",
    description: "Secure token-based auth with automatic refresh and protected routes.",
  },
  {
    icon: "🛡️",
    title: "Role-Based Access Control",
    description: "Fine-grained permissions for Users and Admins with middleware enforcement.",
  },
  {
    icon: "👥",
    title: "User Management",
    description: "Admins can view, promote, demote, and remove users from one panel.",
  },
  {
    icon: "🌙",
    title: "Dark Mode",
    description: "Seamless dark/light theme switching with system preference detection.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "Real-time user stats, role distribution, and activity overview.",
  },
  {
    icon: "⚡",
    title: "MERN Stack",
    description: "MongoDB, Express, React, and Node.js with Vite for lightning-fast builds.",
  },
];

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-brand-950/30 dark:via-slate-950 dark:to-purple-950/20" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 border border-brand-100 dark:border-brand-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">Production-Ready MERN Application</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            Role-Based Access Control
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
              Dashboard
            </span>
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A complete full-stack authentication and authorization system built with MongoDB, Express, React, and Node.js. 
            Manage users, roles, and permissions with confidence.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/profile"}
                  className="btn-primary px-6 py-3 text-base"
                >
                  {isAdmin ? "Go to Dashboard" : "View Profile"}
                </Link>
                {isAdmin && (
                  <Link to="/admin/users" className="btn-secondary px-6 py-3 text-base">
                    Manage Users
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary px-6 py-3 text-base">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stack Badges */}
          <div className="flex flex-wrap gap-2 justify-center mt-10">
            {["MongoDB", "Express.js", "React", "Node.js", "JWT", "Tailwind CSS"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Built with security and developer experience in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-brand-600 to-purple-600 py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start building today
            </h2>
            <p className="text-brand-100 mb-8">
              Register an account to explore the dashboard, or sign in if you already have one.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition-colors text-sm shadow-sm"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-brand-500/40 hover:bg-brand-500/60 text-white font-semibold rounded-lg border border-white/20 transition-colors text-sm"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © 2024 RBAC Dashboard. Built with ❤️ using MERN stack.
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}