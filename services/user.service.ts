import { Request } from "express";
import { validateRequestData } from "../utils/request-validation";
import { createUserSchema, loginSchema } from "../types/request/user.schema";
import { User, UserDto } from "../types/user.dto";
import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import {
  buildBadRequestResponse,
  buildSuccessRes,
  buildUnauthenticatedResponse,
} from "../utils/response";
import { ObjectId } from "mongodb";

export class UserService {
  private readonly SALT_ROUNDS = 10;
  private readonly DEFAULT_PROFILE_PIC =
    "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere.png";

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
        createdUser = await userModel.create({
          ...req.body,
          imageUrl: this.DEFAULT_PROFILE_PIC,
          password: hash,
        });
        console.log("user is created: ", {
          ...req.body,
          imageUrl: this.DEFAULT_PROFILE_PIC,
          password: hash,
        });

        return buildSuccessRes("User is successfully created", {
          ...req.body,
          imageUrl: this.DEFAULT_PROFILE_PIC,
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

    const existingUser = await userModel.findOne<User>({ email: email });

    if (!existingUser?._id) {
      return buildBadRequestResponse(
        "No existing user is found. Failed to login"
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      existingUser.password as string
    );

    if (isMatch) {
      console.log("Passwords match! User authenticated.");
      const connectionIds = existingUser.connections.map(
        (connection) => new ObjectId(connection)
      );

      const userDto = { ...existingUser["_doc"], connections: [] as User[] };

      const users = await userModel.find<User>({
        _id: { $in: connectionIds },
      });

      userDto.connections = users;

      return buildSuccessRes("Login successful!", userDto);
    } else {
      console.log("Passwords do not match! Authentication failed.");
      return buildUnauthenticatedResponse("Incorrect password/email");
    }
  }

  async getAllUsersExceptCurrent(req: Request) {
    const { id } = req.params;

    const users = await userModel.find({
      _id: { $nin: [new ObjectId(id)] },
    });

    return buildSuccessRes("Users successfully fetched", users);
  }

  async connectWithUser(req: Request) {
    const { originalId, connectWithId } = req.query;

    console.log("Original Id: ", originalId);
    console.log("Connect With Id: ", connectWithId);

    const originalUser = await userModel.findOne<User>({ id: originalId });

    const userToConnect = await userModel.findOne<User>({ id: connectWithId });

    if (!originalUser || !userToConnect) {
      return buildBadRequestResponse(
        "User with OriginalId/ConnectwithId can't be found."
      );
    }

    originalUser.connections.push(new ObjectId(connectWithId as string));
    userToConnect.connections?.push(new ObjectId(connectWithId as string));

    await userModel.updateOne({ id: originalId }, originalUser);
    await userModel.updateOne({ id: connectWithId }, userToConnect);
  }
}
