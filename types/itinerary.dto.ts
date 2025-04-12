import { Activity } from "./activity.dto";

export interface Itinerary {
  _id?: string;
  imageUrl: string;
  description: string;
  name: string;
  activities: Activity[];
}
