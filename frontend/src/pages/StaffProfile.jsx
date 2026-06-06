import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { getStaffList, getStaffSales, getStaffActivity } from "../services/staffApi";

function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [sales, setSales] = useState([]);
  const [activity, setActivity] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getStaffList({});
        const current = response.data.find((item) => item.id === Number(id));
        setStaff(current || null);
      } catch (error) {
        console.error(error);
      }
    };

    const loadSales = async () => {
      try {
        const response = await getStaffSales(Number(id));
        setSales(response.data.sales || []);
      } catch (error) {
        console.error(error);
      }
    };

    const loadActivity = async () => {
      try {
        const response = await getStaffActivity(Number(id));
        setActivity(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
    loadSales();
    loadActivity();
  }, [id]);

  useEffect(() => {
    setTotalRevenue(sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0));
  }, [sales]);

  if (!staff) {
    return (
      <AdminLayout>
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-lg">
          <p className="text-slate-600">Loading staff profile...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-700/80">Staff Profile</p>
              <h1 className="text-3xl font-semibold text-slate-950">{staff.name}</h1>
              <p className="mt-2 text-slate-500">Personal details, sales summary, and activity overview for this staff member.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/staff")}
              className="rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:bg-slate-200"
            >
              Back to Staff List
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Personal Details</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p>{staff.email}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <p>{staff.phone_number || "—"}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Role</p>
                <p>{staff.role}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Status</p>
                <p>{staff.is_active ? "Active" : "Inactive"}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Join Date</p>
                <p>{staff.join_date ? new Date(staff.join_date).toLocaleDateString() : "—"}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Sales Summary</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Orders</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{activity?.total_bills ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Revenue</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">₹ {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sales recorded</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{sales.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-950">Sales History</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Payment</th>
                  <th className="px-6 py-4 font-semibold">Change</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 text-slate-900">{sale.invoice_number}</td>
                    <td className="px-6 py-4 text-slate-700">₹ {sale.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-700">₹ {sale.payment_received.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-700">₹ {sale.change_returned.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(sale.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default StaffProfile;
