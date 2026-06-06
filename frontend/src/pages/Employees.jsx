import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { FiEdit, FiTrash2, FiSearch, FiMessageSquare, FiPhone, FiMoreVertical } from "react-icons/fi";

function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    roles: {}
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees");
        console.log("Employees fetched:", response.data);
        setEmployees(response.data);
        
        // Calculate stats
        const roleMap = {};
        response.data.forEach(emp => {
          roleMap[emp.role] = (roleMap[emp.role] || 0) + 1;
        });
        
        setStats({
          total: response.data.length,
          active: response.data.length,
          roles: roleMap
        });
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    let result = [...employees];

    if (searchTerm) {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(result);
  }, [employees, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this employee?")) return;

    try {
      await api.delete(`/employees/${id}`);
      setEmployees(employees.filter((e) => e.id !== id));
      alert("Employee deactivated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate employee");
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      "admin": "bg-purple-100 text-purple-800",
      "manager": "bg-blue-100 text-blue-800",
      "cashier": "bg-green-100 text-green-800",
      "staff": "bg-amber-100 text-amber-800",
      "warehouse": "bg-indigo-100 text-indigo-800",
    };
    return colors[role?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (id) => {
    const colors = [
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-purple-400 to-purple-600",
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-orange-400 to-orange-600",
      "bg-gradient-to-br from-red-400 to-red-600",
    ];
    return colors[id % colors.length];
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">Staff Management</p>
              <h1 className="text-4xl font-bold text-slate-900 mt-2">Employees</h1>
              <p className="mt-2 text-slate-600">Team performance, shifts and access across all locations.</p>
            </div>
            <button
              onClick={() => navigate("/employees/add")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              <span className="text-lg">+</span> New
            </button>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600 font-medium">Headcount</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600 font-medium">On shift now</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{Math.floor(stats.active * 0.4)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600 font-medium">Avg performance</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">4.8/5</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600 font-medium">Open roles</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">2</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU, customer, employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                {/* Header with more options */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full ${getAvatarColor(employee.id)} flex items-center justify-center text-white font-bold text-lg`}>
                      {getInitials(employee.name)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{employee.name}</h3>
                      <p className="text-sm text-slate-500">{employee.role}</p>
                    </div>
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 transition">
                    <FiMoreVertical size={18} />
                  </button>
                </div>

                {/* Status */}
                <div className="mb-4 flex items-center gap-2">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleColor(employee.role)}`}>
                    {employee.role}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6 pb-4 border-b border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Email</p>
                    <p className="text-sm text-slate-900 mt-1">{employee.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Status</p>
                      <p className="text-sm text-slate-900 mt-1 flex items-center gap-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        Active
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Joined</p>
                      <p className="text-sm text-slate-900 mt-1">2 months ago</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">
                    <FiMessageSquare size={16} />
                    Message
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition">
                    <FiPhone size={16} />
                    Call
                  </button>
                </div>

                {/* Edit/Delete */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/employees/edit/${employee.id}`)}
                    className="flex-1 px-3 py-2 rounded-lg text-slate-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center gap-2"
                  >
                    <FiEdit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="flex-1 px-3 py-2 rounded-lg text-slate-700 text-sm font-medium bg-red-50 hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    <FiTrash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">No employees found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Employees;
