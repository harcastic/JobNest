import Application from "../models/applicationSchema.js";
import Job from "../../Jobs/models/jobSchema.js";

const updateMyApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, phone, location, portfolio, experience, skills, availability, salaryExpectation, workAuthorization } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Application ID is required"
            });
        }

        // Find the application
        const application = await Application.findById(id).populate('job');

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Verify user owns this application
        if (application.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You're not authorized to update this application"
            });
        }

        // Check if job registration deadline has passed
        if (application.job.importantDates?.applicationDeadline) {
            const deadline = new Date(application.job.importantDates.applicationDeadline);
            const now = new Date();
            
            if (now > deadline) {
                return res.status(400).json({
                    message: "Application deadline for this job has passed. You cannot update your application."
                });
            }
        }

        // Check if application status is not in a terminal state (allow update only if pending/reviewed)
        if (application.status === 'accepted' || application.status === 'rejected') {
            return res.status(400).json({
                message: `Cannot update application with status: ${application.status}`
            });
        }

        // Update the application
        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            {
                fullName: fullName || application.fullName,
                email: email || application.email,
                phone: phone || application.phone,
                location: location || application.location,
                portfolio: portfolio || application.portfolio,
                experience: experience || application.experience,
                skills: skills || application.skills,
                availability: availability || application.availability,
                salaryExpectation: salaryExpectation || application.salaryExpectation,
                workAuthorization: workAuthorization !== undefined ? workAuthorization : application.workAuthorization
            },
            { new: true }
        ).populate('job', 'title companyName location salary');

        return res.status(200).json({
            message: "Application updated successfully",
            application: updatedApplication
        });

    } catch (error) {
        console.error("Error updating application:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

export default updateMyApplication;
