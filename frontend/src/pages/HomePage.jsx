import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="page items-center justify-center">
      <section className="p-10 space-y-5 rounded-lg bg-neutral-800 my-10 shadow-md hover:shadow-xl transition duration-300 ease-in-out">
        <h2 className="text-4xl font-medium">
          Welcome to the <span className="font-bold text-white">Logo</span>{" "}
          store
        </h2>
        <p className="text-2xl font-medium">
          Here you can find the best products for you
        </p>
        <Link to="/products" className="btn py-3 block w-fit">
          Explore products
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
