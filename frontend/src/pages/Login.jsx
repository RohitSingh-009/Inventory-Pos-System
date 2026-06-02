import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role);

      if (response.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/pos");
      }
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-amber-500/20 bg-blue-900/70 p-8 shadow-2xl shadow-blue-950/60 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 text-3xl shadow-xl">
            🛍️
          </div>
          <h1 className="text-3xl font-semibold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-amber-100/80">Manage your inventory and sales with ease.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm font-medium text-amber-50">
            Email
            <input
              type="email"
              placeholder="your@email.com"
              className="mt-2 w-full rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-white placeholder-blue-300/50 shadow-inner outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-amber-50">
            Password
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-2 w-full rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-white placeholder-blue-300/50 shadow-inner outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="w-full rounded-3xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-semibold text-blue-900 shadow-lg shadow-amber-400/30 transition hover:brightness-110">
            Login
          </button>
        </form>

        <div className="mt-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100/80">
          💡 Tip: Use your admin credentials to manage products and view reports.
        </div>
      </div>
    </div>
  );
}

export default Login;