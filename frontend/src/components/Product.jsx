import { Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

function Product({ product }) {
  const { addToCart, cart } = useAuth();
  const isInCart = cart.some((item) => item.product._id === product._id);
  const navigate = useNavigate();

  const goToCart = (e) => {
    e.preventDefault();
    navigate("/cart");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="border border-neutral-600 bg-stone-700 p-5 rounded-lg shadow-md hover:bg-neutral-800 hover:shadow-xl transition duration-300 ease-in-out"
    >
      <h3 className="text-2xl font-bold">{product.name}</h3>
      <p className="my-5">{product.description}</p>
      <p className="font-bold">${product.price}</p>
      <div className="flex justify-end mt-3">
        {isInCart ? (
          <div className="flex items-center gap-3">
            <p className="text-green-600 flex items-center">
              <Check /> Added to cart
            </p>
            <button onClick={goToCart} className="btn">
              Go to cart
            </button>
          </div>
        ) : (
          <button onClick={handleAddToCart} className="btn">
            Add to cart
          </button>
        )}
      </div>
    </Link>
  );
}
export default Product;
