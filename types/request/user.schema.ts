import * as yup from "yup";

export const createUserSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(1).required(),
  name: yup.string().required(),
  languages: yup.array(yup.string()).required(),
  interests: yup.array(yup.string()).required(),
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(1).required(),
});
