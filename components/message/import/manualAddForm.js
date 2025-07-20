import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import formStyle from "@/styles/formStyles.module.scss";
import { getConstant } from "@/utilities/utils";
import { postApiData } from "@/utilities/services/apiService";
import commonStyle from "@/styles/common/common.module.scss";

export default function ManualAddForm({
  pageData,
  modalData,
  isEdit = false,
  setContactModal,
  setContactsList,
}) {
  const defaultFormData = { name: "", phone: "", note: "" };
  const initialFormData = isEdit ? modalData : defaultFormData;
  const [formData, setFormData] = useState(initialFormData);

  const [validations, setValidations] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
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
        required: "Phone number is required",
        minLength: {
          value: getConstant("LEN_MIN_PHONE_NO"),
          message: "Phone number is too short",
        },
        maxLength: {
          value: getConstant("LEN_MAX_PHONE_NO"), // You should probably use MAX here
          message: "Phone number is too long",
        },
        pattern: {
          value: /^[+]?[0-9]{7,15}$/, // E.164-compatible basic pattern
          message: "Please enter a valid phone number",
        },
      },
      note: {
        maxLength: {
          value: getConstant("LEN_MAX_NOTE"),
          message: `Max ${getConstant("LEN_MAX_NOTE")} characters`,
        },
      },
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) clearErrors(field);
  };

  const addNewContact = async () => {
    try {
      const payload = {
        userId: pageData.user.userId,
        name: formData.name,
        contactNo: formData.phone,
        note: formData.note,
      };

      const response = await postApiData("ADD_NEW_CONTACT", payload);
      if (response.status) {
        setSuccessMsg(response.message);
        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);

        reset();
        setFormData(defaultFormData);
      } else {
        setApiError(response.message);
      }
      // setContacts((prev) => [...prev, formData]);
      // console.log("Submitted Data:", formData);
    } catch (error) {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const editContact = async () => {
    try {
      const editPayload = {
        id: modalData.id,
        data: {
          name: formData.name,
          contactNo: formData.phone,
          note: formData.note,
        },
      };

      const response = await postApiData("UPDATE_CONTACT", editPayload);
      if (response.status) {
        setSuccessMsg(response.message);
        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);

        reset();
        setFormData(defaultFormData);
        setContactModal(false);
        setContactsList((prev) =>
          prev.map((c) =>
            c.id === editPayload.id ? { ...c, ...editPayload.data } : c
          )
        );
      } else {
        setApiError(response.message);
      }
      // setContacts((prev) => [...prev, formData]);
      // console.log("Submitted Data:", formData);
    } catch (error) {
      console.log("error", error);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = (data) => {
    setLoading(true);
    setApiError(null);
    setSuccessMsg(null);
    if (isEdit) {
      editContact();
    } else addNewContact();
  };
  return (
    <form
      className={`w-full bg-white p-5 ${
        !isEdit ? "border border-gray-200 rounded-xl shadow" : " rounded-b-2xl"
      }`}
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
            name="name"
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
            minLength={getConstant("LEN_MIN_PHONE_NO")}
            maxLength={getConstant("LEN_MAX_PHONE_NO")}
            {...register("phone", validations.phone)}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`w-full border border-gray-300 px-3 py-2 rounded ${
              formStyle.inputField
            } ${errors.phone ? formStyle.error : ""}`}
            placeholder="Enter Phone No"
            name="phone"
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
        name="note"
      />
      {errors.note && (
        <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
      )}
      {/* Submit Button */}
      {isEdit ? (
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-semibold mt-6 py-2 rounded hover:bg-blue-700 transition ${commonStyle.editButton}`}
        >
          {loading ? getConstant("LOADING_TEXT") : "Submit"}
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold mt-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      )}
      {/* Status Messages */}
      {apiError && <p className="text-red-500 mt-3 text-center">{apiError}</p>}
      {successMsg && (
        <p className="text-green-600 mt-3 text-center">{successMsg}</p>
      )}
    </form>
  );
}
