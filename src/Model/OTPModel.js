const mongoose = require("mongoose");
const otpModel = mongoose.Schema({

  email: {
    type: String,
    required: true,
  
  },
  otp: {
    type: String,
 
  },
  status:{
      type:Number,
      default:0
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  __v: false,
});

const OTPModel = mongoose.model("OTP", otpModel);

module.exports = OTPModel;
