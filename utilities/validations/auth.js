import { validateEmailPattern, validationForFullName, validationMobilePattern } from "./patterns";

export const loginValidation = {
  mobile_no: {
    required: "Please enter mobile number",
    pattern: {
      value: validationMobilePattern(),
      message: "Please enter valid mobile number",
    },
  },
  first_name: {
    required: "Please enter first name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid name",
    },
  },
  last_name: {
    required: "Please enter last name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid name",
    },
  },
  email: {
    required: "Please enter email",
    pattern: {
      value: validateEmailPattern(),
      message: "Please enter valid email",
    },
  },
};
