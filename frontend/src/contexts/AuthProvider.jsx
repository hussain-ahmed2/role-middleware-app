import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { api } from "../api/axios";
import { toast } from "react-toastify";

function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useLocalStorage("token", "");
  const [cart, setCart] = useState([]);

  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);

      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    toast.success("Successfully logged out");
  };

  const register = async ({ name, email, password, avatar }) => {
    try {
      const res = await api.post(
        "/register",
        {
          name,
          email,
          password,
          avatar,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  async function updateProfile(credentials) {
    try {
      const res = await api.put("/profile", credentials, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }

  async function deleteFromCart(productId) {
    try {
      const res = await api.delete("/cart", { data: { productId } });
      setCart(res.data.cart);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }

  async function addToCart(productId) {
    try {
      const res = await api.post("/cart", { productId });
      setCart(res.data.cart);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }

  async function updateCart(productId, quantity) {
    try {
      const res = await api.put("/cart", { productId, quantity });
      setCart(res.data.cart);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }

  useEffect(() => {
    async function getUser() {
      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/profile");
          setUser(res.data.user);
          setCart(res.data.cart);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    getUser();
  }, [token]);

  return (
    <AuthContext
      value={{
        user,
        login,
        logout,
        loading,
        register,
        updateProfile,
        cart,
        deleteFromCart,
        addToCart,
        updateCart,
      }}
    >
      {children}
    </AuthContext>
  );
}
export default AuthProvider;
