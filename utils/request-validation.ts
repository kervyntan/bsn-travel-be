import * as yup from "yup";

import { InvalidArgumentsError } from "../errors/errors";

export async function validateRequestData<T>(
  data: T,
  schema: yup.ObjectSchema<any>
): Promise<T> {
  try {
    const validData = await schema.validate(data, { abortEarly: false });
    return validData;
  } catch (error) {
    throw new InvalidArgumentsError(`Invalid request data: ${error}`);
  }
}
