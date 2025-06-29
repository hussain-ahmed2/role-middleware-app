import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { api } from "../../api/axios";
import WebCam from "../WebCam";
import { cb64f } from "../../utils/utils";

function PickAvatar() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedAvatar = watch("avatar");

  const setSelectedAvatar = async (url) => {
    const value = await cb64f(url);

    setValue("avatar", value);
  };

  useEffect(() => {
    async function getAvatars() {
      try {
        const res = await api.get("/avatars");
        setAvatars(res.data || []);

        if (res.data?.length && !selectedAvatar) {
          setSelectedAvatar(res.data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getAvatars();
  }, []);

  if (loading) return <div>Loading Avatars...</div>;

  return (
    <div>
      <p className="block mb-2 font-medium">Pick an avatar</p>

      <div className="flex items-center gap-3 flex-wrap">
        {avatars.map((avatar) => (
          <Avatar
            key={avatar}
            avatar={avatar}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
          />
        ))}
        <div className="flex items-center gap-3">
          <div>Or</div>
          <WebCam setSelectedAvatar={setSelectedAvatar} />
        </div>
      </div>

      <div className="overflow-hidden">
        <p
          className={`text-rose-500 text-sm transition-all duration-300 ${
            errors.avatar ? "" : "h-0 translate-x-full opacity-0"
          }`}
        >
          {errors.avatar?.message}
        </p>
      </div>
    </div>
  );
}

export default PickAvatar;

function Avatar({ avatar, setSelectedAvatar, selectedAvatar }) {
  const { register } = useFormContext();
  const fullUrl = `${import.meta.env.VITE_API_URL}/${avatar}`;
  return (
    <label key={avatar} className="cursor-pointer">
      <input
        type="radio"
        value={avatar}
        {...register("avatar")}
        className="hidden"
      />
      <img
        src={fullUrl}
        alt="avatar"
        onClick={() => setSelectedAvatar(fullUrl)}
        className={`w-16 h-16 rounded-full border-2 ${
          avatar.includes(selectedAvatar?.name)
            ? "border-cyan-500"
            : "border-transparent"
        }`}
      />
      {avatar.includes(selectedAvatar?.name) && (
        <p className="text-sm text-cyan-700">Selected</p>
      )}
    </label>
  );
}
