import Job from "../models/jobSchema.js";

const getAllJobs = async (req, res) =>{

    try {
        console.log(req.query);
        
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
    
        const jobs = await Job.find(filter).populate("recruiter", "username email");
        
        return res.status(200).json({
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