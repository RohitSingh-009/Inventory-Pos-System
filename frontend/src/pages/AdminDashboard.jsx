import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_sales: 0,
    today_revenue: 0,
    low_stock_products: 0,
  });
  const [lowStock, setLowStock] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    fetchLowStock();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLowStock = async () => {
    try {
      const response = await api.get("/products/low-stock/list");
      setLowStock(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-amber-300/80">Welcome back</p>
              <h1 className="text-4xl font-semibold text-white">Admin Dashboard</h1>
              <p className="mt-2 max-w-2xl text-amber-100/70">
                Monitor inventory, sales, and stock alerts from the central control panel.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button
                onClick={() => navigate("/products")}
                className="rounded-3xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-600"
              >
                Manage Products
              </button>
              <button
                onClick={() => navigate("/pos")}
                className="rounded-3xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-semibold text-blue-900 shadow-lg shadow-amber-400/25 transition hover:brightness-105"
              >
                Open POS
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="rounded-3xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-600"
              >
                View Reports
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-blue-800 to-blue-900 border border-blue-700/50 p-6 shadow-xl shadow-blue-500/10">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Total products</p>
            <p className="mt-5 text-4xl font-semibold text-white">{stats.total_products}</p>
            <p className="mt-3 text-sm text-amber-100/70">Available items in the catalog</p>
          </div>
          <div className="rounded-[1.75rem] bg-gradient-to-br from-blue-800 to-blue-900 border border-blue-700/50 p-6 shadow-xl shadow-blue-500/10">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Total sales</p>
            <p className="mt-5 text-4xl font-semibold text-white">{stats.total_sales}</p>
            <p className="mt-3 text-sm text-amber-100/70">Sales completed this month</p>
          </div>
          <div className="rounded-[1.75rem] bg-gradient-to-br from-blue-800 to-blue-900 border border-blue-700/50 p-6 shadow-xl shadow-blue-500/10">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Today's revenue</p>
            <p className="mt-5 text-4xl font-semibold text-white">₹ {stats.today_revenue}</p>
            <p className="mt-3 text-sm text-amber-100/70">Revenue collected today</p>
          </div>
          <div className="rounded-[1.75rem] bg-gradient-to-br from-blue-800 to-blue-900 border border-blue-700/50 p-6 shadow-xl shadow-blue-500/10">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Low stock items</p>
            <p className="mt-5 text-4xl font-semibold text-white">{stats.low_stock_products}</p>
            <p className="mt-3 text-sm text-amber-100/70">Products needing restock</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-6 shadow-2xl shadow-blue-950/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Low Stock Alerts</h2>
              <p className="mt-1 text-sm text-amber-100/70">See which products need replenishing immediately.</p>
            </div>
            <span className="rounded-full bg-amber-400/20 px-4 py-2 text-sm font-semibold text-amber-300">
              {lowStock.length} items</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-blue-700/50 bg-blue-900/50">
            {lowStock.length === 0 ? (
              <div className="p-8 text-center text-amber-100/70">All products are currently healthy and in stock.</div>
            ) : (
              <div className="divide-y divide-blue-700/50">
                {lowStock.map((product) => (
                  <div key={product.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{product.name}</p>
                      <p className="text-sm text-amber-100/70">Current stock: {product.stock_quantity}</p>
                    </div>
                    <span className="inline-flex rounded-full bg-amber-400/20 px-3 py-1 text-sm font-semibold text-amber-300">
                      Reorder soon
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;