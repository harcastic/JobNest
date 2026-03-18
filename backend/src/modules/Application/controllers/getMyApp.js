import Application from "../models/applicationSchema.js";

const getMyApplication = async(req, res)=>{

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1)*limit;

        const userApplication = await Application.find({user: req.user.id})
            .populate("job", "title companyName location")
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
        ;

        const totalApplications = await Application.countDocuments({
            user: req.user.id
        });

        if(userApplication.length === 0){
            return res.status(404).json({
                messgae : "You have not submitted any application yet!"
            });
        }
    
        return res.status(200).json({
            totalApplications,
            currentPage : page,
            totalPage : Math.ceil(totalApplications/limit),
            count : userApplication.length,
            userApplication
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            messgae  : "Something went wrong"
        });
    }

}

export default getMyApplication;