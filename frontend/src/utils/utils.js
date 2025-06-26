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
