import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../validation/zod-schemas";
import { useAuth } from "../../hooks/useAuth";
import { handleErrors } from "../../validation/handleErrors";
import { toast } from "react-toastify";
import { useState } from "react";
import { Edit } from "lucide-react";
import InputField from "../form/InputField";

function ChangePassword() {
  const { updatePassword } = useAuth();
  const methods = useForm({ resolver: zodResolver(changePasswordSchema) });
  const [isEditing, setIsEditing] = useState(false);

  function handleCancel() {
    setIsEditing(false);
    methods.reset();
  }

  function handleEdit() {
    setIsEditing(true);
  }

  async function onSubmit(data) {
    const res = await updatePassword(data);
    if (!res.success) handleErrors(res.errors, methods.setError);
    else {
      setIsEditing(false);
      toast.success(res.message);
      methods.reset();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-8 items-center">
        <div className="space-y-1">
          <p className="text-2xl text-neutral-300">
            Password: <span className="font-semibold">**********</span>
          </p>
        </div>
        {!isEditing && (
          <button className="btn flex items-center gap-2" onClick={handleEdit}>
            <Edit size={20} />
            Edit Password
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-neutral-600 p-5 rounded-xl">
          <FormProvider {...methods}>
            <form
              className="form mt-10"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <InputField
                name="oldPassword"
                label="Old Password"
                type="password"
                placeholder="Enter your old password"
              />
              <InputField
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Enter your new password"
              />
              <div className="flex gap-3 justify-end">
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button className="btn-submit" type="submit">
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
export default ChangePassword;
