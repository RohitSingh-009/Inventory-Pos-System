import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function SalesHistory() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await api.get("/sales");
        setSales(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSales();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-950">Sales History</h1>
          <p className="mt-2 text-slate-500">Review invoices and totals for completed transactions.</p>
        </div>

        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-slate-50">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-100">
                  <td className="px-6 py-4">{sale.invoice_number}</td>
                  <td className="px-6 py-4">₹ {sale.total_amount}</td>
                  <td className="px-6 py-4">{new Date(sale.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-6 text-center text-slate-500">
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