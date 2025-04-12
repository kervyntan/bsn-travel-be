import { ObjectId } from "mongodb";

export type ActivityType = "ACCOMODATION" | "FLIGHT" | "ACTIVITY";

export interface Activity {
  _id?: ObjectId;
  _doc?: object;
  imageUrl: string;
  description: string;
  title: string;
  bestForHowManyPeople: number;
  createdBy: ObjectId; // userId
  type: ActivityType;
}
