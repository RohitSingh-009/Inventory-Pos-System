import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Receipt() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await api.get(`/sales/${id}`);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReceipt();
  }, [id]);

  if (!data) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading receipt...</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 text-slate-950">
      <div className="mx-auto max-w-lg rounded-4xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-700 text-2xl text-white shadow-md">
            🧾
          </div>
          <h1 className="text-3xl font-semibold text-slate-950">Grocery POS Receipt</h1>
          <p className="mt-2 text-slate-500">Thank you for your purchase!</p>
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Invoice</span>
            <span>{data.sale.invoice_number}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Date</span>
            <span>{new Date(data.sale.created_at).toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {data.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-950">Product {item.product_id}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-slate-950">₹ {item.subtotal}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <div className="flex justify-between pb-3">
            <span>Total</span>
            <span className="font-semibold text-slate-950">₹ {data.sale.total_amount}</span>
          </div>
          <div className="flex justify-between pb-3">
            <span>Paid</span>
            <span>₹ {data.sale.payment_received}</span>
          </div>
          <div className="flex justify-between text-blue-700">
            <span>Change</span>
            <span>₹ {data.sale.change_returned}</span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-8 w-full rounded-3xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}

export default Receipt;