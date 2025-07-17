import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import formStyle from "@/styles/formStyles.module.scss";
import { getConstant } from "@/utilities/utils";
export default function ManualAddForm({ setContacts }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    note: "",
  });

  const [validations, setValidations] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  // Set up validations on mount
  useEffect(() => {
    setValidations({
      name: {
        required: "Name is required",
        maxLength: { value: 50, message: "Name too long" },
      },
      phone: {
        required: "Email is required",
        pattern: {
          value: /^\+?[1-9]/,
          message: "Invalid phone address",
        },
      },
      note: {
        maxLength: { value: 50, message: "Max 50 characters" },
      },
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) clearErrors(field);
  };

  const onSubmit = async () => {
    setLoading(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      // Simulate API request
      //   await new Promise((res) => setTimeout(res, 1000));

      // Simulate successful response
      setSuccessMsg("Form submitted successfully!");

      // setContacts((prev) => [...prev, formData]);
      console.log("Submitted Data:", formData);
    } catch (error) {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full  bg-white border border-gray-200 rounded-xl shadow p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-row space-x-4">
        <div className="w-full">
          {/* Name */}
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            value={formData.name}
            {...register("name", validations.name)}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full border border-gray-300 px-3 py-2 rounded ${
              formStyle.inputField
            } ${errors.name ? formStyle.error : ""}`}
            placeholder="Enter Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="w-full">
          {/* Email */}
          <label className="block mb-2 font-medium">Phone Number</label>
          <input
            type="phone"
            value={formData.phone}
            maxLength={getConstant("LEN_MAX_PHONE_NO")}
            {...register("phone", validations.phone)}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`w-full border border-gray-300 px-3 py-2 rounded ${
              formStyle.inputField
            } ${errors.phone ? formStyle.error : ""}`}
            placeholder="Enter Phone No"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>
      {/* Message */}
      <label className="block mt-4 mb-2 font-medium">Note</label>
      <textarea
        rows={2}
        value={formData.note}
        {...register("note", validations.note)}
        onChange={(e) => handleChange("note", e.target.value)}
        className={`w-full border border-gray-300 px-3 py-2 rounded ${
          formStyle.inputField
        } ${errors.note ? formStyle.error : ""}`}
        placeholder="Enter Note"
      />
      {errors.note && (
        <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
      )}
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold mt-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
      {/* Status Messages */}
      {apiError && <p className="text-red-500 mt-3 text-center">{apiError}</p>}
      {successMsg && (
        <p className="text-green-600 mt-3 text-center">{successMsg}</p>
      )}
    </form>
  );
}
