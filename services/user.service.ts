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
  private readonly DEFAULT_PROFILE_PIC = "https://i.imgur.com/Zm2ujrJ.png";

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

  async smartGenerateExceptCurrent(req: Request) {
    const { id } = req.params;

    const currentUser = await userModel.findOne<User>({
      _id: new ObjectId(id),
    });

    const currentUserInterests = currentUser?.interests || [];

    const currentUserLanguages = currentUser?.languages || [];

    console.log("interests: ", currentUserInterests);
    console.log("languages: ", currentUserLanguages);

    const users = await userModel.find({
      _id: { $nin: [new ObjectId(id)] },
      interests: {
        $not: { $elemMatch: { $nin: currentUserInterests } },
      },
      languages: {
        $not: { $elemMatch: { $nin: currentUserLanguages } },
      },
    });
    return buildSuccessRes("Users successfully fetched", users);
  }

  async connectWithUser(req: Request) {
    const { originalId, connectWithId } = req.query;

    console.log("Original Id: ", originalId);
    console.log("Connect With Id: ", connectWithId);

    const originalUser = await userModel.findOne<User>({
      _id: new ObjectId(originalId as string),
    });

    const userToConnect = await userModel.findOne<User>({
      _id: new ObjectId(connectWithId as string),
    });

    if (!originalUser || !userToConnect) {
      return buildBadRequestResponse(
        "User with OriginalId/ConnectwithId can't be found."
      );
    }

    // Connections exist between each other
    if (
      originalUser.connections.includes(
        new ObjectId(connectWithId as string)
      ) ||
      userToConnect.connections.includes(new ObjectId(originalId as string))
    ) {
      const originalIdx = originalUser.connections.findIndex(
        (x) => x == new ObjectId(originalId as string)
      );
      const connectWithIdx = userToConnect.connections.findIndex(
        (x) => x == new ObjectId(connectWithId as string)
      );

      originalUser.connections.splice(originalIdx, 1);
      userToConnect.connections.splice(connectWithIdx, 1);
    } else {
      originalUser.connections.push(new ObjectId(connectWithId as string));
      userToConnect.connections?.push(new ObjectId(connectWithId as string));
    }

    await userModel.updateOne(
      { _id: new ObjectId(originalId as string) },
      originalUser
    );
    await userModel.updateOne(
      { _id: new ObjectId(connectWithId as string) },
      userToConnect
    );

    return buildSuccessRes(
      "Successfully updated user's connections",
      originalUser
    );
  }
}
