const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    const id = req.user.id;
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "Fill all the required fields",
      });
    }
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id);
    if (!userDetails) {
        return res.status(404).json({
            success: false,
            message: "User not found",
          });
    }

    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
    await User.findByIdAndDelete({_id:id});

    return res.status(200).json({
        success:false,
        message:"User deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllUserDetails = async (req,res) =>{
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
            success:false,
            message:"User data fetched successfully",
            userDetails,
        });
    } catch (error) {
        console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}
