import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { api } from "../../api/axios";

function PickAvatar() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedAvatar = watch("defaultAvatar");

  useEffect(() => {
    async function getAvatars() {
      try {
        const res = await api.get("/avatars");
        setAvatars(res.data || []);

        if (res.data?.length) {
          setValue("defaultAvatar", res.data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getAvatars();
  }, [setValue]);

  if (loading) return <div>Loading Avatars...</div>;

  return (
    <div>
      <label className="block mb-2 font-medium">Pick an avatar</label>

      <div className="flex items-center gap-3 flex-wrap">
        {avatars.map((avatar) => {
          const fullUrl = `${import.meta.env.VITE_API_URL}/${avatar}`;

          return (
            <label key={avatar} className="cursor-pointer">
              <input
                type="radio"
                value={avatar}
                {...register("defaultAvatar")}
                className="hidden"
              />
              <img
                src={fullUrl}
                alt="avatar"
                onClick={() => setValue("defaultAvatar", avatar)}
                className={`w-16 h-16 rounded-full border-2 ${
                  selectedAvatar === avatar
                    ? "border-cyan-500"
                    : "border-transparent"
                }`}
              />
              {avatar === selectedAvatar && (
                <p className="text-sm text-cyan-700">Selected</p>
              )}
            </label>
          );
        })}
      </div>

      <div className="overflow-hidden">
        <p
          className={`text-rose-500 text-sm transition-all duration-300 ${
            errors.defaultAvatar ? "" : "h-0 translate-x-full opacity-0"
          }`}
        >
          {errors.defaultAvatar?.message}
        </p>
      </div>
    </div>
  );
}

export default PickAvatar;
