import { InterestsEnum, LanguagesEnum } from "../enums/enums";

export interface User {
  name: string;
  email: string;
  password: string;
  languages: LanguagesEnum[];
  interests: InterestsEnum[];
}
