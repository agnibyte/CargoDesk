import { reminderValidation } from "@/utilities/formValidation";
import commonStyle from "@/styles/common/common.module.scss";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomSearch from "../customSearch";
import CustomDatePicker from "../customDatePicker";
import {
  FloatingInput,
  FloatingTextarea,
  FloatingSelect,
} from "../floatingInput";
import moment from "moment";

const AddReminderForm = ({
  setReminderModal,
  reminderData,
  setReminderData,
  addReminderData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    clearErrors: clearErrors,
    trigger,
    setValue,
  } = useForm();

  const validation = {
    title: register("title", reminderValidation.title),
    description: register("description", reminderValidation.description),
    date: register("date", reminderValidation.date),
    priority: register("priority", reminderValidation.priority),
    // gender: register("gender", reminderValidation.gender),
  };
  const defaultData = {
    title: "t1",
    description: "d1",
    date: "",
    priority: "",
  };
  const [formData, setFormData] = useState(defaultData);

  const updateSelectedForm = (type, value) => {
    const temp = { ...formData };
    temp[type] = value;
    setFormData(temp);
  };

  const submitform = () => {
    addReminderData(formData);
    setFormData(defaultData);
    setReminderModal(false);
    reset();
  };

  const priorityListArr = [
    {
      label: "Low",
      value: "low",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "High",
      value: "high",
    },
  ];

  const handleDateChange = (date) => {
    updateSelectedForm("date", date);
    trigger("date");
    setValue("date", date);
  };

  return (
    <div className="container">
      <div className="">
        <div className="card-body">
          <form onSubmit={handleSubmit(submitform)} className="space-y-4">
            <FloatingInput
              id="reminder_title"
              label="Title"
              placeholder="Enter title"
              value={formData.title}
              error={errors?.title}
              {...validation.title}
              onChange={(e) => updateSelectedForm("title", e.target.value)}
            />

            <FloatingTextarea
              id="reminder_description"
              label="Description"
              placeholder="Enter description"
              rows={3}
              value={formData.description}
              error={errors?.description}
              {...validation.description}
              onChange={(e) =>
                updateSelectedForm("description", e.target.value)
              }
            />

            <div className="relative">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Date
              </label>
              <CustomDatePicker onChange={handleDateChange} />
              {errors?.date && (
                <p className="text-red-500 text-xs font-normal mt-1.5 pl-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <FloatingSelect
              id="reminder_priority"
              label="Priority"
              options={priorityListArr}
              value={formData.priority}
              error={errors?.priority}
              {...validation.priority}
              onChange={(e) => {
                clearErrors("priority");
                updateSelectedForm("priority", e.target.value);
              }}
            />

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              Add Reminder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReminderForm;
