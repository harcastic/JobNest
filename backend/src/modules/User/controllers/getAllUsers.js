import User from "../../Auth/models/user-authModel.js"

const getAllUsers = async (req, res) =>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip =  ((skip - 1) * limit);

        const users = await User.find().select("-password")
            .skip(skip)
            .limit(limit);
        
        const totalUsers = await User.countDocuments();

        if(!users){
            return res.status(404).json({
                message : " No users found"
            });
        }

        return res.status(200).json({
            totalUsers,
            currentPage : page,
            totalPage : Math.ceil(totalUsers / limit),
            count : users.length,
            users
        })
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        });
    }
}

export default getAllUsers;