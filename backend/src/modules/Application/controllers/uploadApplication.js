import Job from "../../Jobs/models/jobSchema.js";
import Application from "../models/applicationSchema.js";

const uploadmyApplication = async(req, res)=>{
    try {
        const { jobId } = req.params;

        if(!jobId){
            return res.status(400).json({
                message : "Job ID is required"
            });
        }

        const jobexists = await Job.findById(jobId);
        if(!jobexists){
            return res.status(404).json({ 
                message : "Job does not exist"
            });
        }

        const alreadyApplied = await Application.findOne({
            user: req.user.id,
            job: jobId
        });

        if(alreadyApplied){
            return res.status(400).json({
                message: "You have already applied to this job"
            });
        }
        const resumeUrl = req.file.path;

        const uploadApp = await Application.create({
            ...req.body,
            resume : resumeUrl,
            user : req.user.id,
            job : jobId,
            recruiter: jobexists.recruiter
        });
    
        return res.status(201).json({
            uploadApp
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        });
    }
}

export default uploadmyApplication;