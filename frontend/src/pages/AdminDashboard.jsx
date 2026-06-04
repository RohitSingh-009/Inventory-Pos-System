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

    fetchDashboard();
    fetchLowStock();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-700/80">Welcome back</p>
              <h1 className="text-4xl font-semibold text-slate-950">Admin Dashboard</h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Monitor inventory, sales, and stock alerts from the central control panel.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button
                onClick={() => navigate("/products")}
                className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-200"
              >
                Manage Products
              </button>
              <button
                onClick={() => navigate("/pos")}
                className="rounded-3xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
              >
                Open POS
              </button>
              <button
                onClick={() => navigate("/reports")}
                className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-200"
              >
                View Reports
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-blue-700 p-6 text-white shadow-md">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-100">Total products</p>
            <p className="mt-5 text-4xl font-semibold">{stats.total_products}</p>
            <p className="mt-3 text-sm text-blue-100">Available items in the catalog</p>
          </div>
          <div className="rounded-3xl bg-slate-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Total sales</p>
            <p className="mt-5 text-4xl font-semibold text-slate-950">{stats.total_sales}</p>
            <p className="mt-3 text-sm text-slate-500">Sales completed this month</p>
          </div>
          <div className="rounded-3xl bg-slate-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Today's revenue</p>
            <p className="mt-5 text-4xl font-semibold text-slate-950">₹ {stats.today_revenue}</p>
            <p className="mt-3 text-sm text-slate-500">Revenue collected today</p>
          </div>
          <div className="rounded-3xl bg-slate-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Low stock items</p>
            <p className="mt-5 text-4xl font-semibold text-slate-950">{stats.low_stock_products}</p>
            <p className="mt-3 text-sm text-slate-500">Products needing restock</p>
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Low Stock Alerts</h2>
              <p className="mt-1 text-sm text-slate-500">See which products need replenishing immediately.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {lowStock.length} items</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            {lowStock.length === 0 ? (
              <div className="p-8 text-center text-slate-500">All products are currently healthy and in stock.</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {lowStock.map((product) => (
                  <div key={product.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{product.name}</p>
                      <p className="text-sm text-slate-500">Current stock: {product.stock_quantity}</p>
                    </div>
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
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