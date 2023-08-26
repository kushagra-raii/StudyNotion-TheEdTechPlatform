const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

async function sendVerificationEmail(email,otp){
  try {
    const mailResponse = await mailSender(email,"Verification email from StudyNotion",otp)
    console.log("Email sent Successfully",mailResponse);
  } catch (error) {
    console.error( "Error occurred while sending mail",error)
  }
}

OTPSchema.pre("save",async function(next) {
  await sendVerificationEmail(this.email,this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
