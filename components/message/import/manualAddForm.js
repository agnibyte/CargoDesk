import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
          value: /^\+?[1-9]\d{1,14}$/,
          message: "Invalid phone address",
        },
      },
      note: {
        required: "Message is required",
        maxLength: { value: 300, message: "Max 300 characters" },
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

      setContacts((prev) => [...prev, form]);
      console.log("Submitted Data:", formData);
    } catch (error) {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md mx-auto "
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
            className="w-full border px-3 py-2 rounded"
            style={errors.name ? { borderColor: "red" } : {}}
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
            {...register("phone", validations.phone)}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full border px-3 py-2 rounded"
            style={errors.phone ? { borderColor: "red" } : {}}
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
        className="w-full border px-3 py-2 rounded"
        style={errors.note ? { borderColor: "red" } : {}}
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
