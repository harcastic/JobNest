import Job from "../models/jobSchema.js"

const recruiterCreatedJobs = async (req, res) =>{

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = ((page -1) * limit);

        const jobs = await Job.find({recruiter : req.user.id})
            .sort({createdAt : -1}) 
            .skip(skip)
            .limit(limit)    
        ;
        const allJobs = await Job.countDocuments({recruiter : req.user.id});

        if(jobs.length === 0){
            return res.status(404).json({
                message : "You have not created any jobs yet!"
            });
        }
        
        return res.status(200).json({
            allJobs,
            currentPage : page,
            totalPage : Math.ceil(allJobs / limit),
            count : jobs.length,
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