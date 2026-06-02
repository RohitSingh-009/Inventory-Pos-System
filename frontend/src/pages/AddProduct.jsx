import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    buying_price: "",
    selling_price: "",
    stock_quantity: "",
    low_stock_limit: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", {
        ...formData,
        category_id: Number(formData.category_id),
        buying_price: Number(formData.buying_price),
        selling_price: Number(formData.selling_price),
        stock_quantity: Number(formData.stock_quantity),
        low_stock_limit: Number(formData.low_stock_limit),
      });
      navigate("/products");
    } catch (error) {
      console.log(error);
      alert("Failed To Create Product");
    }
  };

  return (
    <AdminLayout>
      <div className="rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-white">Add Product</h1>
          <p className="mt-2 text-amber-100/70">Fill the product details and save them to your inventory.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="col-span-full rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 placeholder-blue-300/50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            onChange={handleChange}
          />
          <select
            name="category_id"
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="buying_price"
            placeholder="Buying Price"
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 placeholder-blue-300/50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            onChange={handleChange}
          />
          <input
            type="number"
            name="selling_price"
            placeholder="Selling Price"
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 placeholder-blue-300/50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            onChange={handleChange}
          />
          <input
            type="number"
            name="stock_quantity"
            placeholder="Stock Quantity"
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 placeholder-blue-300/50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            onChange={handleChange}
          />
          <input
            type="number"
            name="low_stock_limit"
            placeholder="Low Stock Limit"
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 placeholder-blue-300/50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="col-span-full rounded-3xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-semibold text-blue-900 shadow-lg shadow-amber-400/20 transition hover:brightness-110"
          >
            Save Product
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddProduct;