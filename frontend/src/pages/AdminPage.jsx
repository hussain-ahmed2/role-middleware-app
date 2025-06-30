import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Skeleton from "../components/Skeleton";

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await api.get("/admin");
        setUsers(res.data.users || []);
        setProducts(res.data.products || []);
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
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="my-10">
        <div className="grid grid-cols-2 gap-5">
          {loading ? (
            <CardSkeleton />
          ) : (
            <>
              <div className="flex flex-col justify-between items-center gap-5 bg-stone-700 p-5 rounded-md min-h-30">
                <span className="text-xl font-semibold">Total users</span>
                <span className="text-2xl font-semibold">{users.length}</span>
              </div>
              <div className="flex flex-col justify-between items-center gap-5 bg-stone-700 p-5 rounded-md min-h-30">
                <span className="text-xl font-semibold">Total products</span>
                <span className="text-2xl font-semibold">
                  {products.length}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminPage;

export const CardSkeleton = () => {
  return (
    <>
      <div className="flex flex-col justify-between items-center gap-5 bg-stone-700 p-5 rounded-md min-h-30">
        <Skeleton className="h-6 w-30 font-semibold bg-stone-600 rounded-md" />
        <Skeleton className="h-8 w-10 font-semibold bg-stone-600 rounded-md" />
      </div>
      <div className="flex flex-col justify-between items-center gap-5 bg-stone-700 p-5 rounded-md min-h-30">
        <Skeleton className="h-6 w-30 font-semibold bg-stone-600 rounded-md" />
        <Skeleton className="h-8 w-10 font-semibold bg-stone-600 rounded-md" />
      </div>
    </>
  );
};
