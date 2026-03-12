import { get } from "mongoose";
import Job from "../models/jobSchema.js";


const getJobsById = async(req, res) => {

    try {
        const { id } = req.params;
    
        const job = await Job.findById(id).select("-password");
    
        if(!job){
            return res.status(404).json({
                message : "Failed to fetch job"
            });
        }
        return res.status(200).json({
            job
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        });
    }
};

export default getJobsById;
