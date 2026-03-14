import Job from "../models/jobSchema.js"

const recruiterCreatedJobs = async (req, res) =>{

    try {
        const jobs = await Job.find({recruiter : req.user.id});
        if(!jobs){
            return res.status(404).json({
                message : "You have not created any jobs yet!"
            });
        }
    
        return res.status(200).json({
            jobs
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        });
    }
}
export default recruiterCreatedJobs;