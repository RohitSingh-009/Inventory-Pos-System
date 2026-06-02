import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-amber-500/20 bg-blue-800/50 p-6 shadow-2xl shadow-blue-950/20 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Products</h1>
            <p className="mt-2 text-amber-100/70">Keep your product inventory organized with easy editing and stock status.</p>
          </div>
          <button
            onClick={() => navigate("/products/add")}
            className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-semibold text-blue-900 shadow-lg shadow-amber-400/20 transition hover:brightness-110"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-amber-500/20 bg-blue-800/50 shadow-2xl shadow-blue-950/20">
          <table className="min-w-full divide-y divide-blue-700/50 text-left text-sm text-amber-50">
            <thead className="bg-blue-900/80 text-amber-200/80">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Barcode</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-700/50 bg-blue-900/40">
              {products.map((product) => {
                const isLowStock = product.stock_quantity <= (product.low_stock_limit ?? 0);
                return (
                  <tr key={product.id} className="transition hover:bg-blue-800/60">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.barcode}</td>
                    <td className="px-6 py-4">₹ {product.selling_price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isLowStock ? "bg-amber-400/20 text-amber-300" : "bg-blue-700/40 text-blue-200"}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="rounded-3xl bg-blue-700 px-4 py-2 text-sm font-medium text-amber-50 transition hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-amber-100/70">
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
