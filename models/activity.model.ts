import mongoose from "mongoose";
import { Activity } from "../types/activity.dto";

export const activitySchema = new mongoose.Schema<Activity>({
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bestForHowManyPeople: {
    type: Number,
    required: true,
    min: 1,
  },
  type: {
    type: String,
    enum: ["ACCOMODATION", "FLIGHT", "ACTIVITY"],
    required: true,
  },
});

const ActivityModel = mongoose.model<Activity>("Activity", activitySchema);

export default ActivityModel;
