import InputField from "../components/form/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginSchema } from "../validation/zod-schemas";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrors } from "../validation/handleErrors";
import { toast } from "react-toastify";

function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const methods = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    const res = await login(data);
    if (res.success) {
      navigate("/profile");
      toast.success(res.message);
    } else handleErrors(res.errors, methods.setError);
  }

  if (loading) return null;

  return (
    <section className="page items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <h2 className="text-4xl font-medium text-center mb-5">Login</h2>
        <p className="text-lg font-medium text-center ">
          Login in to your account
        </p>
        <FormProvider {...methods}>
          <form
            className="form mt-10"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter you email address"
            />

            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter you password"
            />

            <button
              disabled={methods.formState.isSubmitting}
              className="btn-submit disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cyan-600"
            >
              {methods.formState.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </FormProvider>
        <p className="text-center mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
export default LoginPage;
