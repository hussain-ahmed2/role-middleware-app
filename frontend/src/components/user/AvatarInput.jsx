import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Image } from "lucide-react";

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
        <div className="relative group mx-auto w-fit">
          <img
            className="size-32 border-4 rounded-full shadow-md group-hover:opacity-50 transition duration-300 ease-in-out"
            src={previewUrl || `${import.meta.env.VITE_API_URL}/${user.avatar}`}
            alt="Avatar Preview"
          />
          <p className="text-center mt-2">Upload an image</p>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
            <Image size={32} />
          </div>
        </div>
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
