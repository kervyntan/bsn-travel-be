export type ActivityType = "ACCOMODATION" | "FLIGHT" | "ACTIVITY";

export interface Activity {
  _id?: string;
  imageUrl: string;
  description: string;
  title: string;
  bestForHowManyPeople: number;
  type: ActivityType;
}
