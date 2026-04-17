// features/jobs/hooks/useJobs.js
import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import { useSearchParams } from "react-router-dom";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Build filter object from URL parameters
        const filters = {};
        
        const title = searchParams.get("title");
        const location = searchParams.get("location");
        const jobType = searchParams.get("jobType");
        const companyName = searchParams.get("companyName");
        const page = searchParams.get("page") || 1;
        const limit = 10;
        
        if (title) filters.title = title;
        if (location) filters.location = location;
        if (jobType) filters.jobType = jobType;
        if (companyName) filters.companyName = companyName;
        filters.page = page;
        filters.limit = limit;
        
        // Call API with filters
        const response = await getJobs(filters);
        
        // Handle both direct data return and full response
        if (Array.isArray(response)) {
          setJobs(response);
        } else if (response.jobs) {
          setJobs(response.jobs);
          setTotalPages(response.totalPage || 1);
          setCurrentPage(response.currentPage || 1);
        } else {
          setJobs([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setError("Failed to load jobs. Please try again later.");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  return { jobs, loading, error, totalPages, currentPage };
};