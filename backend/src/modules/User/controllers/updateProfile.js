import User from "../../Auth/models/user-authModel.js";

const updateProfile = async (req, res) =>{
    try {
    
        const updatedDetails = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            {new :true, runvalidators : true}
        ).select("-password");
        
        if( !updatedDetails ){
            return res.status(404).json({   
               message:  "Profile not found"
            });
        }

        return res.status(200).json({
            user : updatedDetails
        });
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        })    
    }
}

export default updateProfile;