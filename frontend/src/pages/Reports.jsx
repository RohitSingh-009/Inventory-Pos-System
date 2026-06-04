import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function Reports() {
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const dailyResponse = await api.get("/reports/daily");
        const monthlyResponse = await api.get("/reports/monthly");
        const topProductsResponse = await api.get("/reports/top-products");

        setDaily(dailyResponse.data);
        setMonthly(monthlyResponse.data);
        setTopProducts(topProductsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReports();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-950">Reports</h1>
          <p className="mt-2 text-slate-500">Track performance across daily and monthly sales at a glance.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Daily Revenue</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">₹ {daily?.revenue || 0}</p>
            <p className="mt-2 text-slate-500">Sales: {daily?.sales_count || 0}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Monthly Revenue</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">₹ {monthly?.revenue || 0}</p>
            <p className="mt-2 text-slate-500">Sales: {monthly?.sales_count || 0}</p>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-950">Top Selling Products</h2>
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Quantity Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-slate-100">
                    <td className="px-6 py-4">{product.product_name}</td>
                    <td className="px-6 py-4">{product.quantity_sold}</td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-slate-500">
                      No report data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Reports;