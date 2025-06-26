import { useAuth } from "../../hooks/useAuth";
import { avatarSchema } from "../../validation/zod-schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useState } from "react";

function Avatar() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, loading, setAvatar } = useAuth();

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(avatarSchema),
  });

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setValue("avatar", file, { shouldValidate: true });
    }
  }

  const onSubmit = async (data) => {
    const file = data.avatar;
    if (!file) return;

    const result = await setAvatar(file);

    if (result?.success) {
      setIsEditing(false);
      reset();
    }
  };

  if (loading) return null;

  console.log(user);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-8">
        <img
          className="avatar"
          src={
            user.avatar
              ? `${import.meta.env.VITE_API_URL}/${user.avatar}`
              : `${import.meta.env.VITE_API_URL}/${user.defaultAvatar}`
          }
          alt={`Avatar of ${user.name}`}
        />
        {!isEditing && !isSubmitting && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn flex items-center gap-2"
          >
            <Edit size={20} />
            Edit avatar
          </button>
        )}
      </div>

      {(isEditing || isSubmitting) && (
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 bg-neutral-600 p-5 rounded-xl"
        >
          <div className="flex flex-col gap-1">
            <input
              type="file"
              accept="image/*"
              className={`input ${
                errors.avatar ? "border-rose-700 ring-rose-500/50" : ""
              }`}
              onChange={handleChange}
            />
            <div className="overflow-hidden">
              <p
                className={`text-sm text-rose-500 transition-all duration-300 ${
                  errors.avatar ? "" : "h-0 translate-x-full opacity-0"
                }`}
              >
                {errors.avatar?.message}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              disabled={isSubmitting}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Avatar;
