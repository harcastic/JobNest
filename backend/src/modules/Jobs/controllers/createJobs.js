import Job from "../models/jobSchema.js"

const createJobs = async ( req, res ) => {

   try {
        const job = await Job.create({ 
            ...req.body, 
            recruiter: req.user.id 
        });
    
        if(!job){
            return res.status(404).json({
                message : " Job creation failed "
            });
        }
    
        return res.status(201).json({
            job
        });
   } 
   catch (error) {
        return res.status(500).json({
            message  : "Something went wrong"
        });
   }
};

export default createJobs;