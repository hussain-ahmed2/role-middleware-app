import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";

function AdminUserProfilePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    async function getData() {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data.user || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [id]);

  return (
    <div className="page">
      <h2 className="text-4xl font-bold mt-5">User Profile</h2>

      <div className="my-10">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <div>
            <p className="text-xl text-center font-bold my-5">User details</p>
            <div>
              <img
                className="size-32 border-4 rounded-full shadow-md"
                src={`${import.meta.env.VITE_API_URL}/${user.avatar}`}
                alt={`avatar of ${user.name}`}
              />
            </div>
            <p className="my-5">Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p>User not found</p>
        )}
      </div>
    </div>
  );
}
export default AdminUserProfilePage;
