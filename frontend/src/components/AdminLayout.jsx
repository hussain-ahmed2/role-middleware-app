import { useAuth } from "../hooks/useAuth";
import { Link, Outlet, useLocation } from "react-router-dom";

function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="page">
      <h1 className="text-4xl font-bold my-5">Admin Dashboard</h1>
      <p className="text-2xl text-neutral-300">
        Welcome to the admin dashboard{" "}
        <span className="font-semibold text-cyan-600">{user.name}</span>
      </p>

      <div className="my-10 grid grid-cols-4 gap-5 bg-neutral-800 p-3 rounded-lg flex-1">
        <div className="flex flex-col gap-3 pr-3 border-r-2 border-neutral-700">
          <Link
            className={`p-3 rounded-md transition duration-300 ease-in-out ${
              location.pathname === "/admin"
                ? "bg-cyan-700"
                : "hover:bg-neutral-600"
            }`}
            to=""
          >
            Dashboard
          </Link>
          <Link
            className={`p-3 rounded-md transition duration-300 ease-in-out ${
              location.pathname === "/admin/users"
                ? "bg-cyan-700"
                : "hover:bg-neutral-600"
            }`}
            to="users"
          >
            Users
          </Link>
          <Link
            className={`p-3 rounded-md transition duration-300 ease-in-out ${
              location.pathname === "/admin/products"
                ? "bg-cyan-700"
                : "hover:bg-neutral-600"
            }`}
            to="products"
          >
            Products
          </Link>
        </div>
        <div className="col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default AdminLayout;
