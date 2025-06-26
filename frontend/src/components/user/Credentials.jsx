import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Edit } from "lucide-react";
import InputField from "../form/InputField";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { credentialsSchema } from "../../validation/zod-schemas";
import { handleErrors } from "../../validation/handleErrors";
import { toast } from "react-toastify";

function Credentials() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateCredentials } = useAuth();
  const methods = useForm({ resolver: zodResolver(credentialsSchema) });

  async function onSubmit(data) {
    const res = await updateCredentials(data);
    if (!res.success) handleErrors(res.errors, methods.setError);
    else {
      setIsEditing(false);
      toast.success(res.message);
    }
  }

  function handleCancel() {
    setIsEditing(false);
    methods.reset();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-8 items-center">
        <div className="space-y-1">
          <p className="text-2xl text-neutral-300">
            Name: <span className="font-semibold">{user.name}</span>
          </p>
          <p className="text-2xl text-neutral-300">
            Email: <span className="font-semibold">{user.email}</span>
          </p>
        </div>
        {!isEditing && (
          <button
            className="btn flex items-center gap-2"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <Edit size={20} /> Edit credentials
          </button>
        )}
      </div>

      {(isEditing || methods.formState.isSubmitting) && (
        <div className="p-5 bg-neutral-600 rounded-xl">
          <h3 className="text-2xl font-semibold mb-5 text-center">
            Edit credentials
          </h3>
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-3"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <InputField
                name="name"
                label="Name"
                type="name"
                defaultValue={user.name}
              />

              <InputField
                name="email"
                label="Email"
                type="email"
                defaultValue={user.email}
              />

              <div className="flex gap-3 justify-end">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={handleCancel}
                  disabled={methods.formState.isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className="btn-submit"
                  disabled={methods.formState.isSubmitting}
                >
                  Save
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
}
export default Credentials;
