import { constantsList } from "@/constants";
import moment from "moment";
import { DOCUMENTS_TYPE_LIST } from "./dummyData";

export const getUniqueKey = (length = 12) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const formatDate = (date, format = 1) => {
  let formattedDate = "";
  if (!date) {
    formattedDate = "-";
  }

  if (format == 1) {
    formattedDate = moment(date).format("DD MMM, YYYY");
  }
  return formattedDate;
};

export const getConstant = (key) => {
  return constantsList[key.toUpperCase()] ?? null;
};

export const getDataFromLocalStorage = (keyName) => {
  let data = JSON.parse(localStorage.getItem(keyName));
  return data;
};

export const getDateBeforeDays = (date, days) => {
  if (!date || typeof days !== "number") return "-";
  return moment(date).subtract(days, "days").format("DD MMM, YYYY");
};

export const truncateString = (input) => {
  const maxLength = 20;
  if (!input) return "";
  const words = input.split(" ");
  if (words.length > 3 || input.length > maxLength) {
    return input.substring(0, maxLength).trim() + "...";
  }
  return input;
};

export const formatVehicleNumber = (vehicleNumber = "") => {
  if (!vehicleNumber) return "";

  // Ensure input is uppercase
  const upperCaseNumber =
    vehicleNumber && vehicleNumber != "" && vehicleNumber?.toUpperCase();

  // Flexible pattern for Indian vehicle numbers
  const regex = /^([A-Z]{2})(\d{1,2})([A-Z]{0,2})(\d{1,4})$/;
  return upperCaseNumber.replace(regex, (_, state, rto, series, number) => {
    return [state, rto, series, number].filter(Boolean).join(" ");
  });
};

export const checkBotUserAgent = (userAgent) => {
  return Boolean(
    userAgent.match(/bot|googlebot|crawler|spider|robot|crawling/i)
  );
};

export const checkUserDeviceTypeByUserAgent = (userAgent) => {
  return Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );
};

export const checkExpiryCounts = (data) => {
  const result = DOCUMENTS_TYPE_LIST.map((doc) => ({
    ...doc,
    expiredCount: 0,
    withinMonthExpiryCount: 0,
    totalCount: 0, // New field for total count
  }));

  data.forEach((item) => {
    const expiryDate = moment(item.expiryDate);
    const document = result.find((doc) => doc.value === item.documentType);

    if (document) {
      const isWithinMonth = expiryDate.isBetween(
        moment(),
        moment().add(getConstant("DAYS_BEFORE_ALERT"), "days"),
        "day",
        "[]"
      );

      const isExpired = expiryDate.isBefore(moment());

      // Count for within month and expired
      if (isWithinMonth && !isExpired) {
        document.withinMonthExpiryCount += 1;
      }
      if (isExpired) {
        document.expiredCount += 1;
      }
      // Increment total count for each matched document
      document.totalCount += 1;
    }
  });

  return result;
};
