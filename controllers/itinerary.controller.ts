import { Request, Response, Router } from "express";
import { ItinerariesService } from "../services/itineraries.service";

const router = Router();

const itineraryService = new ItinerariesService();

router.post("/create-dummy-data", async (req: Request, res: Response) => {
  await itineraryService.insertDummyItineraries();

  res.json({ result: "ok" });
});

router.get("/", async (req: Request, res: Response) => {
  const response = await itineraryService.getAllItineraries();

  res.json(response);
});

export default router;
