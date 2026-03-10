import User from "../../Auth/models/user-authModel.js";

const deleteProfile = async (req, res) => {
  try {

    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Account deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
};

export default deleteProfile;