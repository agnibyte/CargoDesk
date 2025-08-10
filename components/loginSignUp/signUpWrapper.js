import React, { useState } from "react";
import { useForm } from "react-hook-form";
const crypto = require("crypto");
import { loginValidation } from "@/utilities/validations/auth";
import { postApiData } from "@/utilities/services/apiService";
import { hashWithSHA256 } from "@/utilities/utils";
import { showToast } from "@/utilities/toastService";
export default function SignUpWrapper() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.role || "user",
      password: hashWithSHA256(data.password),
    };

    try {
      const response = await postApiData("ADD_NEW_USER", newUser);
      if (response.status) {
        setSuccessMessage(response.message);
        showToast({
          message: response.message,
          type: "success",
        });
      } else {
        // setErrorMessage(response.message);
        showToast({
          message: response.message,
          type: "error",
        });
      }
      console.log("User added:", response.data);
      // reset();
    } catch (error) {
      console.error("Failed to add user:", error);
      // setErrorMessage("Failed to add user. Please try again.");
      showToast({
        message: "Failed to add user. Please try again.",
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl m-auto mt-10 p-6 dark:bg-gray-200 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-blue-800 dark:text-black mb-6">
        Add New User
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* First Name */}
        <div>
          <label className="block text-gray-700 dark:text-black">
            First Name
          </label>
          <input
            {...register("firstName", loginValidation.first_name)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-300 rounded-md bg-white dark:bg-white text-gray-900 dark:text-black"
            placeholder="Enter First Name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-gray-700 dark:text-black">
            Last Name
          </label>
          <input
            {...register("lastName", loginValidation.last_name)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-300 rounded-md bg-white dark:bg-white text-gray-900 dark:text-black"
            placeholder="Enter Last Name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 dark:text-black">Email</label>
          <input
            type="text"
            {...register("email", loginValidation.email)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-300 rounded-md bg-white dark:bg-white text-gray-900 dark:text-black"
            placeholder="Enter Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 dark:text-black">Phone</label>
          <input
            type="tel"
            {...register("phone", { required: "Phone number is required" })}
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-300 rounded-md bg-white dark:bg-white text-gray-900 dark:text-black"
            placeholder="Enter Phone Number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Role */}
        {/* <div>
          <label className="block text-gray-700 dark:text-black">Role</label>
          <select
            {...register("role")}
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-300 rounded-md bg-white dark:bg-white text-gray-900 dark:text-black"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="referee">Referee</option>
          </select>
        </div> */}

        {/* Password */}
        {/* <div>
          <label className="block text-gray-700 dark:text-black">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-300 rounded-md bg-white dark:bg-white text-gray-900 dark:text-black"
            placeholder="Enter Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div> */}
        {/* Password */}
        <div className="relative">
          <label className="block text-gray-700 dark:text-black">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            className="w-full mt-1 px-4 py-2 pr-16 border border-gray-300 dark:border-gray-300 rounded-md bg-white dark:bg-white text-gray-900 dark:text-black"
            placeholder="Enter Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-9 right-3 text-sm text-blue-700 hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-gray-700 dark:text-black">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === passwordValue || "Passwords do not match",
            })}
            className="w-full mt-1 px-4 py-2 pr-16 border border-gray-300 dark:border-gray-300 rounded-md bg-white dark:bg-white text-gray-900 dark:text-black"
            placeholder="Enter Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-9 right-3 text-sm text-blue-700 hover:underline"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button spans 2 columns on desktop */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-900 hover:bg-blue-950 text-white font-semibold rounded-md transition"
          >
            {isSubmitting ? "Submitting..." : "Add User"}
          </button>
        </div>
      </form>

      {successMessage && (
        <p className="mt-4 text-green-500 text-sm text-center">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-4 text-red-500 text-sm text-center">{errorMessage}</p>
      )}
    </div>
  );
}
