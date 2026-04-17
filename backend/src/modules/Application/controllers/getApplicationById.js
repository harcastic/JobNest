import Application from "../models/applicationSchema.js";

const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: "Application ID is required"
            });
        }

        const application = await Application.findById(id)
            .populate('user', 'username email profileImage')
            .populate('job', 'title companyName location salary jobType employmentType experienceLevel importantDates');

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Verify user owns this application
        if (application.user._id.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You're not authorized to view this application"
            });
        }

        return res.status(200).json({
            application
        });

    } catch (error) {
        console.error("Error fetching application:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

export default getApplicationById;
