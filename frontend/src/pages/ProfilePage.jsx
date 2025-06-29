import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <section className="page">
      <div>
        <h1 className="text-4xl font-bold my-5">Profile</h1>
        <p className="text-2xl text-neutral-300">
          Welcome to your profile{" "}
          <span className="font-semibold text-cyan-600">{user.name}</span>
        </p>

        <div className="my-10 space-y-3">
          <h3>Credentials</h3>
          <div>
            <img
              className="size-32 border-4 rounded-full shadow-md"
              src={`${import.meta.env.VITE_API_URL}/${user.avatar}`}
              alt={`avatar of ${user.name}`}
            />
          </div>
          <p>Email: {user.email}</p>
          <p>Name: {user.name}</p>

          <Link to="/profile/edit" className="btn block w-fit">
            Edit Credentials
          </Link>
        </div>
      </div>
    </section>
  );
}
export default ProfilePage;
