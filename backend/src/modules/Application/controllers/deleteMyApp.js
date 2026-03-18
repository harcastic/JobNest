import Application from "../models/applicationSchema.js";

const deleteMyApplication = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({
                message: "Application ID is required"
            });
        }

        const myApp = await Application.findById(id);

        if (!myApp) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (myApp.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You're not authorized to delete this application"
            });
        }

        await Application.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Application deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

export default deleteMyApplication;