import User from "../../Auth/models/user-authModel.js";

const deleteUserAccount = async(req, res)=>{

    try {
        const { id } = req.params;
        // const user = await User.findOne(id).select("-password");
    
        const deletedUserAcc =  await User.findByIdAndDelete(id);
        
        if(!deletedUserAcc){
            return res.status(404).json({
                message : "User does not exist"
            });
        }
        console.log(deletedUserAcc);
        
        return res.status(200).json({
            message : "Account deletion successful"
        })
    } 
    catch (error) {
        return res.status(500).json({
            message : "Something went wrong"
        });
    }
}

export default deleteUserAccount;