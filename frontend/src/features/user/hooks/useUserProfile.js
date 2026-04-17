// features/user/hooks/useUserProfile.js
import { useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { user, loading, error };
};
