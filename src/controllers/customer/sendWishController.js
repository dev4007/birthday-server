// controllers/sendWishController.js

import SendWish from "../../models/customer/SendWishes.js";

export const sendWish = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    state,
    address,
    phoneNumber,
    email,
    birthdayCallDateTime,
    favoriteCharacter,
    specialMessage,
  } = req.body;

  const uploadedPhoto = req.file ? req.file.path : null; // Assuming multer uploads the file and provides its path

  try {
    const newWish = new SendWish({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      state,
      address,
      phoneNumber,
      email,
      birthdayCallDateTime,
      favoriteCharacter,
      specialMessage,
      uploadedPhoto,
    });

    await newWish.save();
    res.status(201).json({ message: "Wish sent successfully", data: newWish });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWishes = async (req, res) => {
  try {
    const wishes = await SendWish.find();
    res.status(200).json({ wishes });
  } catch (err) {
    console.error(`Error fetching wishes: ${err.message}`);
    res.status(500).send("Server error");
  }
};
