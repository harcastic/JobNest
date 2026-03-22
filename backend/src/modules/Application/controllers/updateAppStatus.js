import Application from "../models/applicationSchema.js";
import Job from "../../Jobs/models/jobSchema.js";

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Application ID is required"
            });
        }

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        const job = await Job.findById(application.job);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to update this application"
            });
        }

        if (application.status !== "pending") {
            return res.status(400).json({
                message: "Application already processed"
            });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { status },
            { runValidators: true, new: true }
        );

        return res.status(200).json({
            message: "Application status updated successfully",
            application: updatedApplication
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

export default updateApplicationStatus;