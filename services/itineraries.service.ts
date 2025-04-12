import mongoose from "mongoose";
import { DUMMY_ITINERARIES } from "../constants/constants";
import ItineraryModel from "../models/itineraries.model";
import userModel from "../models/user.model";
import { Itinerary, ItineraryDto } from "../types/itinerary.dto";
import { buildSuccessRes } from "../utils/response";
import { ObjectId } from "mongodb";
import { User } from "../types/user.dto";

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
}
