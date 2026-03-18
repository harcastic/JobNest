import Application from "../models/applicationSchema.js";
import mongoose from "mongoose";
const deleteByJobApp = async (req, res) => { 
    try {
        const { jobId } = req.params;
 
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        const myApp = await Application.findOne({
            user: req.user.id,
            job: new mongoose.Types.ObjectId(jobId)
        });

        if (!myApp) {
            return res.status(404).json({
                message: "Application not found for this job"
            });
        }

        await Application.findByIdAndDelete(myApp._id);

        return res.status(200).json({
            message: "Application withdrawn successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

export default deleteByJobApp;