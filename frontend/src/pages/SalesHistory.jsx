import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function SalesHistory() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white">Sales History</h1>
          <p className="mt-2 text-amber-100/70">Review invoices and totals for completed transactions.</p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-amber-500/20 bg-blue-800/50 shadow-2xl shadow-blue-950/20">
          <table className="min-w-full divide-y divide-blue-700/50 text-left text-sm text-amber-50">
            <thead className="bg-blue-900/80 text-amber-200/80">
              <tr>
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-700/50 bg-blue-900/40">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-blue-800/60">
                  <td className="px-6 py-4">{sale.invoice_number}</td>
                  <td className="px-6 py-4">₹ {sale.total_amount}</td>
                  <td className="px-6 py-4">{new Date(sale.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-6 text-center text-amber-100/70">
                    No sales found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SalesHistory;