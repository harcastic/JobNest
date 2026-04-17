// features/user/hooks/useUserProfile.js
import { useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      console.log("Fetched profile:", data);
      setUser(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Listen for image change events and refetch profile
  useEffect(() => {
    const handleImageChange = (event) => {
      console.log("ProfilePage: userImageChanged event received, refetching profile");
      fetchProfile();
    };

    window.addEventListener("userImageChanged", handleImageChange);
    return () => window.removeEventListener("userImageChanged", handleImageChange);
  }, []);

  return { user, loading, error };
};
