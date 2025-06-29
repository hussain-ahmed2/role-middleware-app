import InputField from "../components/form/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { registerSchema } from "../validation/zod-schemas";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrors } from "../validation/handleErrors";
import { toast } from "react-toastify";
import PickAvatar from "../components/form/PickAvatar";

function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const methods = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data) {
    console.log(data);
    const res = await register(data);
    if (res.success) {
      navigate("/profile");
      toast.success(res.message);
    } else handleErrors(res.errors, methods.setError);
  }

  if (loading) return null;

  return (
    <section className="page items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <h2 className="text-4xl font-medium text-center mb-5">Register</h2>
        <p className="text-lg font-medium text-center ">
          Register and start shopping
        </p>
        <FormProvider {...methods}>
          <form
            className="form mt-10"
            onSubmit={methods.handleSubmit(onSubmit)}
            encType="multipart/form-data"
          >
            <PickAvatar />

            <InputField
              name="name"
              label="Name"
              type="name"
              placeholder="Enter you name address"
            />

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

            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />

            <button
              disabled={methods.formState.isSubmitting}
              className="btn-submit disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cyan-600"
            >
              {methods.formState.isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        </FormProvider>
        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
export default RegisterPage;
