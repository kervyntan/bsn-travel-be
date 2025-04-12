export type ActivityType = "ACCOMODATION" | "FLIGHT" | "ACTIVITY";

export interface Activity {
  imageUrl: string;
  description: string;
  title: string;
  bestForHowManyPeople: number;
  type: ActivityType;
}
