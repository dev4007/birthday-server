import Notification from "../../models/admin/Notification.js";
import Schedule from "../../models/admin/Schedule.js";
import Artist from "../../models/artist/Artist.js";
import Status from "../../models/artist/Status.js";

export const getAllArtist = async (req, res) => {
  try {
    const Art = await Artist.find();
    res.status(200).json({ length: Art.length, data: Art });
  } catch (err) {
    console.error(`Error fetching Art: ${err.message}`);
    res.status(500).send("Server error");
  }
};

export const ScheduleList = async (req, res) => {
  try {
    const artistId = req.params;
    const schedules = await Schedule.find({ voiceArtist: artistId.id })
      .populate("customer", "firstName lastName") // Optionally populate customer details
      .sort({ dateAndTime: "asc" }); // Sort schedules by date/time

    const formattedSchedules = schedules.map((schedule) => ({
      birthdayWishesName: schedule.birthdayWishesName,
      customer: `${schedule.customer.firstName} ${schedule.customer.lastName}`,
      dateAndTime: schedule.dateAndTime,
      moreInformation: schedule.moreInformation,
    }));

    res
      .status(200)
      .json({ length: formattedSchedules.length, data: formattedSchedules });
  } catch (error) {
    console.error(`Error fetching Art: ${err.message}`);
    res.status(500).send("Server error");
  }
};

export const getArtistNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      sendNotificationTo: { $in: ["artist", "all"] },
    })
      .select("title description file createdAt -_id") // Select specific fields and exclude _id
      .exec();
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createStatus = async (req, res) => {
  const { wishStatus, customerFeedbackStatus } = req.body;

  try {
    // Validate the data against the schema
    const newStatus = new Status({
      wishStatus,
      customerFeedbackStatus,
    });

    // Perform Mongoose validation
    await newStatus.validate();

    // Save the validated status to the database
    const savedStatus = await newStatus.save();

    // Respond with selected fields
    const response = {
      _id: savedStatus._id,
      wishStatus: savedStatus.wishStatus,
      customerFeedbackStatus: savedStatus.customerFeedbackStatus,
    };

    res.status(201).json(response);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Validation Error:", error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.error("Error creating status:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};
