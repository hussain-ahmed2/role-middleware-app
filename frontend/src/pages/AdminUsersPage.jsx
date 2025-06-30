import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import Skeleton from "../components/Skeleton";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const res = await api.get("/users");
        setUsers(res.data.users || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Users</h2>
      <div className="my-10">
        {loading ? (
          <UserSkeletons />
        ) : (
          <div>
            {users.length ? (
              <div>
                <div className="grid grid-cols-3 gap-5 p-3 font-bold text-lg bg-neutral-900 rounded-t">
                  <p>Name</p>
                  <p>Email</p>
                  <p>Action</p>
                </div>

                {users.map((user) => (
                  <div
                    className="grid grid-cols-3 gap-5 p-3 border-t border-neutral-600"
                    key={user._id}
                  >
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <div>
                      <Link
                        className="underline text-sm hover:text-cyan-600 transition duration-300 ease-in-out"
                        to={`/admin/users/${user._id}`}
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminUsersPage;

const UserSkeletons = () => {
  return (
    <div className="">
      <Skeleton className="grid grid-cols-3 gap-5 p-3 font-bold text-lg">
        <Skeleton className="bg-neutral-600 h-10 w-full rounded-md" />
        <Skeleton className="bg-neutral-600 h-10 w-full rounded-md" />
        <Skeleton className="bg-neutral-600 h-10 w-full rounded-md" />
      </Skeleton>

      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          className="grid grid-cols-3 gap-5 p-3 border-t border-neutral-600"
          key={index}
        >
          <Skeleton className="bg-neutral-600 h-8 w-full rounded-md" />
          <Skeleton className="bg-neutral-600 h-8 w-full rounded-md" />
          <Skeleton className="bg-neutral-600 h-8 w-full rounded-md" />
        </Skeleton>
      ))}
    </div>
  );
};
