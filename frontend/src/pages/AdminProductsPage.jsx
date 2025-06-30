import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Skeleton from "../components/Skeleton";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const res = await api.get("/products");
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
      <h2 className="text-2xl font-bold">Products</h2>
      <div className="my-10">
        {loading ? (
          <ProductSkeletons />
        ) : (
          <div>
            {products.length ? (
              <div>
                <div className="grid grid-cols-3 gap-5 p-3 font-bold text-lg bg-neutral-900 rounded-t">
                  <p>Name</p>
                  <p>Price</p>
                  <p>Action</p>
                </div>

                {products.map((product) => (
                  <div
                    key={product._id}
                    className="grid grid-cols-3 gap-5 p-3 border-t border-neutral-600"
                  >
                    <p>{product.name}</p>
                    <p>${product.price}</p>
                    <div className="flex gap-2 items-center">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="btn p-2 text-sm flex gap-1 items-center"
                      >
                        Edit <Edit size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No products found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminProductsPage;

const ProductSkeletons = () => {
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
