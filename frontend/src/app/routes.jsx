import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import JobsPage from "../features/jobs/pages/JobsPage";
import JobDetailPage from "../features/jobs/pages/JobDetailPage";
import RecruiterJobsPage from "../features/jobs/pages/RecruiterJobsPage";
import CreateJobPage from "../features/jobs/pages/CreateJobPage";
import EditJobPage from "../features/jobs/pages/EditJobPage";
import AppliedJobs from "../features/applications/pages/AppliedJobs";
import ApplyJobPage from "../features/applications/pages/ApplyJobPage";
import ProfilePage from "../features/user/pages/ProfilePage";
import EditProfilePage from "../features/user/pages/EditProfilePage";
import DeleteProfilePage from "../features/user/pages/DeleteProfilePage";
import Navbar from "../shared/components/Navbar";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Job Routes */}
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        
        {/* Recruiter Routes */}
        <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
        <Route path="/jobs/create" element={<CreateJobPage />} />
        <Route path="/jobs/edit/:id" element={<EditJobPage />} />

        {/* Application Routes */}
        <Route path="/apply/:id" element={<ApplyJobPage />} />
        <Route path="/applications" element={<AppliedJobs />} />

        {/* User Profile Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/delete" element={<DeleteProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}