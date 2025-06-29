import { api } from "../api/axios";

export async function getAvatars() {
  try {
    const res = await api.get("/avatars");
    return res.data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const cb64f = async (base64) => {
  const res = await fetch(base64);
  const blob = await res.blob();
  const filename = base64?.split("/")?.pop() || "avatar.jpg";
  return new File([blob], filename, {
    type: blob.type,
  });
};
