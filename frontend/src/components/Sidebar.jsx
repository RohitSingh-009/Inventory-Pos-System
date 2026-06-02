import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/pos", label: "POS Billing", icon: "💳" },
  { to: "/sales", label: "Sales History", icon: "🧾" },
  { to: "/reports", label: "Reports", icon: "📈" },
];

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <aside className="w-72 bg-blue-900 text-amber-50 min-h-screen border-r border-blue-800/50 shadow-xl">
      <div className="px-6 py-8">
        <div className="mb-10 rounded-[2rem] bg-blue-800/60 p-5 shadow-inner ring-1 ring-amber-400/20">
          <div className="inline-flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 text-2xl shadow-lg">
              🛒
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Grocery POS</p>
              <h1 className="text-2xl font-semibold text-white">Control Panel</h1>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-amber-400/20 text-amber-100 border-l-2 border-amber-400"
                    : "text-amber-50/70 hover:bg-blue-800/50 hover:text-amber-100"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 pt-6 border-t border-blue-800/50">
          <button
            onClick={logout}
            className="w-full rounded-3xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3 text-sm font-semibold text-blue-900 shadow-lg transition hover:brightness-110"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;