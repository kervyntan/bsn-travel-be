import { DUMMY_ACTIVITIES } from "../constants/constants";
import ActivityModel from "../models/activity.model";
import { buildSuccessRes } from "../utils/response";

export class ActivitiesService {
  async insertDummyActivities() {
    await ActivityModel.insertMany(DUMMY_ACTIVITIES);
  }

  async getAllActivities() {
    const activities = await ActivityModel.find({});

    return buildSuccessRes("Fetched all activities", activities);
  }
}
