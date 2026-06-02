import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Receipt() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchReceipt();
  }, []);

  const fetchReceipt = async () => {
    try {
      const response = await api.get(`/sales/${id}`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center text-amber-100/70">Loading receipt...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 py-10 px-4 text-amber-50">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-8 shadow-2xl shadow-blue-950/40">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 text-2xl shadow-lg">
            🧾
          </div>
          <h1 className="text-3xl font-semibold text-white">Grocery POS Receipt</h1>
          <p className="mt-2 text-amber-100/70">Thank you for your purchase!</p>
        </div>

        <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-blue-700/50 bg-blue-900/50 p-5">
          <div className="flex justify-between text-sm text-amber-100/70">
            <span>Invoice</span>
            <span>{data.sale.invoice_number}</span>
          </div>
          <div className="flex justify-between text-sm text-amber-100/70">
            <span>Date</span>
            <span>{new Date(data.sale.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {data.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-[1.5rem] border border-blue-700/50 bg-blue-900/50 p-4">
              <div>
                <p className="font-semibold text-white">Product {item.product_id}</p>
                <p className="text-sm text-amber-100/70">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-white">₹ {item.subtotal}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-blue-700/50 bg-blue-900/50 p-6 text-sm text-amber-100">
          <div className="flex justify-between pb-3">
            <span>Total</span>
            <span className="font-semibold text-white">₹ {data.sale.total_amount}</span>
          </div>
          <div className="flex justify-between pb-3">
            <span>Paid</span>
            <span>₹ {data.sale.payment_received}</span>
          </div>
          <div className="flex justify-between text-amber-300">
            <span>Change</span>
            <span>₹ {data.sale.change_returned}</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-8 w-full rounded-3xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-semibold text-blue-900 shadow-lg shadow-amber-400/20 transition hover:brightness-110"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}

export default Receipt;