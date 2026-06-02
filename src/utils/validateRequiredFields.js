import { StatusCode } from "../constants.js";
import { apiError } from "./apiError.js";

export const validateRequiredFields = (fields) => {
  const missingFields = Object.entries(fields)
    .filter(([_, value]) => !value?.toString().trim())
    .map(([key]) => key);

  if (missingFields.length) {
    throw new apiError(
      StatusCode.BAD_REQUEST,
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }
};