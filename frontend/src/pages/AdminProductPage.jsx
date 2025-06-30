import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useParams } from "react-router-dom";
import ProductFrom from "../components/ProductFrom";

function ProductPage() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function getData() {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product || []);
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
      <h2 className="text-4xl font-bold mt-5">Product</h2>

      <div className="my-10">
        {loading ? (
          <p>Loading...</p>
        ) : product ? (
          <div>
            <p className="text-xl text-center font-bold my-5">Update product</p>
            <ProductFrom product={product} />
          </div>
        ) : (
          <p>Product not found</p>
        )}
      </div>
    </div>
  );
}
export default ProductPage;
