import { ObjectId } from "mongodb";
import { InterestsEnum, LanguagesEnum } from "../enums/enums";

export interface User {
  _id?: string;
  _doc?: UserDto;
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  languages: LanguagesEnum[];
  interests: InterestsEnum[];
  connections: ObjectId[];
}

export interface UserDto {
  _id?: string;
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  languages: LanguagesEnum[];
  interests: InterestsEnum[];
  connections: User[];
}
