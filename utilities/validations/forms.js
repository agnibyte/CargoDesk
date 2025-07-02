import {
  validationForFullName,
  validateEmailPattern,
  validationMobilePattern,
  validationForAddress,
  validationPincodePattern,
  validationNumberOnly,
  validationForNumbersAndAlphabets,
} from "./patterns";

export const partnerValidation = {
  name: {
    required: "Please enter name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid name",
    },
  },
  city: {
    required: "Please enter city",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid city name",
    },
  },
  contact_person: {
    required: "Please enter contact person",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid name",
    },
  },
  contact_number: {
    required: "Please enter mobile number",
    pattern: {
      value: validationMobilePattern(),
      message: "Please enter valid mobile number",
    },
  },
};

export const newsletterValidation = {
  email_id: {
    required: "Please enter email",
    pattern: {
      value: validateEmailPattern(),
      message: "Please enter valid email",
    },
  },
  is_checked: {
    required: "Please check the field",
  },
};

export const bulkEnquiryValidation = {
  name: {
    required: "Please enter name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid name",
    },
  },
  mobile_no: {
    required: "Please enter mobile number",
    pattern: {
      value: validationMobilePattern(),
      message: "Please enter valid mobile number",
    },
  },
  range: {
    required: "Please select range",
  },
};

export const contestDashValidation = {
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
  email_id: {
    required: "Please enter email",
    pattern: {
      value: validateEmailPattern(),
      message: "Please enter valid email",
    },
  },
  parent_first_name: {
    required: "Please enter parent first name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid name",
    },
  },
  parent_last_name: {
    required: "Please enter parent last name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid name",
    },
  },
  contact_number: {
    required: "Please enter mobile number",
    pattern: {
      value: validationMobilePattern(),
      message: "Please enter valid mobile number",
    },
  },
  address: {
    required: "Please enter address",
    pattern: {
      value: validationForAddress(),
      message: "please enter valid address",
    },
  },
  pincode: {
    required: "Please enter pin code",
    pattern: {
      value: validationPincodePattern(),
      message: "Please enter a valid pin code",
    },
  },
  city: {
    required: "Please enter city",
  },
  state: {
    required: "Please select state",
  },
  date: {
    required: "Please select date of birth",
  },
  submission_link: {
    required: "Please enter link",
  },
  is_checked: {
    required: "Please check the field",
  },
};

export const hearingAidsValidation = {
  full_name: {
    required: "Please enter name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid name",
    },
  },
  mobile_no: {
    required: "Please enter mobile number",
    pattern: {
      value: validationMobilePattern(),
      message: "Please enter valid mobile number",
    },
  },
  city: {
    required: "Please enter city",
  },
  pincode: {
    required: "Please enter pin code",
    pattern: {
      value: validationPincodePattern(),
      message: "Please enter a valid pin code",
    },
  },
};

export const referValidation = {
  first_name: {
    required: "Please enter first name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid first name",
    },
  },
  last_name: {
    required: "Please enter last name",
    pattern: {
      value: validationForFullName(),
      message: "Please enter valid last name",
    },
  },
  mobile_no: {
    required: "Please enter mobile number",
    pattern: {
      value: validationMobilePattern(),
      message: "Please enter valid mobile number",
    },
  },
};

const validationForText = () => /^[a-zA-Z\s]+$/;
const validationForDate = () => /^\d{4}-\d{2}-\d{2}$/;
const validationForPriority = () => /^(low|medium|high)$/;

export const reminderValidation = {
  title: {
    required: "Please enter the title",
    pattern: {
      value: validationForNumbersAndAlphabets(),
      message: "Please enter a valid title",
    },
  },
  description: {
    required: "Please enter the description",
    pattern: {
      value: validationForNumbersAndAlphabets(),
      message: "Please enter a valid description",
    },
  },
  date: {
    required: "Please enter the date",
    pattern: {
      value: validationForDate(),
      message: "Please enter a valid date in YYYY-MM-DD format",
    },
  },
  priority: {
    required: "Please select the priority",
    pattern: {
      value: validationForPriority(),
      message: "Please select a valid priority (low, medium, high)",
    },
  },
};

export const DocValidation = {
  masterNo: {
    required: "Please enter the master number",
    pattern: {
      value: validationForNumbersAndAlphabets(),
      message: "Please enter a valid master number",
    },
  },
  vehicleNo: {
    required: "Please select vehicle number",
    pattern: {
      value: validationForNumbersAndAlphabets(),
      message: "Please select valid vehicle number",
    },
  },
  documentType: {
    required: "Please select Document type",
    pattern: {
      value: validationForNumbersAndAlphabets(),
      message: "Please select Document type",
    },
  },
  expiryDate: {
    required: "Please enter the expiry date",
    pattern: {
      value: validationForDate(),
      message: "Please enter a valid expiry date",
    },
  },
  alertDate: {
    required: "Please enter the alert date",
    pattern: {
      value: validationForDate(),
      message: "Please enter a valid alert date",
    },
  },
};
