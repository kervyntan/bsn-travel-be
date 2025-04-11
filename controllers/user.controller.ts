import { Request, Response, Router } from "express";
import { UserService } from "../services/user.service";

const router = Router();

const userService = new UserService();

router.post("/create-user", async (req: Request, res: Response) => {});

export default router;
