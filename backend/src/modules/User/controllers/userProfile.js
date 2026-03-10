import User from "../../Auth/models/user-authModel.js";

const getProfile = async(req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message : "No user exists"});
        }
    
        return res.status(200).json({
            user
        })
    } 
    catch (error) {
        return res.status(500).json({
            message : "something went wrong"
        })
    }
}

export default getProfile;

export const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message : "No user exists"});
        }    
        console.log(user);

        const deleteProfile = await User.findByIdAndDelete(req.user.id).select("-password");
        if(!deleteProfile ){
            return res.status(404).json({
                message : "Accound Deletion failed"
            })
        }
        console.log(deleteProfile);
        return res.status(200).json({
            user : deleteProfile
        })
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
} 