import { DUMMY_ACTIVITIES } from "../constants/constants";
import ActivityModel from "../models/activity.model";

export class ActivitiesService {
  async insertDummyActivities() {
    await ActivityModel.insertMany(DUMMY_ACTIVITIES);
  }
}
