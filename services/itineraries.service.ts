import { DUMMY_ITINERARIES } from "../constants/constants";
import ItineraryModel from "../models/itineraries.model";
import userModel from "../models/user.model";
import { Itinerary, ItineraryDto } from "../types/itinerary.dto";
import {
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

    returnedItineraries.sort((a, b) => a.name.localeCompare(b.name));

    console.log("returnedItineraries: ", returnedItineraries);
    return buildSuccessRes("Fetched all itineraries", returnedItineraries);
  }

  async createItinerary(req: Request) {
    const {
      imageUrl = "",
      description,
      name,
      createdBy,
      members,
      activities,
    } = req.body as Itinerary;

    const itineraryToCreate: Itinerary = {
      imageUrl: imageUrl,
      description: description,
      name: name,
      createdBy: new ObjectId(createdBy),
      members: members.map((member) => new ObjectId(member)),
      activities: activities,
    };

    const itinerary = await ItineraryModel.create<Itinerary>(itineraryToCreate);

    return await this.getItineraryById(itinerary._id);
  }

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

    await ItineraryModel.updateOne({ _id: id }, itinerary);
  }

  // NON-ENDPOINT METHODS
  private async getItineraryById(id: ObjectId) {
    const itinerary = await ItineraryModel.findOne<Itinerary>({ _id: id });

    if (!itinerary) {
      return null;
    }

    const members = await userModel.find<User>({
      _id: {
        $in: itinerary.members.map((member) => new ObjectId(member)),
      },
    });

    const createdBy = await userModel.findOne<User>({
      _id: new ObjectId(itinerary.createdBy),
    });

    const itineraryDto: ItineraryDto = {
      createdBy: createdBy,
      members: members,
      imageUrl: itinerary.imageUrl,
      description: itinerary.description,
      name: itinerary.name,
      activities: itinerary.activities,
    };

    return buildSuccessRes("Fetched itinerary", itineraryDto);
  }
}
