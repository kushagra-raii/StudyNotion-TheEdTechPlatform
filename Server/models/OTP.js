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



module.exports = mongoose.model("OTP", OTPSchema);
