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
    batch_no: "",
    buying_price: "",
    selling_price: "",
    stock_quantity: "",
    low_stock_limit: "",
    expiry_date: "",
  });


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productNameRegex = /^[A-Za-z0-9\s&()-]+$/;

    if (!formData.name.trim()) {
      alert("Please enter the product name.");
      return;
    }

    if (!productNameRegex.test(formData.name.trim())) {
      alert("Please enter a valid product name.");
      return;
    }

    if (!formData.category_id) {
      alert("Please select a product category.");
      return;
    }

    if (Number(formData.stock_quantity) <= 0) {
      alert("Stock quantity must be greater than zero.");
      return;
    }

    if (
      Number(formData.buying_price) < 0 ||
      Number(formData.selling_price) < 0 ||
      Number(formData.stock_quantity) < 0 ||
      Number(formData.low_stock_limit) < 0
    ) {
      alert("Values cannot be negative.");
      return;
    }

  if (!formData.expiry_date) {
    alert("Please select an expiry date.");
    return;
  }

  const today = new Date();
  const selectedExpiry = new Date(formData.expiry_date);
  if (selectedExpiry < today.setHours(0, 0, 0, 0)) {
    alert("Expiry date cannot be in the past.");
    return;
  }

  try {
    const response = await api.post("/products", {
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      buying_price: Number(formData.buying_price),
      selling_price: Number(formData.selling_price),
      stock_quantity: 0,
      low_stock_limit: Number(formData.low_stock_limit),
    });

    const productId = response.data?.product_id;
    if (!productId) {
      throw new Error("Product creation failed");
    }

    const batchNo = formData.batch_no.trim() || `BATCH-${Date.now()}`;
    const todayString = new Date().toISOString().split("T")[0];

    await api.post("/batches", {
      product_id: productId,
      batch_no: batchNo,
      quantity: Number(formData.stock_quantity),
      manufacturing_date: todayString,
      expiry_date: formData.expiry_date,
    });

    navigate("/products");
  } catch (error) {
    console.log(error);
    alert("Failed To Create Product or Batch");
  }
};



  return (
    <AdminLayout>
      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-950">Add Product</h1>
          <p className="mt-2 text-slate-500">Fill the product details and save them to your inventory.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Product Name"
            className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            onChange={handleChange}
          />
          <select
            name="category_id"
            value={formData.category_id}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
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
  min="0"
  value={formData.buying_price}
  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
  onChange={handleChange}
/>

<input
  type="number"
  name="selling_price"
  placeholder="Selling Price"
  min="0"
  value={formData.selling_price}
  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
  onChange={handleChange}
/>
          <input
            type="number"
            name="stock_quantity"
            placeholder="Stock Quantity"
            min = '0'
            value = {formData.stock_quantity}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            onChange={handleChange}
          />
          <input
            type="text"
            name="batch_no"
            placeholder="Batch Number (optional)"
            value={formData.batch_no}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            onChange={handleChange}
          />
          <input
            type="date"
            name="expiry_date"
            placeholder="Expiry Date"
            value={formData.expiry_date}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            onChange={handleChange}
          />
          <input
            type="number"
            name="low_stock_limit"
            placeholder="Low Stock Limit"
            min="0"
            value={formData.low_stock_limit}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="col-span-full rounded-3xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
          >
            Save Product
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddProduct;