import express from "express";

import UserRouter from "./user.controller";

const router = express.Router();

router.use("/user", UserRouter);

export default router;
