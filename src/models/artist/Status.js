import mongoose from "mongoose";

const wish = ["Message Delivered Successfully", "Voice mail", "number not working"];

const customerFeedback = ["very happy", "exited", "happy"];

// Define status schema
const statusSchema = new mongoose.Schema({
  wishStatus: [{ type: String, enum: wish, required: true }],
  customerFeedbackStatus: [
    { type: String, enum: customerFeedback, required: true },
  ],
});

// Create and export Status model
const Status = mongoose.model("Status", statusSchema);

export default Status;
