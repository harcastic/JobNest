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
        const employmentType = searchParams.get("employmentType");
        const salaryMin = searchParams.get("salaryMin");
        const salaryMax = searchParams.get("salaryMax");
        const experienceLevel = searchParams.get("experienceLevel");
        const page = searchParams.get("page") || 1;
        const limit = 12;  // Changed from 10 to 12 to match backend
        
        if (title) filters.title = title;
        if (location) filters.location = location;
        if (jobType) filters.jobType = jobType;
        if (companyName) filters.companyName = companyName;
        if (employmentType) filters.employmentType = employmentType;
        if (salaryMin) filters.salaryMin = salaryMin;
        if (salaryMax) filters.salaryMax = salaryMax;
        if (experienceLevel) filters.experienceLevel = experienceLevel;
        filters.page = page;
        filters.limit = limit;
        
        console.log("useJobs fetching with filters:", filters);
        
        // Call API with filters
        const response = await getJobs(filters);
        console.log("useJobs received response:", response);
        
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