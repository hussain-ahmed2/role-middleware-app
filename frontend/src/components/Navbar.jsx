import { Link, NavLink } from "react-router-dom";
import SiteLogo from "./SiteLogo";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, loading, logout, cart } = useAuth();

  return (
    <nav className="flex justify-between items-center min-h-20 px-5 max-w-7xl mx-auto">
      <Link to="/">
        <SiteLogo />
      </Link>

      <ul className="flex gap-8">
        <li>
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-cyan-500" : ""}`
            }
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-cyan-500" : ""}`
            }
            to="/products"
          >
            Products
          </NavLink>
        </li>
        <li className="relative">
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isActive ? "text-cyan-500" : ""}`
            }
            to="/cart"
          >
            Cart
          </NavLink>
          {cart.length > 0 && (
            <div className="absolute -top-4 -right-4 bg-neutral-600 text-white rounded-full px-2 text-sm aspect-square flex items-center justify-center">
              {cart.length}
            </div>
          )}
        </li>
      </ul>

      <ul className="flex gap-8 items-center">
        {loading ? (
          <li>Loading...</li>
        ) : user ? (
          <>
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link flex items-center gap-1 border-2 rounded-full transition duration-300 ease-in-out ${
                    isActive
                      ? "border-cyan-500"
                      : "border-transparent hover:border-neutral-500"
                  }`
                }
                title={user.name}
              >
                <img
                  className="size-12 rounded-full"
                  src={
                    user.avatar
                      ? `${import.meta.env.VITE_API_URL}/${user.avatar}`
                      : `${import.meta.env.VITE_API_URL}/${user.defaultAvatar}`
                  }
                  alt={`Avatar of ${user.name}`}
                />
              </NavLink>
            </li>
            {user.role === "admin" && (
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "text-cyan-500" : ""}`
                  }
                  to="/admin"
                >
                  Admin
                </NavLink>
              </li>
            )}
            <li>
              <button onClick={logout} className="btn-danger">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "text-cyan-500" : ""}`
                }
                to="/login"
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "text-cyan-500" : ""}`
                }
                to="/register"
              >
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
export default Navbar;
