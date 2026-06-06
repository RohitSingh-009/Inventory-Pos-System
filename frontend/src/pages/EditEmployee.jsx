import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "cashier"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingEmployee, setLoadingEmployee] = useState(true);

  const roles = [
    { value: "admin", label: "Admin - Full system access" },
    { value: "manager", label: "Manager - Store management & reports" },
    { value: "cashier", label: "Cashier - POS & sales" },
    { value: "warehouse", label: "Warehouse - Inventory & stock" },
    { value: "staff", label: "Staff - Basic access" }
  ];

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/employees/${id}`);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        });
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError("Failed to load employee details");
      } finally {
        setLoadingEmployee(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.name.trim()) {
        setError("Please enter employee name");
        setLoading(false);
        return;
      }
      if (!formData.email.trim()) {
        setError("Please enter email address");
        setLoading(false);
        return;
      }

      // Call API to update employee
      await api.put(`/employees/${id}`, {
        name: formData.name,
        email: formData.email,
        role: formData.role
      });

      alert("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.response?.data?.detail || "Failed to update employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingEmployee) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-600">Loading employee details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/employees")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <FiArrowLeft size={20} />
          Back to Employees
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Edit Employee</h1>
          <p className="mt-2 text-slate-600">Update employee details and role.</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm max-w-2xl">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <FiAlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., john@example.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-slate-900 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                {roles.find(r => r.value === formData.role)?.label}
              </p>
            </div>

            {/* Role Info */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Role Permissions:</span>
              </p>
              <ul className="mt-2 space-y-1 text-xs text-blue-800 list-disc list-inside">
                {formData.role === "admin" && (
                  <>
                    <li>Access all features</li>
                    <li>Manage employees and roles</li>
                    <li>View analytics and reports</li>
                    <li>System configuration</li>
                  </>
                )}
                {formData.role === "manager" && (
                  <>
                    <li>View dashboard and reports</li>
                    <li>Manage products and inventory</li>
                    <li>View sales reports</li>
                    <li>Cannot manage system settings</li>
                  </>
                )}
                {formData.role === "cashier" && (
                  <>
                    <li>Access POS system</li>
                    <li>Process sales transactions</li>
                    <li>View basic reports</li>
                    <li>Cannot modify inventory</li>
                  </>
                )}
                {formData.role === "warehouse" && (
                  <>
                    <li>Manage inventory</li>
                    <li>Track stock levels</li>
                    <li>Manage product batches</li>
                    <li>View expiry management</li>
                  </>
                )}
                {formData.role === "staff" && (
                  <>
                    <li>Basic access only</li>
                    <li>View products</li>
                    <li>Limited functionality</li>
                  </>
                )}
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/employees")}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditEmployee;
