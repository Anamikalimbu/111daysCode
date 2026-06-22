import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! 🎉");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create account 🛒</h2>
        <p className="text-gray-500 text-sm mb-6">Join Mini Mart and start shopping</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <input
              name="name"
              placeholder="Anamika Rai"
              value={form.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
