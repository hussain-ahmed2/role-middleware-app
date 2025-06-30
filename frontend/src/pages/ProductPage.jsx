import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Check } from "lucide-react";
import IncrementAndDecrementQuantityButtons from "../components/IncrementAndDecrementQuantityButtons";

function ProductPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(null);
  const { id } = useParams();

  const { addToCart, cart } = useAuth();
  const item = cart.find((item) => item.product._id === product?._id);
  const isInCart = item !== undefined;

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

  useEffect(() => {
    setQuantity(item?.quantity);
  }, [product, item]);

  return (
    <div className="page">
      <h2 className="text-4xl font-bold mt-5">Product</h2>

      <div className="my-10">
        {loading ? (
          <p>Loading...</p>
        ) : product ? (
          <div className="space-y-3">
            <p className="font-bold">{product.name}</p>
            <p className="text-neutral-400">{product.description}</p>
            <p className="font-bold">${product.price}</p>

            <div>
              {isInCart ? (
                <div className="flex flex-col gap-3">
                  <p className="text-green-600 flex items-center">
                    <Check /> Added to cart
                  </p>
                  <div className="flex items-center gap-3">
                    <p>Quantity: {quantity}</p>
                    <div>
                      <IncrementAndDecrementQuantityButtons
                        id={product._id}
                        itemQuantity={item.quantity}
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />
                    </div>
                  </div>
                  <Link to="/cart" className="btn w-fit block">
                    Go to cart
                  </Link>
                </div>
              ) : (
                <button onClick={() => addToCart(product._id)} className="btn">
                  Add to cart
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>Product not found</p>
        )}
      </div>
    </div>
  );
}
export default ProductPage;
