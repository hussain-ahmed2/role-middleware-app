import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="page items-center justify-center">
      <div className="text-center space-y-5">
        <h1 className="text-4xl font-bold">404 Not Found</h1>
        <p className="text-2xl">The page you are looking for does not exist.</p>
        <div className="flex gap-5 justify-center">
          <button className="btn" onClick={goHome}>
            Home
          </button>
          <button className="btn" onClick={goBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
