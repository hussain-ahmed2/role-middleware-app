import { Minus, Plus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

function IncrementAndDecrementQuantityButtons({
  id,
  quantity,
  setQuantity,
  itemQuantity,
}) {
  const { updateCart } = useAuth();

  useEffect(() => {
    if (quantity !== itemQuantity) {
      const timer = setTimeout(() => updateCart(id, quantity), 1000);
      return () => clearTimeout(timer);
    }
  }, [quantity]);

  return (
    <div className="flex gap-2 items-center">
      <button
        disabled={quantity <= 1}
        className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:bg-neutral-800 size-10"
        onClick={() => setQuantity((prev) => prev - 1)}
      >
        <Minus />
      </button>
      <button
        className="p-2 rounded-lg bg-neutral-800 hover:bg-green-600 transition duration-300 ease-in-out size-10"
        onClick={() => setQuantity((prev) => prev + 1)}
      >
        <Plus />
      </button>
    </div>
  );
}
export default IncrementAndDecrementQuantityButtons;
