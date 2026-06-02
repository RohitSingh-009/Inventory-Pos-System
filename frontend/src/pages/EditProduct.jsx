import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, {
        ...product,
        category_id: Number(product.category_id),
        buying_price: Number(product.buying_price),
        selling_price: Number(product.selling_price),
        stock_quantity: Number(product.stock_quantity),
        low_stock_limit: Number(product.low_stock_limit),
      });
      navigate("/products");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center text-amber-100/70">Loading product...</div>;

  return (
    <AdminLayout>
      <div className="rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-white">Edit Product</h1>
          <p className="mt-2 text-amber-100/70">Update the item details and stock levels.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="col-span-full rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
          <input
            name="buying_price"
            value={product.buying_price}
            onChange={handleChange}
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
          <input
            name="selling_price"
            value={product.selling_price}
            onChange={handleChange}
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
          <input
            name="stock_quantity"
            value={product.stock_quantity}
            onChange={handleChange}
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
          <input
            name="low_stock_limit"
            value={product.low_stock_limit}
            onChange={handleChange}
            className="rounded-3xl border border-blue-700/50 bg-blue-950/80 px-4 py-3 text-amber-50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
          <button
            type="submit"
            className="col-span-full rounded-3xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-semibold text-blue-900 shadow-lg shadow-amber-400/20 transition hover:brightness-110"
          >
            Update Product
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export default EditProduct;