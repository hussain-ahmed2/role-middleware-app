import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RootLayout from "./components/layouts/RootLayout";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AuthProvider from "./contexts/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import { ToastContainer } from "react-toastify";
import EditProfilePage from "./pages/EditProfilePage";
import AdminLayout from "./components/AdminLayout";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminProductPage from "./pages/AdminProductPage";
import AdminCreateProduct from "./pages/AdminCreateProduct";
import AdminUserProfilePage from "./pages/AdminUserProfilePage";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/profile" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="bottom-left" />
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* public routes */}
            <Route index element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductPage />} />

            {/* guest routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />

            {/* private routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />

            {/* admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
            </Route>
            <Route
              path="/admin/users/:id"
              element={
                <AdminRoute>
                  <AdminUserProfilePage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/create"
              element={
                <AdminRoute>
                  <AdminCreateProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/:id"
              element={
                <AdminRoute>
                  <AdminProductPage />
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
