// features/user/services/userService.js
import api from "@/shared/api/apiClient";

export const getUserProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data.user;
};

export const updateUserProfile = async (profileData) => {
  const res = await api.put("/user/profile", profileData);
  return res.data.user;
};

export const deleteUserProfile = async () => {
  const res = await api.delete("/user/profile");
  return res.data;
};
