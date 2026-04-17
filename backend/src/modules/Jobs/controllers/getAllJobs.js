import Job from "../models/jobSchema.js";

const getAllJobs = async (req, res) =>{

    try {
        console.log(req.query);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page -1) * limit;
        
        const { title, location, jobType, companyName, employmentType, experienceLevel, salaryMin, salaryMax } = req.query;
        const filter = {};

        if(title){
            filter.title = { $regex : title, $options: 'i'};
        }
    
        if(location){
            filter.location = { $regex: location, $options: 'i' };
        }
    
        if(jobType){
            filter.jobType = jobType;
        }
    
        if(companyName){
            filter.companyName = { $regex: companyName, $options: "i" };
        }

        if(employmentType){
            const types = employmentType.split(",").map(t => t.trim());
            
            // Build filter with backwards compatibility
            // Jobs without employmentType field are treated as "full-time"
            const orConditions = [];
            
            // Add explicit employment type matches
            orConditions.push({ employmentType: { $in: types } });
            
            // If "full-time" is selected, also include jobs without the field
            if (types.includes("full-time")) {
                orConditions.push({ employmentType: { $exists: false } });
                orConditions.push({ employmentType: null });
            }
            
            filter.$or = orConditions;
        }

        if(experienceLevel){
            const levels = experienceLevel.split(",").map(l => l.trim());
            filter.experienceLevel = { $in: levels };
        }

        if(salaryMin || salaryMax){
            filter.salary = {};
            if(salaryMin){
                filter.salary.$gte = parseInt(salaryMin);
            }
            if(salaryMax){
                filter.salary.$lte = parseInt(salaryMax);
            }
        }
    
        const jobs = await Job.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate("recruiter", "username email");

        const totalJobs = await Job.countDocuments(filter);
        
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