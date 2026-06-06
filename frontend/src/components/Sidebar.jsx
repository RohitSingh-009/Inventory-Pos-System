import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14V7" />
        <path d="M12 14V4" />
        <path d="M17 14v-4" />
      </svg>
    ),
  },
  {
    to: "/products",
    label: "Products",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M9 22V11" />
        <path d="M15 22V11" />
      </svg>
    ),
  },
  {
    to: "/employees",
    label: "Employees",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/pos",
    label: "POS Billing",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M2 11h20" />
        <path d="M6 15h.01" />
        <path d="M10 15h4" />
      </svg>
    ),
  },
  {
    to: "/sales",
    label: "Sales History",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M4 10h16" />
        <path d="M8 18h8" />
        <path d="M8 14h8" />
      </svg>
    ),
  },
  {
    to: "/reports",
    label: "Reports",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19h16" />
        <path d="M6 14V7" />
        <path d="M12 14V4" />
        <path d="M18 14v-6" />
      </svg>
    ),
  },
  {
    to: "/expiry",
    label: "Expiry",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h12" />
        <path d="M7 2v4" />
        <path d="M17 2v4" />
        <path d="M5 8h14v12H5z" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
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
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-700 text-white shadow-md">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2h12l1.5 4h-15L6 2z" />
                <path d="M4 6h16l-1.5 14h-13L4 6z" />
                <path d="M9 10h6" />
              </svg>
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