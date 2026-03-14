import Job from "../models/jobSchema.js";

const deleteJob = async (req, res) =>{

    try {
        const job = await Job.findByIdAndDelete(req.params.id);
    
        if(!job){
            return res.status(404).json({
                message : "Job does not exist"
            });
        }
        
        if(job.recruiter.toString() !== req.user.id){
            return res.status(403).json({
                message: "Not authorized to modify this job"
            });
        }
        
        return res.status(200).json({
            message : "Job deleted successfully"
        })
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        });
    }

};

export default deleteJob;