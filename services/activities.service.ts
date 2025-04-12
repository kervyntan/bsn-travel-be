import { Request } from "express";
import { DUMMY_ACTIVITIES } from "../constants/constants";
import ActivityModel from "../models/activity.model";
import { buildSuccessRes } from "../utils/response";
import { ObjectId } from "mongodb";

export class ActivitiesService {
  async insertDummyActivities() {
    await ActivityModel.insertMany(DUMMY_ACTIVITIES);
  }

  async getAllActivities() {
    const activities = await ActivityModel.find({});

    return buildSuccessRes("Fetched all activities", activities);
  }

  async getActivity(req: Request) {
    const { id } = req.params;
    const activity = await ActivityModel.findOne({
      _id: new ObjectId(id),
    });

    return buildSuccessRes("Fetched activity", activity);
  }
}
