const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken")
require("dotenv").config();

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res.json({
        success: false,
        message: "User already registered",
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await OTP.create(otpPayload);

    res.json({
      success: true,
      message: "otp sent successfully",
      otp,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
  
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }
  
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1) 
  
    if(recentOtp.length == 0){
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if(otp !== recentOtp){
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }
  
    const hashedPassword = await bcrypt.hash(password,10);
  
    const profileDetails = await Profile.create({
      gender:null,
      dateOfBirth:null,
      about:null,
      contactNumber:null,
  
    })
  
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password:hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    
    res.status(200).json({
      success:true,
      massage:"User is registered Successfully"
    });
  } catch (error) {
   console.error(error);
   res.status(500).json({
    success:false,
    massage:"User can not be registered. Please try again later"
  })
  }
};


exports.logIn = async (req,res)=>{
  try {
    const {email,password} = req.body;

    if(!email || !password){
      return res.status().json({
        success:false,
        message:"All fields are required"
      })
    }

    const user = await User.findOne({email}).populate("additionalDetails");
    if(!user){
      return res.status(401).json({
        success:false,
        message:"User is not registered, please signUp first "
      })
    }

    if(await bcrypt(password,user.password)){
      const payload = {
        email:user.email,
        id:user._id,
        role:user.role,
      }
      const token = jwt.sign(payload,process.env.JWT_Secret,{
        expiresIn:"2h",
      })
      user.token = token;
      user.password = undefined;


      const options = {
        expires: new Date(Date.now() + 3*24*60*60*1000)
      }

      res.cookie("token",token,options).status(200).json({
        success:true,
        token,
        user,
        message:"LoggedIn Successfully"
      })
    } else{
      res.status(401).json({
        success:false,
        message:"incorrect password",
      })
    }


  } catch (error) {
    console.error(error);
    res.status(500).json({
      success:false,
      message:"Login failed try again later",
    })
  }
}


exports.changePassword = async (req,res) =>{
  //get old,new,confirm password from req.body
  //validate
  
  //Update pass in db
  //send mail
}