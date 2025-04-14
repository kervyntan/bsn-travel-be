import { Request, Response, Router } from "express";
import { ActivitiesService } from "../services/activities.service";

const router = Router();

const activityService = new ActivitiesService();

router.post("/insert-dummy-data", async (req: Request, res: Response) => {
  await activityService.insertDummyActivities();
  res.json({ result: "ok" });
});

router.post("/", async (req: Request, res: Response) => {
  const response = await activityService.createActivity(req);

  res.json(response);
});

router.get("/:id", async (req: Request, res: Response) => {
  const response = await activityService.getActivity(req);
  res.json(response);
});

router.get("/", async (req: Request, res: Response) => {
  const response = await activityService.getAllActivities();
  res.json(response);
});

export default router;
