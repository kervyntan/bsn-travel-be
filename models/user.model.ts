import mongoose, { Schema } from "mongoose";
import { InterestsEnum, LanguagesEnum } from "../enums/enums";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  languages: {
    type: [String],
    enum: LanguagesEnum,
    default: [],
    required: true,
  },
  interests: {
    type: [String],
    enum: InterestsEnum,
    default: [],
    required: true,
  },
  connections: [Schema.Types.ObjectId],
  imageUrl: String,
});

const userModel = mongoose.model("Users", userSchema);

export default userModel;
