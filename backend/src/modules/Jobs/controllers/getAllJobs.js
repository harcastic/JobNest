import Job from "../models/jobSchema.js";

const getAllJobs = async (req, res) =>{

    try {
        console.log(req.query);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page -1) * limit;
        
        const { title, location, jobType, companyName } = req.query;
        const filter = {};

        if(title){
            filter.title = { $regex : title, $options: 'i'};
        }
    
        if(location){
            filter.location = location;
        }
    
        if(jobType){
            filter.jobType = jobType;
        }
    
        if(companyName){
            filter.companyName = { $regex: companyName, $options: "i" };
        }
    
        const jobs = await Job.find(filter)
            .skip(skip)
            .limit(limit)
            .populate("recruiter", "username email");

        const totalJobs = await Job.countDocuments();
        
        return res.status(200).json({
            totalJobs,
            currentPage :page,
            totalPage : Math.ceil(totalJobs/ limit),
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
export default getAllJobs;