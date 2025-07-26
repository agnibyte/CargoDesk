import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import formStyle from "@/styles/formStyles.module.scss";
import { postApiData } from "@/utilities/services/apiService";
import { getConstant } from "@/utilities/utils";
import commonStyle from "@/styles/common/common.module.scss";
import GroupMemberSelection from "./groupMemberSelection";

export default function GroupForm({
  pageData,
  modalData,
  isEdit = false,
  setGroupModal,
  setGroupsList,
  contactsList = [],
}) {
  const defaultFormData = { groupName: "", description: "", members: [] };
  const initialFormData = isEdit ? modalData : defaultFormData;
  const [formData, setFormData] = useState(initialFormData);
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

  const validations = {
    groupName: {
      required: "Group Name is required",
      maxLength: { value: 50, message: "Group Name too long" },
    },
    description: {
      maxLength: {
        value: getConstant("LEN_MAX_NOTE"),
        message: `Max ${getConstant("LEN_MAX_NOTE") || 200} characters`,
      },
    },
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) clearErrors(field);
  };

  const handleMemberToggle = (contactId) => {
    setFormData((prev) => {
      const exists = prev.members.includes(contactId);
      const members = exists
        ? prev.members.filter((id) => id !== contactId)
        : [...prev.members, contactId];
      return { ...prev, members };
    });
  };

  const submitGroup = async () => {
    const payload = {
      userId: pageData.user.userId,
      groupName: formData.groupName,
      description: formData.description,
      members: formData.members,
    };

    try {
      const response = await postApiData(
        isEdit ? "UPDATE_GROUP" : "CREATE_GROUP",
        isEdit ? { id: modalData.id, data: payload } : payload
      );

      if (response.status) {
        setSuccessMsg(response.message);
        setTimeout(() => setSuccessMsg(""), 3000);
        reset();
        setFormData(defaultFormData);

        if (isEdit) {
          setGroupsList((prev) =>
            prev.map((g) => (g.id === modalData.id ? { ...g, ...payload } : g))
          );
          setGroupModal(false);
        } else {
          setGroupsList((prev) => [...prev, payload]);
        }
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      console.error("Group form error:", error);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    setLoading(true);
    setApiError(null);
    setSuccessMsg(null);
    submitGroup();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`w-full bg-white p-2 md:p-5 ${
        !isEdit ? "border-b border-gray-200 rounded-xl shadow" : "rounded-b-2xl"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Group Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.groupName}
            {...register("groupName", validations.groupName)}
            onChange={(e) => handleChange("groupName", e.target.value)}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              formStyle.inputField
            } ${errors.groupName ? formStyle.error : ""}`}
            placeholder="Enter Group Name"
            name="groupName"
          />
          {errors.groupName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.groupName.message}
            </p>
          )}
        </div>

        {/* Group Description */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Group Description
          </label>
          <textarea
            rows={1}
            value={formData.description}
            {...register("description", validations.description)}
            onChange={(e) => handleChange("description", e.target.value)}
            className={`w-full px-4 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              formStyle.inputField
            } ${errors.description ? formStyle.error : ""}`}
            placeholder="Optional Description"
            name="description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      <GroupMemberSelection
        contactsList={contactsList}
        formData={formData}
        setFormData={setFormData}
      />
      {/* <label className="block mt-4 mb-2 font-medium">Select Members</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {contactsList.map((contact) => (
          <label
            key={contact.id}
            className="flex items-center space-x-2 text-sm"
          >
            <input
              type="checkbox"
              checked={formData.members.includes(contact.id)}
              onChange={() => handleMemberToggle(contact.id)}
              className="accent-blue-600"
            />
            <span>
              {contact.name} - {contact.contactNo}
            </span>
          </label>
        ))}
      </div> */}

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-semibold mt-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer i ${
          isEdit ? commonStyle.editButton : commonStyle.commonButton
        }`}
      >
        {loading ? "Submitting..." : isEdit ? "Update Group" : "Create Group"}
      </button>

      {apiError && <p className="text-red-500 mt-3 text-center">{apiError}</p>}
      {successMsg && (
        <p className="text-green-600 mt-3 text-center">{successMsg}</p>
      )}
    </form>
  );
}
