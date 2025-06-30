import { useForm, FormProvider } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { credentialsSchema } from "../validation/zod-schemas";
import InputField from "../components/form/InputField";
import { Link, useNavigate } from "react-router-dom";
import AvatarInput from "../components/user/AvatarInput";
import { handleErrors } from "../validation/handleErrors";

function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: { name: user.name, email: user.email },
    resolver: zodResolver(credentialsSchema),
  });

  const onSubmit = async (data) => {
    const res = await updateProfile(data);

    if (res.success) {
      methods.reset({ name: user.name, email: user.email });
      navigate("/profile");
    } else handleErrors(res.errors, methods.setError);
  };

  return (
    <div className="page">
      <section>
        <h1 className="text-4xl font-bold my-5">Edit Profile</h1>

        <div>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="form mt-10"
              encType="multipart/form-data"
            >
              <AvatarInput />

              <InputField name="name" label="Name" />
              <InputField name="email" label="Email" />

              <div>
                <h3 className="mb-2">Change Password(Optional)</h3>
                <p className="text-sm text-neutral-400">
                  Leave empty if you don't want to change the password
                </p>
                <br />
                <InputField
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                />
                <InputField
                  name="newPassword"
                  label="New Password"
                  type="password"
                />
              </div>

              <div className="flex flex-row-reverse gap-5">
                <button type="submit" className="btn block w-fit">
                  Save
                </button>
                <Link to="/profile" className="btn block w-fit">
                  Cancel
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </div>
  );
}
export default EditProfilePage;
