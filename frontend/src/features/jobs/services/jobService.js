// features/jobs/services/jobService.js
import api from "@/shared/api/apiClient";

// Get all jobs with optional filters
export const getJobs = async (filters = {}) => {
  const res = await api.get("/jobs", { params: filters });
  // Return full response to include pagination info
  return res.data;
};

// Get job by ID
export const getJobById = async (id) => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
};

// Get recruiter's created jobs
export const getRecruiterJobs = async () => {
  const res = await api.get("/jobs/recruiter/jobs");
  return res.data.jobs || res.data;
};

// Create a new job
export const createJob = async (jobData) => {
  const res = await api.post("/jobs", jobData);
  return res.data;
};

// Update a job
export const updateJob = async (id, jobData) => {
  const res = await api.put(`/jobs/${id}`, jobData);
  return res.data;
};

// Delete a job
export const deleteJob = async (id) => {
  const res = await api.delete(`/jobs/${id}`);
  return res.data;
};