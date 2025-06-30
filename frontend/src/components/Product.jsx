import { Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

function Product({ product }) {
  const { addToCart, cart } = useAuth();
  const isInCart = cart.some((item) => item.product._id === product._id);
  return (
    <div className="border border-neutral-600 bg-stone-700 p-5 rounded-lg shadow-md hover:bg-neutral-800 hover:shadow-xl transition duration-300 ease-in-out">
      <h3 className="text-2xl font-bold">{product.name}</h3>
      <p className="my-5">{product.description}</p>
      <p className="font-bold">${product.price}</p>
      <div className="flex justify-end mt-3">
        {isInCart ? (
          <div className="flex items-center gap-3">
            <p className="text-green-600 flex items-center">
              <Check /> Added to cart
            </p>
            <Link to="/cart" className="btn">
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
  );
}
export default Product;
