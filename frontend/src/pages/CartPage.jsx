import CartItem from "../components/CartItem";
import { useAuth } from "../hooks/useAuth";

function CartPage() {
  const { cart } = useAuth();

  return (
    <div className="page">
      <section>
        <h1 className="text-4xl font-bold my-5">Cart</h1>

        <div className="my-10">
          {cart.length ? (
            <div>
              <div className="grid grid-cols-5 gap-5 bg-neutral-800 p-3">
                <p>Product</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Action</p>
              </div>
              {cart.map((item) => (
                <CartItem key={item.product._id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-2xl">Cart is empty</p>
          )}
        </div>
      </section>
    </div>
  );
}
export default CartPage;
