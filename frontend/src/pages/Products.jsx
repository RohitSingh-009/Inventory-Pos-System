import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { FiEdit, FiTrash2 } from "react-icons/fi";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

    const handleDelete = async (id) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );

      if (!confirmDelete) return;

      try {
        await api.delete(`/products/${id}`);

        setProducts(
          products.filter((p) => p.id !== id)
        );

        alert("Product deleted successfully");
      } catch (error) {
        console.error(error);
        alert("Failed to delete product");
      }
    };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-4xl border border-slate-200 bg-white p-6 shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Products</h1>
            <p className="mt-2 text-slate-500">Keep your product inventory organized with easy editing and stock status.</p>
          </div>
          <button
            onClick={() => navigate("/products/add")}
            className="inline-flex items-center justify-center rounded-3xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-lg">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Barcode</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-10 py-4">Action</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-slate-50">
              {products.map((product) => {
                const isLowStock = product.stock_quantity <= (product.low_stock_limit ?? 0);
                return (
                  <tr key={product.id} className="transition hover:bg-slate-100">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.barcode}</td>
                    <td className="px-6 py-4">₹ {product.selling_price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isLowStock ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                 <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 ">
                      
                      <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="text-blue-600 hover:text-blue-800 width"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>

                    </div>
                  </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Products;
