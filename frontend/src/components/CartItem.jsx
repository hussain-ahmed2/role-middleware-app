import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import IncrementAndDecrementQuantityButtons from "./IncrementAndDecrementQuantityButtons";
import { Trash2 } from "lucide-react";

function CartItem({ item }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { deleteFromCart } = useAuth();

  return (
    <div
      className="grid grid-cols-5 gap-5 p-3 border-b border-neutral-600 items-center"
      key={item.product._id}
    >
      <p>{item.product.name}</p>
      <p>${item.product.price}</p>
      <p>{quantity}</p>
      <p>${(item.product.price * item.quantity).toFixed(2)}</p>
      <div className="flex gap-2 items-center">
        <IncrementAndDecrementQuantityButtons
          id={item.product._id}
          quantity={quantity}
          itemQuantity={item.quantity}
          setQuantity={setQuantity}
        />
        <button
          onClick={() => deleteFromCart(item.product._id)}
          className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-600 transition duration-300 ease-in-out"
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
}
export default CartItem;
