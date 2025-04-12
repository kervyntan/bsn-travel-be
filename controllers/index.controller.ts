import express from "express";

import UserRouter from "./user.controller";
import ActivityRouter from "./activity.controller";
import ItineraryRouter from "./itinerary.controller";

const router = express.Router();

router.use("/user", UserRouter);
router.use("/activity", ActivityRouter);
router.use("/itinerary", ItineraryRouter);

export default router;
