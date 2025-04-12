import express from "express";

import UserRouter from "./user.controller";
import ActivityRouter from "./activity.controller";

const router = express.Router();

router.use("/user", UserRouter);
router.use("/activity", ActivityRouter);

export default router;
