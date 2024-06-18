// otpService.js
import nodemailer from "nodemailer";
// import  twilio  from "twilio";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  
  auth: {
    user: process.env.NODEMAILER_USER, // Your email address
    pass: process.env.NODEMAILER_PASS, // Your password
  },
});

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const sendEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// const sendSMS = async (mobile, otp) => {
//   await twilioClient.messages.create({
//     body: `Your OTP code is ${otp}`,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: mobile,
//   });
// };

const generateOtpToken = (otp) => {
  return jwt.sign({ otp }, process.env.OTP_SECRET, { expiresIn: "10m" }); // Token expires in 10 minutes
};

export default { generateOTP, sendEmail,  generateOtpToken };
