import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/employees", label: "Employees", icon: "👥" },
  { to: "/pos", label: "POS Billing", icon: "💳" },
  { to: "/sales", label: "Sales History", icon: "🧾" },
  { to: "/reports", label: "Reports", icon: "📈" },
  { to: "/expiry" , label: "Expiry" , icon: " ⌛"}
];

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <aside className="w-72 bg-white text-slate-950 min-h-screen border-r border-slate-200 shadow-lg">
      <div className="px-6 py-8">
        <div className="mb-10 rounded-4xl bg-slate-50 p-5 shadow-sm ring-1 ring-slate-200">
          <div className="inline-flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-700 text-2xl text-white shadow-md">
              🛒
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Grocery POS</p>
              <h1 className="text-2xl font-semibold text-slate-950">Control Panel</h1>
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
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full rounded-3xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;