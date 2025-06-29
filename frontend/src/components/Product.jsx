import { Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

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
          <div className="flex gap-2 items-center text-green-600">
            <Check /> Added to cart
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
