import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function POS() {
  const [barcode, setBarcode] =useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.quantity * item.selling_price,
    0
  );

  const changeReturn = cashReceived > 0 ? cashReceived - totalAmount : 0;

  const clearCart = () => {
    setCart([]);
    setCashReceived("");
  };

  const generateBill = async () => {
    try {
      if (cart.length === 0) {
        alert("Cart is empty.");
        return;
      }

      const payload = {
        items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        payment_received: Number(cashReceived),
      };

      const response = await api.post("/sales", payload);
      navigate(`/receipt/${response.data.sale_id}`);
      setCart([]);
      setCashReceived("");
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Bill Creation Failed");
    }
  };
const handleBarcodeSearch =
async (code) => {

  try {

    const response =
      await api.get(
        `/products/barcode/${code}`
      );

    addToCart(
      response.data
    );

    setBarcode("");

  } catch (error) {

    console.log(error);

  }
};
  return (
    <AdminLayout>


      <input
        type="text"
        placeholder="Scan Barcode"
        value={barcode}
        onChange={(e)=>
          setBarcode(e.target.value)
        }
        className="w-full border p-3 rounded mb-4"
        onKeyDown={(e) => {

        if (e.key === "Enter") {

          handleBarcodeSearch(
            barcode
          );

        }

}}
      />
      <div className="space-y-6">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">Point of Sale</h1>
              <p className="mt-2 text-slate-500">Sell faster with a modern checkout workflow.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/products")}
                className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-200"
              >
                Product Catalog
              </button>
              <button
                onClick={clearCart}
                className="rounded-3xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold text-slate-950">Products</h2>
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100 md:w-80"
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">Stock: {product.stock_quantity}</p>
                    </div>
                    <span className="rounded-3xl bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">₹ {product.selling_price}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Tap to add item to cart</p>
                </button>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                  No products match your search.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-950">Cart</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{cart.length} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                Add products to the cart to start billing.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-slate-950">{item.name}</p>
                        <p className="text-sm text-slate-500">₹ {item.selling_price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => decreaseQty(item.id)} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">-</button>
                        <span className="min-w-[2rem] text-center text-base font-semibold text-slate-950">{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">+</button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                      <span>Subtotal</span>
                      <span>₹ {item.quantity * item.selling_price}</span>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="mt-4 text-sm font-medium text-blue-700 transition hover:text-blue-900">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹ {totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Cash Received</label>
                <input
                  type="number"
                  min="0"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>Change Due</span>
                <span className={changeReturn < 0 ? "text-rose-500" : "text-blue-700"}>₹ {changeReturn.toFixed(2)}</span>
              </div>
              <button
                onClick={generateBill}
                className="mt-6 w-full rounded-3xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
              >
                Generate Receipt
              </button>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

export default POS;