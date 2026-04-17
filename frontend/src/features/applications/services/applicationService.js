// features/applications/services/applicationService.js
import api from "@/shared/api/apiClient";

export const applyToJob = async (jobId, formData) => {
  // formData should be a FormData object containing all application details
  const res = await api.post(`/applications/${jobId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getUserApplications = async () => {
  const res = await api.get("/applications/my-applications");
  return res.data;
};

export const deleteApplication = async (applicationId) => {
  const res = await api.delete(`/applications/${applicationId}`);
  return res.data;
};

export const deleteApplicationByJob = async (jobId) => {
  const res = await api.delete(`/applications/job/${jobId}`);
  return res.data;
};