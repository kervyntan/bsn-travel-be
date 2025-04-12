import { ObjectId } from "mongodb";
import { Activity } from "./activity.dto";
import { User } from "./user.dto";

export interface Itinerary {
  _id?: string;
  _doc?: object;
  imageUrl: string;
  description: string;
  name: string;
  createdBy: ObjectId; // userId
  members: ObjectId[]; // List of userIds
  activities: Activity[];
}

export interface ItineraryDto {
  _id?: string;
  imageUrl: string;
  description: string;
  name: string;
  createdBy: User | null; // userId
  members: User[]; // List of userIds
  activities: Activity[];
}
