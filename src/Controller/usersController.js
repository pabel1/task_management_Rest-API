const UserModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../Config/emailConfig");
const OTPModel = require("../Model/OTPModel");
const SendEmailUtility = require("../Config/demoConfig");

// registation
const regiController = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new UserModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPassword,
      photo: req.body.photo,
      phone: req.body.phone,
    });
    await user.save();
    res.status(200).json({
      data: user,
      massege: "data insert was successfull!",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// login
const loginController = async (req, res) => {
  try {
    const user = await UserModel.find({
      email: req.body.email,
    });

    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      ); //return true or false

      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id,
          },
          process.env.JWT_TOKEN,
          {
            expiresIn: "2h",
          }
        );
        console.log(token);
        res.status(200).json({
          access_token: token,
          message: "Login successful!",
          userData: user,
        });
      } else {
        res.status(401).json({
          error: "Authentication Failed !",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication Failed !",
      });
    }
  } catch (error) {
    res.status(401).json({
      error: "Authentication Failed !",
    });
  }
};

// profile update
const updateProfile = (req, res) => {
  const email = req.email;
  const reqBody = req.body;
  UserModel.updateOne({ email: email }, reqBody, (error) => {
    if (error) {
      res.status(500).json({ error: "there was an server side error" });
    } else {
      res.status(200).json({ massege: "data was successfully updated" });
    }
  });
};

// forget password
const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (email) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        const createOTP = await OTPModel.create({
          email: user.email,
          otp: otpCode,
        });
        let sendOTP = await SendEmailUtility(
          user.email,
          "Your PIN Code is= " + otpCode,
          "Task Manager PIN Verification"
        );
        res.status(200).json({
          status: "success",
          data: sendOTP,
          message: "password reset OTP sent ... please check your email!",
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Email is not Exist!",
        });
      }
    } else {
      res.status(500).json({
        status: "failed",
        message: "Enter Valid Email First!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "SomeThing Went Wrong!",
    });
  }
};

// verify Otp
const verifyOTPCode = async (req, res) => {
  const { email, otp } = req.body;
  try {
    let OTPCount = await OTPModel.findOne( { email: email, otp: otp, status:0 });
    // console.log(OTPCount)
    if (OTPCount) {
      let otpStatusUpdate = await OTPModel.updateOne(
        { email: email, otp: otp, status:0 },
        {
          email: email,
          otp: otp,
          status: 1,
        }
      );
      res.status(200).json({ status: "success", data: otpStatusUpdate });
    } else {
      res.status(400).json({ status: "fail", message: "Already used this OTP!" });
    }
  } catch (e) {
    res.status(500).json({ status: "fail", message: "Something Went wrong!", data: e });
  }
};

// recover password
const recoverPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
   const user= await UserModel.findOne({email:email})
    // console.log(user);
    if (user) {
      const newHashPassword = await bcrypt.hash(newPassword, 10);
      let updatePassword = await UserModel.updateOne(
        { email: email},
        { $set: { password: newHashPassword } }
      );
      res.status(200).json({
         status: "success",
         message: "Password Update Successfull",
          data: updatePassword 
        });
    } else {
      res.status(400).json({ status: "fail", message: "User not Exist!" });
    }
  } catch (e) {
    res.status(500).json({ status: "fail", message: "Something Went wrong!", data: e });
  }
};

module.exports = {
  regiController,
  loginController,
  updateProfile,
  resetPassword,
  verifyOTPCode,
  recoverPassword
};
