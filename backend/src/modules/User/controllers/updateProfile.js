import User from "../../Auth/models/user-authModel.js";

const updateProfile = async (req, res) =>{
    try {
        const updateData = { ...req.body };

        // Parse skills if it's a JSON string (from FormData)
        if (updateData.skills && typeof updateData.skills === "string") {
            try {
                updateData.skills = JSON.parse(updateData.skills);
            } catch (e) {
                // If it's not valid JSON, keep it as is or as an array
                updateData.skills = updateData.skills.split(",").map(s => s.trim()).filter(s => s);
            }
        }

        // If an image file was uploaded, add the Cloudinary URL to the update data
        if (req.file) {
            updateData.profileImage = req.file.path;
        }
    
        const updatedDetails = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            {new :true, runvalidators : true} 
        ).select("-password");
        
        if( !updatedDetails ){
            return res.status(404).json({   
               message:  "Profile not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user : updatedDetails
        });
    } 
    catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message : "Something went wrong"
        })    
    }
}

export default updateProfile;