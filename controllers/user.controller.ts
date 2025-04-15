import { Request, Response, Router } from "express";
import { UserService } from "../services/user.service";

const router = Router();

const userService = new UserService();

router.post("/create-user", async (req: Request, res: Response) => {
  const response = await userService.createUser(req);

  res.json(response);
});

router.post("/connect", async (req: Request, res: Response) => {
  const response = await userService.connectWithUser(req);

  res.json(response);
});

router.post("/login", async (req: Request, res: Response) => {
  const response = await userService.login(req);

  res.json(response);
});

router.get("/except/:id", async (req: Request, res: Response) => {
  const response = await userService.getAllUsersExceptCurrent(req);

  res.json(response);
});

router.get("/smart-generate/:id", async (req: Request, res: Response) => {
  const response = await userService.smartGenerateExceptCurrent(req);

  res.json(response);
});

export default router;
