import { ObjectId } from "mongodb";
import { InterestsEnum, LanguagesEnum } from "../enums/enums";

export interface User {
  _id?: string;
  _doc?: object;
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  languages: LanguagesEnum[];
  interests: InterestsEnum[];
  connections: ObjectId[];
}

export interface UserDto {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  languages: LanguagesEnum[];
  interests: InterestsEnum[];
  connections: User[];
}
