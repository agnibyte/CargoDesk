import { validationForFullName } from "./validations/patterns";

export const messageValidations = {
  message: {
    required: "Please enter message",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid message",
    },
  },
};
