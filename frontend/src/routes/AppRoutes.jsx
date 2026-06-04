import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import Products from "../pages/Products";
import POS from "../pages/POS";
import SalesHistory from "../pages/SalesHistory";
import AddProduct from "../pages/AddProduct";
import Receipt from "../pages/Receipt";
import EditProduct from "../pages/EditProduct";
import AdminRoute from "./AdminRoute";
import Reports from "../pages/Reports";
import ExpiryManagement from "../pages/ExpiryManagement";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
            path="/admin/dashboard"
            element={
          <ProtectedRoute>
            <AdminRoute>
                <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
            }
        />

        <Route
            path="/products"
            element={
                  <ProtectedRoute>
                    <AdminRoute>
                        <Products />
                    </AdminRoute>
                  </ProtectedRoute>
            }
        />

        <Route
            path="/pos"
            element={
                <ProtectedRoute>
                <POS />
                </ProtectedRoute>
            }
        />

        <Route
            path="/sales"
            element={
                <ProtectedRoute>
                <SalesHistory />
                </ProtectedRoute>
            }
        />


        <Route
            path="/products/add"
            element={
                 <ProtectedRoute>
                    <AdminRoute>
                        <AddProduct />
                    </AdminRoute>
                 </ProtectedRoute>
            }
        />   


        <Route
            path="/receipt/:id"
            element={<Receipt />}
        /> 

        <Route
            path="/products/edit/:id"
            element={
                 <ProtectedRoute>
                    <AdminRoute>
                        <EditProduct />
                    </AdminRoute>
                 </ProtectedRoute>
            }
        /> 
        
        <Route
            path="/reports"
            element={
                <ProtectedRoute>
                <AdminRoute>
                    <Reports />
                </AdminRoute>
                </ProtectedRoute>
            }
        />  

        <Route
            path="/expiry"
            element={
            <ProtectedRoute>
            <AdminRoute>
              <ExpiryManagement />
            </AdminRoute>
            </ProtectedRoute>
            }
        />


        </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;