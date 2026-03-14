import Job from "../models/jobSchema.js"


const updateJob = async(req, res)=>{

   try {
        const { id } = req.params;
        const job = await Job.findByIdAndUpdate(
            id,
            req.body,
            {runvalidators : true, new : true}
        );
        if(!job){
            return res.status(403).json({
                message : "Job not found"
            });
        }
        if(job.recruiter.toString() !== req.user.id){
            return res.status(403).json({
                message: "Not authorized to modify this job"
            });
        }
    
        return res.status(201).json({
            job
        })
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        });
    }
};

export default updateJob;