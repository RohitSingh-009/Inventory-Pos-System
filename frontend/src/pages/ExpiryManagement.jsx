import { useEffect, useState } from "react";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function ExpiryManagement() {
  const [batches, setBatches] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await api.get("/batches/expiry");
      setBatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const disposeBatch = async (id) => {
    try {
      await api.put(`/batches/dispose/${id}`);
      fetchBatches();
    } catch (error) {
      console.log(error);
    }
  };

  const frontShelfBatch = async (id) => {
    try {
      await api.put(`/batches/front-shelf/${id}`);
      fetchBatches();
    } catch (error) {
      console.log(error);
    }
  };

  const tabs = [
    { value: "all", label: "All" },
    { value: "expiring", label: "Expiring soon (≤7 days)" },
    { value: "critical", label: "Critical & expired (≤3 days or past)" },
  ];

  const filteredBatches = batches.filter((batch) => {
    if (filter === "all") return true;

    if (filter === "expiring") {
      return batch.days_remaining <= 7 && batch.days_remaining >= 0 && !batch.disposed;
    }

    if (filter === "critical") {
      return batch.days_remaining <= 3;
    }

    return true;
  });

  const total = batches.length;
  const fresh = batches.filter((x) => x.status === "fresh" && !x.disposed).length;
  const expiringSoon = batches.filter(
    (x) => x.status === "expiring" && !x.disposed
  ).length;
  const blockedCount = batches.filter(
    (x) => x.status === "critical" || x.status === "expired" || x.disposed
  ).length;

  const nextExpiryBatch = batches
    .filter((x) => !x.disposed && x.days_remaining >= 0)
    .sort((a, b) => a.days_remaining - b.days_remaining)[0];
  const nextExpiryLabel = nextExpiryBatch
    ? `${nextExpiryBatch.days_remaining} day${nextExpiryBatch.days_remaining === 1 ? "" : "s"}`
    : "N/A";

  const rowStyle = (batch) => {
    if (batch.disposed) return "bg-gray-100 text-gray-700";
    if (batch.status === "expired") return "bg-red-50 text-red-900";
    if (batch.status === "critical" || batch.status === "expiring") return "bg-orange-50 text-orange-900";
    return "bg-white text-gray-900";
  };

  const getBadge = (batch) => {
    if (batch.disposed) {
      return (
        <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full text-sm font-semibold">
          Disposed
        </span>
      );
    }

    if (batch.status === "expired") {
      return (
        <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
          Expired
        </span>
      );
    }

    if (batch.days_remaining <= 3) {
      return (
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          {batch.days_remaining} Days Left
        </span>
      );
    }

    if (batch.days_remaining <= 7) {
      return (
        <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
          {batch.days_remaining} Days Left
        </span>
      );
    }

    return (
      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
        {batch.days_remaining} Days Left
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Expiry Management</h1>

        <div className="grid grid-cols-1 gap-4 mb-6 xl:grid-cols-4">
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg">
            <h3 className="text-sm uppercase tracking-wide text-slate-300">Total batches</h3>
            <p className="mt-4 text-4xl font-semibold">{total}</p>
            <p className="mt-2 text-sm text-slate-400">Tracked expiry batches</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1">Next expiry: {nextExpiryLabel}</span>
            </div>
          </div>
          <div className="bg-green-50 text-green-900 p-5 rounded-3xl shadow">
            <h3 className="text-sm uppercase tracking-wide">Fresh</h3>
            <p className="text-3xl font-semibold mt-3">{fresh}</p>
            <p className="mt-2 text-sm">More than 7 days left</p>
          </div>
          <div className="bg-orange-50 text-orange-900 p-5 rounded-3xl shadow">
            <h3 className="text-sm uppercase tracking-wide">Expiring soon</h3>
            <p className="text-3xl font-semibold mt-3">{expiringSoon}</p>
            <p className="mt-2 text-sm">4–7 days remaining</p>
          </div>
          <div className="bg-red-50 text-red-900 p-5 rounded-3xl shadow">
            <h3 className="text-sm uppercase tracking-wide">Expired</h3>
            <p className="text-3xl font-semibold mt-3">{blockedCount}</p>
            <p className="mt-2 text-sm">Critical, expired, or disposed</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === tab.value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Product name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Batch no</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Expiry date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Days remaining</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBatches.map((batch) => {
                const disabled = batch.disposed || batch.status === "expired";
                return (
                  <tr key={batch.id} className={`${rowStyle(batch)} ${disabled ? "opacity-80" : ""}`}>
                    <td className="px-4 py-4 text-sm">{batch.product_name}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{batch.batch_no}</span>
                        {batch.is_fifo && (
                          <span className="bg-sky-100 text-sky-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                            FIFO
                          </span>
                        )}
                        {batch.front_shelf && !batch.disposed && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                            Front shelf
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{batch.quantity}</td>
                    <td className="px-4 py-4 text-sm">{batch.expiry_date}</td>
                    <td className="px-4 py-4 text-sm">
                      {batch.days_remaining < 0 ? 0 : batch.days_remaining}
                    </td>
                    <td className="px-4 py-4 text-sm">{getBadge(batch)}</td>
                    <td className="px-4 py-4 text-sm">
                      {batch.disposed ? (
                        <span className="text-sm text-slate-500">Disposed</span>
                      ) : batch.status === "expired" ? (
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => disposeBatch(batch.id)}
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Dispose
                          </button>
                          <span className="text-xs text-red-700">Blocked — cannot bill</span>
                        </div>
                      ) : batch.status === "critical" || batch.status === "expiring" ? (
                        <button
                          type="button"
                          onClick={() => frontShelfBatch(batch.id)}
                          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Front shelf
                        </button>
                      ) : (
                        <span className="text-sm text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ExpiryManagement;