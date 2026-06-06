import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { FiEdit, FiTrash2, FiSearch, FiFilter, FiArrowDown, FiArrowUp, FiMoreVertical } from "react-icons/fi";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        console.log("Products fetched:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Apply status filter
    if (activeFilter === "active") {
      result = result.filter((p) => p.stock_quantity > (p.low_stock_limit || 0));
    } else if (activeFilter === "low") {
      result = result.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= (p.low_stock_limit || 0));
    } else if (activeFilter === "out") {
      result = result.filter((p) => p.stock_quantity === 0);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sort
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "stock_quantity" || sortConfig.key === "selling_price") {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, activeFilter, sortConfig]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  const getStatus = (product) => {
    if (product.stock_quantity === 0) {
      return { label: "Out", color: "bg-red-50 text-red-700" };
    } else if (product.stock_quantity <= (product.low_stock_limit || 0)) {
      return { label: "Low", color: "bg-amber-50 text-amber-700" };
    }
    return { label: "Active", color: "bg-green-50 text-green-700" };
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Products</h1>
              <p className="mt-1 text-sm text-slate-600">Manage SKUs, pricing, stock levels and supplier relationships.</p>
            </div>
            <button
              onClick={() => navigate("/products/add")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              <span>+</span> New
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap gap-2">
            {["all", "active", "low", "out"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filter === "all" && "All"}
                {filter === "active" && "Active"}
                {filter === "low" && "Low"}
                {filter === "out" && "Out of stock"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search SKU, customer, employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <FiFilter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              {sortConfig.direction === "asc" ? <FiArrowUp className="h-4 w-4" /> : <FiArrowDown className="h-4 w-4" />}
              Sort
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
            <button onClick={() => handleSort("name")} className="flex items-center gap-2 text-left text-xs font-semibold text-slate-600">
              PRODUCT {sortConfig.key === "name" && (sortConfig.direction === "asc" ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />)}
            </button>
            <button onClick={() => handleSort("barcode")} className="flex items-center gap-2 text-left text-xs font-semibold text-slate-600">
              SKU {sortConfig.key === "barcode" && (sortConfig.direction === "asc" ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />)}
            </button>
            <div className="text-left text-xs font-semibold text-slate-600">CATEGORY</div>
            <button onClick={() => handleSort("selling_price")} className="flex items-center gap-2 text-left text-xs font-semibold text-slate-600">
              PRICE {sortConfig.key === "selling_price" && (sortConfig.direction === "asc" ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />)}
            </button>
            <button onClick={() => handleSort("stock_quantity")} className="flex items-center gap-2 text-left text-xs font-semibold text-slate-600">
              STOCK {sortConfig.key === "stock_quantity" && (sortConfig.direction === "asc" ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />)}
            </button>
            <div className="text-left text-xs font-semibold text-slate-600">STATUS</div>
            <div className="text-center text-xs font-semibold text-slate-600">ACTIONS</div>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const status = getStatus(product);
                return (
                  <div key={product.id} className="grid grid-cols-7 gap-4 px-6 py-4 items-center hover:bg-slate-50">
                    <div><p className="text-sm font-medium text-slate-900">{product.name}</p></div>
                    <div><p className="text-sm text-slate-600">{product.barcode}</p></div>
                    <div><p className="text-sm text-slate-600">General</p></div>
                    <div><p className="text-sm font-semibold text-slate-900">₹{product.selling_price}</p></div>
                    <div><p className="text-sm font-medium text-slate-900">{product.stock_quantity}</p></div>
                    <div><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span></div>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => navigate(`/products/edit/${product.id}`)} className="p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition rounded-lg" title="Edit">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 transition rounded-lg" title="Delete">
                        <FiTrash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 transition rounded-lg">
                        <FiMoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-slate-500 text-sm">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Products;