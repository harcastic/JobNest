// features/applications/hooks/useApplications.js
import { useEffect, useState } from "react";
import { getUserApplications } from "../services/applicationService";

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getUserApplications();
        
        // Backend returns userApplication in the response
        if (data.userApplication && Array.isArray(data.userApplication)) {
          setApplications(data.userApplication);
        } else if (Array.isArray(data)) {
          setApplications(data);
        } else if (data.applications && Array.isArray(data.applications)) {
          setApplications(data.applications);
        } else if (data.data && Array.isArray(data.data)) {
          setApplications(data.data);
        } else {
          setApplications([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching applications", err);
        setError("Failed to load applications. Please try again.");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return { applications, loading, error };
};