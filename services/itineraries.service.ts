import { DUMMY_ITINERARIES } from "../constants/constants";
import ItineraryModel from "../models/itineraries.model";
import { buildSuccessRes } from "../utils/response";

export class ItinerariesService {
  async insertDummyItineraries() {
    await ItineraryModel.insertMany(DUMMY_ITINERARIES);
  }

  async getAllItineraries() {
    const itineraries = await ItineraryModel.find({});

    return buildSuccessRes("Fetched all itineraries", itineraries);
  }

  async createItinerary() {}
}
