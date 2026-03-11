import User from "../../Auth/models/user-authModel.js"

const getAllUsers = async (req, res) =>{
    try {
        
        const users = await User.find().select("-password");
        if(!users){
            return res.status(404).json({
                message : " No users found"
            });
        }

        return res.status(200).json({
            count : req.users.length,
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