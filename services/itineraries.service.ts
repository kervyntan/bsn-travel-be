import mongoose from "mongoose";
import { DUMMY_ITINERARIES } from "../constants/constants";
import ItineraryModel from "../models/itineraries.model";
import userModel from "../models/user.model";
import { Itinerary, ItineraryDto } from "../types/itinerary.dto";
import {
  buildBadRequestResponse,
  buildStatusNotFoundResponse,
  buildSuccessRes,
} from "../utils/response";
import { ObjectId } from "mongodb";
import { User } from "../types/user.dto";
import { Request } from "express";

export class ItinerariesService {
  async insertDummyItineraries() {
    await ItineraryModel.insertMany(DUMMY_ITINERARIES);
  }

  async getAllItineraries() {
    const itineraries = await ItineraryModel.find<Itinerary>({});

    const returnedItineraries: ItineraryDto[] = [];

    await Promise.all(
      itineraries.map(async (itinearay: Itinerary) => {
        const members = await userModel.find<User>({
          _id: {
            $in: itinearay.members.map((member) => new ObjectId(member)),
          },
        });

        const createdBy = await userModel.findOne<User>({
          _id: new ObjectId(itinearay.createdBy),
        });

        const itineraryDto: ItineraryDto = {
          createdBy: createdBy,
          members: members,
          imageUrl: itinearay.imageUrl,
          description: itinearay.description,
          name: itinearay.name,
          activities: itinearay.activities,
        };

        returnedItineraries.push(itineraryDto);
      })
    );

    console.log("returnedItineraries: ", returnedItineraries);
    return buildSuccessRes("Fetched all itineraries", returnedItineraries);
  }

  async createItinerary() {}

  async joinItinerary(req: Request) {
    const { id } = req.params;

    const { userId } = req.query;

    const itinerary = await ItineraryModel.findOne<Itinerary>({ id: id });

    if (!itinerary) {
      return buildStatusNotFoundResponse(`No itinerary found with id: ${id}`);
    }

    const existingUser = await userModel.findOne<User>({ id: userId });

    if (!existingUser?._id) {
      return buildStatusNotFoundResponse(`No user found with id: ${userId}`);
    }

    itinerary?.members.push(new ObjectId(existingUser["_doc"]?._id));

    await ItineraryModel.updateOne({ id: id }, itinerary);
  }
}
