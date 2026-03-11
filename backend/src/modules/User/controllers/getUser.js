import User from "../../Auth/models/user-authModel.js";

const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);   
    
        if(!user){
            return res.status(404).json({
                message : "User not found"
            });
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