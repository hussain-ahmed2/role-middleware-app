import Avatar from "../components/user/Avatar";
import ChangePassword from "../components/user/ChangePassword";
import Credentials from "../components/user/Credentials";
import { useAuth } from "../hooks/useAuth";

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

        <div className="my-10">
          <div>
            <Avatar />
          </div>
          <hr className="my-5 text-neutral-600" />
          <div>
            <Credentials />
          </div>
          <hr className="my-5 text-neutral-600" />
          <div>
            <ChangePassword />
          </div>
        </div>
      </div>
    </section>
  );
}
export default ProfilePage;
