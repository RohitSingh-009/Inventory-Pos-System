import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function Reports() {
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white">Reports</h1>
          <p className="mt-2 text-amber-100/70">Track performance across daily and monthly sales at a glance.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.75rem] border border-blue-700/50 bg-blue-900/50 p-6 shadow-lg shadow-blue-950/15">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Daily Revenue</p>
            <p className="mt-4 text-4xl font-semibold text-white">₹ {daily?.revenue || 0}</p>
            <p className="mt-2 text-amber-100/70">Sales: {daily?.sales_count || 0}</p>
          </div>
          <div className="rounded-[1.75rem] border border-blue-700/50 bg-blue-900/50 p-6 shadow-lg shadow-blue-950/15">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-200/80">Monthly Revenue</p>
            <p className="mt-4 text-4xl font-semibold text-white">₹ {monthly?.revenue || 0}</p>
            <p className="mt-2 text-amber-100/70">Sales: {monthly?.sales_count || 0}</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-6 shadow-2xl shadow-blue-950/20">
          <h2 className="text-2xl font-semibold text-white">Top Selling Products</h2>
          <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-blue-700/50 bg-blue-900/40">
            <table className="min-w-full divide-y divide-blue-700/50 text-left text-sm text-amber-50">
              <thead className="bg-blue-900/80 text-amber-200/80">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Quantity Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700/50">
                {topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-blue-800/60">
                    <td className="px-6 py-4">{product.product_name}</td>
                    <td className="px-6 py-4">{product.quantity_sold}</td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-8 text-center text-amber-100/70">
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