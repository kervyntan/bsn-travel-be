import { Request } from "express";
import { validateRequestData } from "../utils/request-validation";
import { createUserSchema, loginSchema } from "../types/request/user.schema";
import { User } from "../types/user.dto";
import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import {
  buildBadRequestResponse,
  buildSuccessRes,
  buildUnauthenticatedResponse,
} from "../utils/response";

export class UserService {
  private readonly SALT_ROUNDS = 10;

  async createUser(req: Request) {
    await validateRequestData(req.body, createUserSchema);

    const { name, email, password, interests, languages } = req.body as User;

    const existingUser = await userModel.find({ email: email }).exec();

    if (existingUser.length > 0) {
      return buildBadRequestResponse(
        "User with existing email is found. Failed to create duplicate user"
      );
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
        return buildSuccessRes("User is successfully created", {
          ...req.body,
          password: hash,
        });
      });
    });
  }

  async login(req: Request) {
    await validateRequestData(req.body, loginSchema);

    // Very simple login
    // No Auth

    const { email, password } = req.body as User;

    const existingUser = await userModel.findOne({ email: email }).exec();

    if (!existingUser?.id) {
      return buildBadRequestResponse(
        "No existing user is found. Failed to login"
      );
    }

    bcrypt.compare(
      password,
      existingUser?.password as string,
      (err, result) => {
        if (err) {
          // Handle error
          console.error("Error comparing passwords:", err);
          return;
        }

        if (result) {
          console.log("Passwords match! User authenticated.");
          return buildSuccessRes("Login successful!", existingUser);
        } else {
          console.log("Passwords do not match! Authentication failed.");
          return buildUnauthenticatedResponse("Incorrect password/email");
        }
      }
    );
  }
}
