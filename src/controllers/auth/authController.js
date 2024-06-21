import Admin from "../../models/admin/Admin.js";
import Artist from "../../models/artist/Artist.js";
import Customer from "../../models/customer/Customer.js";
import User from "../../models/auth/authModel.js";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinaryUploader from "../../utils/cloudinaryUpload.js";
import EmailService from "../../services/emailService.js";
import upload from "../../utils/uploadAudio.js";

dotenv.config();

const usedTokens = {};

export const Register = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ msg: "Multer error" });
    } else if (err) {
      return res.status(500).json({ msg: "Unknown error" });
    }

    try {
      const { role, ...userData } = req.body;

      const { email, password, confirmPassword } = userData;
      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let newUser;

      switch (role) {
        case "admin":
          newUser = new Admin({
            ...userData,
            role: role,
            password: hashedPassword,
          });
          break;
        case "artist":
          // Convert specialtyForVoiceMessage to array if it's a single string
          if (userData.specialtyForVoiceMessage) {
            userData.specialtyForVoiceMessage =
              userData.specialtyForVoiceMessage
                .split(",")
                .map((specialty) => specialty.trim());
          }

          if (userData.charactersForVoiceOver) {
            userData.charactersForVoiceOver = userData.charactersForVoiceOver
              .split(",")
              .map((specialty) => specialty.trim());
          }
          const audioResponses = await cloudinaryUploader(req, res);

          if (!audioResponses || audioResponses.length === 0) {
            return res.status(500).json({ msg: "Error uploading audio files" });
          }
          // Ensure charactersForVoiceOver and voiceRecording are indexed properly
          const charactersForVoiceOver = userData.charactersForVoiceOver;

          // Check if number of charactersForVoiceOver matches number of audio responses
          if (charactersForVoiceOver.length !== audioResponses.length) {
            return res.status(400).json({
              msg: "Number of charactersForVoiceOver must match number of uploaded voice recordings",
            });
          }

          const voiceRecording = audioResponses.map((response, index) => ({
            character: charactersForVoiceOver[index] || "", // Ensure character is defined
            display_name: response.display_name || "", // Ensure display_name is defined
            secure_url: response.secure_url || "", // Ensure secure_url is defined
          }));

          newUser = new Artist({
            ...userData,
            role: role,
            password: hashedPassword,
            voiceRecording: voiceRecording,
          });
          break;
        case "customer":
          newUser = new Customer({
            ...userData,
            role: role,
            password: hashedPassword,
          });
          break;
        default:
          return res.status(400).json({ msg: "Invalid role" });
      }

      await newUser.save();
      res.status(201).json({
        msg: `${newUser.role} registered successfully`,
        data: newUser,
      });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ msg: "Server error" });
    }
  });
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if user is suspended
    if (user.suspended) {
      return res.status(403).json({
        msg: "Your account is suspended. Please contact support for assistance.",
      });
    }
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Password" });
    }
    // Generate JWT
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "20m", // Short-lived access token
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: "30d", // Long-lived refresh token
      }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },

      token: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const RefreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Refresh token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );
    res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};

export const RequestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Include user ID in the token payload
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });

    await EmailService.sendPasswordResetEmail(email, token);

    res
      .status(200)
      .json({ message: "Password reset instructions sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const ResetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Check if token exists in the usedTokens object
    if (usedTokens[token]) {
      return res.status(400).json({ error: "Token already used" });
    }

    const resetToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!resetToken) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Verify both email and user ID from the token payload
    const user = await User.findOne({ _id: resetToken.userId }); // Assuming userId is the MongoDB ObjectId of the user

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Add token to the usedTokens object
    usedTokens[token] = true;

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
