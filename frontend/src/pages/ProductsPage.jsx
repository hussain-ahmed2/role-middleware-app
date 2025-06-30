import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Product from "../components/Product";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);
  return (
    <div className="page">
      <h1 className="text-4xl font-bold mt-5">All products</h1>
      {loading ? (
        <div className="my-10">Loading products....</div>
      ) : products.length ? (
        <div className="grid grid-cols-3 gap-5 my-10">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div>No products found</div>
      )}
    </div>
  );
}
export default ProductsPage;
