import { Request } from "express";
import { DUMMY_ACTIVITIES } from "../constants/constants";
import ActivityModel from "../models/activity.model";
import { buildSuccessRes } from "../utils/response";
import { ObjectId } from "mongodb";
import userModel from "../models/user.model";
import { User } from "../types/user.dto";
import { Activity } from "../types/activity.dto";

export class ActivitiesService {
  async insertDummyActivities() {
    await ActivityModel.insertMany(DUMMY_ACTIVITIES);
  }

  async getAllActivities() {
    const activities = await ActivityModel.find({});

    const resultActivities = await Promise.all(
      activities.map(
        async (activity) => await this.mapCreatedByToMember(activity)
      )
    );

    return buildSuccessRes("Fetched all activities", resultActivities);
  }

  async getActivity(req: Request) {
    const { id } = req.params;
    const activity = await ActivityModel.findOne<Activity>({
      _id: new ObjectId(id),
    });

    if (!activity) {
      return buildSuccessRes("No activity found", null);
    }

    const mappedActivity = await this.mapCreatedByToMember(activity!);

    return buildSuccessRes("Fetched activity", mappedActivity);
  }

  async createActivity(req: Request) {
    const {
      imageUrl = "",
      description,
      createdBy,
      title,
      type,
      bestForHowManyPeople,
    } = req.body as Activity;

    const activity: Activity = {
      imageUrl: imageUrl,
      description: description,
      title: title,
      bestForHowManyPeople: bestForHowManyPeople,
      createdBy: new ObjectId(createdBy),
      type: type,
    };

    const createdActivity = await ActivityModel.create<Activity>(activity);

    return await this.mapCreatedByToMember(createdActivity["_doc"] as Activity);
  }

  private async mapCreatedByToMember(activity: Activity) {
    const createdBy = await userModel.findOne<User>({
      _id: new ObjectId(activity.createdBy),
    });

    return {
      ...activity["_doc"],
      createdBy,
    };
  }
}
