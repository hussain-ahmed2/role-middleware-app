import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

function AvatarInput() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const { user } = useAuth();
  const avatarFile = watch("avatar");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (avatarFile instanceof File) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl("");
    }
  }, [avatarFile]);

  return (
    <div>
      <label htmlFor="avatar" className="w-full cursor-pointer">
        <span>Avatar (optional)</span>
        <img
          className="size-32 border-4 rounded-full shadow-md mx-auto"
          src={previewUrl || `${import.meta.env.VITE_API_URL}/${user.avatar}`}
          alt="Avatar Preview"
        />
        <p className="text-center mt-2">Upload an image</p>
      </label>
      <input
        id="avatar"
        name="avatar"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setValue("avatar", file);
          }
        }}
      />
      <p>
        {errors.avatar && (
          <span className="text-red-500">{errors.avatar.message}</span>
        )}
      </p>
    </div>
  );
}

export default AvatarInput;
