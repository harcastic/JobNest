import Job from "../models/jobSchema.js";

const getAllJobs = async (req, res) => {

    try {
        const Alljobs = await Job.find();

        if(!Alljobs){
            return res.status(404).json({
                message : "Falied to fetch jobs"
            });
        } 
    
        return res.status(200).json({
            Alljobs
        })
    
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}
export default getAllJobs;