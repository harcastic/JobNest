import User from "../../Auth/models/user-authModel.js";

const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select("-password");   
    
        if(!user){
            return res.status(404).json({
                message : "User not found"
            });
        }
        
        if(req.user.role === "recruiter" && user.role !== "user"){
            return res.status(403).json({
                message : "Recruiter can only view User profiles"
            })
        }
        return res.status(200).json({
            user
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        }) ; 
    }
};

export default getUser;