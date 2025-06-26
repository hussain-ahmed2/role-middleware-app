import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { api } from "../api/axios";
import { toast } from "react-toastify";

function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useLocalStorage("token", "");

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

  const register = async ({ name, email, password, defaultAvatar }) => {
    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        defaultAvatar,
      });
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  const setAvatar = async (avatar) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      const res = await api.put("/profile/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  const updateCredentials = async (credentials) => {
    try {
      const res = await api.put("/profile/credentials", credentials, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  const updatePassword = async (credentials) => {
    try {
      const res = await api.put("/profile/password", credentials, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  };

  useEffect(() => {
    async function getUser() {
      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/profile");
          setUser(res.data.user);
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
        setAvatar,
        updateCredentials,
        updatePassword,
      }}
    >
      {children}
    </AuthContext>
  );
}
export default AuthProvider;
