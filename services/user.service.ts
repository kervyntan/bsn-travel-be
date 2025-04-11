import { Request } from "express";
import { validateRequestData } from "../utils/request-validation";
import { createUserSchema } from "../types/request/user.schema";
import { User } from "../types/user.dto";
import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import { buildBadRequestResponse, buildSuccessRes } from "../utils/response";

export class UserService {
  private readonly USER_COLLECTION = "Users";
  private readonly SALT_ROUNDS = 10;

  async createUser(req: Request) {
    await validateRequestData(req.body, createUserSchema);

    const { name, email, password, interests, languages } = req.body as User;

    const existingUser = await userModel.find({ email : email })

    if (existingUser) {
        return buildBadRequestResponse("User with existing email is found. Failed to create duplicate user")
    }

    let createdUser = null;

    bcrypt.genSalt(this.SALT_ROUNDS, (err, salt) => {
      if (err) {
        console.error("Failed to generate salt");
        return;
      }

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.error("Failed to hash password");
          return;
        }

        console.log("Hashed password:", hash);
        createdUser = await userModel.create({ ...req.body, password: hash });
      });
    });

    return buildSuccessRes("User is successfully created", createdUser);
  }
}
