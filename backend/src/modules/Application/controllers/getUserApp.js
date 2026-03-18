import Application from "../models/applicationSchema.js";
import Job from "../../Jobs/models/jobSchema.js";

const getUserApplication = async(req, res) =>{

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        const skip = (page -1) * limit;
        
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

        const userApp = await Application.find({job : jobId})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
        ;
        if(userApp.length === 0){
            return res.status(404).json({
                message : "Failed to fetch applications"
            });
        }
        const totalApp = await Application.countDocuments({
            job : jobId
        });
    
        return res.status(201).json({
            totalApp,
            currentPage : page,
            totalPage : (totalApp / limit),
            count : userApp.length,
            userApp
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
    
}

export default getUserApplication;