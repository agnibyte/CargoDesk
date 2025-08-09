// utils/toastService.js
import toast from "react-hot-toast";

export const showToast = ({
  message,
  type = "success", // success | error | loading | custom
  position = "top-right",
  duration = 3000,
  style = {},
  iconTheme = {},
  customRender = null, // JSX for fully custom toast
}) => {
  let backgroundColor = "#fff";
  let color = "#1c1b1b";
  let iconPrimary = "#1c1b1b";
  let iconSecondary = "#fff";

  if (type === "error") {
    backgroundColor = "#fa582f"; // red-500
    color = "#fff";
    iconPrimary = "#fff";
    iconSecondary = "#fa582f";
  } else if (type === "success") {
    backgroundColor = "#05b36a";
    color = "#fff";
    iconPrimary = "#fff";
    iconSecondary = "#05b36a";
  }

  const options = {
    duration,
    position,
    style: {
      background: backgroundColor,
      color,
      borderRadius: "8px",
      padding: "12px 16px",
      ...style,
    },
    iconTheme: {
      primary: iconPrimary,
      secondary: iconSecondary,
      ...iconTheme,
    },
  };
  if (type === "loading") {
    return toast.loading(message, { ...options });
  }

  if (type === "success") {
    return toast.success(message, { ...options });
  } else if (type === "error") {
    return toast.error(message, { ...options });
  } else if (type === "loading") {
    return toast.loading(message, { ...options });
  } else if (type === "custom" && customRender) {
    return toast(customRender, { ...options });
  } else {
    return toast(message, { ...options });
  }
};
