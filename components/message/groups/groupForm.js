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
  const defaultFormData = { groupName: "", description: "", contactIds: [] };
  const initialFormData = isEdit ? modalData : defaultFormData;
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  // const [idsToAdd, setIdsToAdd] = useState([]);
  // const [idsToRemove, setIdsToRemove] = useState([]);

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
      const exists = prev.contactIds.includes(contactId);
      const contactIds = exists
        ? prev.contactIds.filter((id) => id !== contactId)
        : [...prev.contactIds, contactId];
      return { ...prev, contactIds };
    });
  };

  const handleCreateGroup = async () => {
    const addNewPayload = {
      userId: pageData.user.userId,
      groupName: formData.groupName,
      description: formData.description,
      contactIds: formData.contactIds,
    };

    try {
      const response = await postApiData(
        "CREATE_NEW_GROUP_OF_CONTACTS",
        addNewPayload
      );

      if (response.status) {
        setSuccessMsg(response.message);
        setTimeout(() => setSuccessMsg(""), 3000);
        reset();
        setFormData(defaultFormData);

        setGroupsList((prev) => [
          ...prev,
          { ...addNewPayload, id: response.id },
        ]);
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      console.error("Create group error:", error);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGroup = async () => {
    const idsToAdd = formData.contactIds.filter(
      (id) => !modalData.contactIds.includes(id)
    );
    const idsToRemove = modalData.contactIds.filter(
      (id) => !formData.contactIds.includes(id)
    );

    const updatePayload = {
      groupId: modalData.id,
      userId: pageData.user.userId,
      groupName: formData.groupName,
      description: formData.description,
      idsToAdd,
      idsToRemove,
    };

    try {
      const response = await postApiData(
        "UPDATE_USERS_GROUP_DETAILS",
        updatePayload
      );

      if (response.status) {
        setSuccessMsg(response.message);
        setTimeout(() => setSuccessMsg(""), 3000);
        reset();
        setFormData(defaultFormData);

        setGroupsList((prev) =>
          prev.map((g) =>
            g.id === modalData.id
              ? { ...g, ...updatePayload, contactIds: formData.contactIds }
              : g
          )
        );
        setGroupModal(false);
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      console.error("Update group error:", error);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitGroup = () => {
    setLoading(true);
    if (isEdit) {
      handleUpdateGroup();
    } else {
      handleCreateGroup();
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
              checked={formData.contactIds.includes(contact.id)}
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
