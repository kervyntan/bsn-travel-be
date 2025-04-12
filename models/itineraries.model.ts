import mongoose, { Schema } from "mongoose";
import { activitySchema } from "./activity.model";

const itinerarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
  },
  members: [Schema.Types.ObjectId],
  activities: [activitySchema],
});

const ItineraryModel = mongoose.model("Itinerary", itinerarySchema);

export default ItineraryModel;
