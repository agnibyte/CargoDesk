"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { postApiData } from "@/utilities/services/apiService";

export default function EmiForm({ setEmiList, modalData, isEdit, onClose }) {
  const defaultFormData = {
    loan_name: "",
    loan_amount: "",
    emi_amount: "",
    tenure_months: "",
    start_date: "",
    payment_mode: "",
    due_date: "",
    // status: "Active",
  };

  const [apiLoading, setApiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: defaultFormData,
  });

  // ✅ Populate form when editing
  useEffect(() => {
    if (isEdit && modalData) {
      reset({
        loan_name: modalData.loan_name,
        loan_amount: modalData.loan_amount,
        emi_amount: modalData.emi_amount,
        tenure_months: modalData.tenure_months,
        start_date: modalData.start_date,
        payment_mode: modalData.payment_mode,
        due_date: modalData.due_date,
        status: modalData.status === 1 ? "Active" : "Closed",
      });
    }
  }, [isEdit, modalData, reset]);

  const onSubmit = async (data) => {
    setApiLoading(true);

    const payload = {
      loan_name: data.loan_name,
      loan_amount: data.loan_amount,
      emi_amount: data.emi_amount,
      tenure_months: data.tenure_months,
      start_date: data.start_date,
      payment_mode: data.payment_mode,
      due_date: data.due_date,
      status: data.status === "Active" ? 1 : 0,
    };

    let response;
    if (isEdit) {
      // ✅ Update EMI
      payload.id = modalData.id; // pass id for update
      response = await postApiData("UPDATE_EMI_DETAILS", payload);
    } else {
      // ✅ Add new EMI
      response = await postApiData("ADD_NEW_EMI", payload);
    }

    if (response.status) {
      console.log("isEdit", isEdit);
      if (isEdit) {
        setEmiList((prev) =>
          prev.map((emi) =>
            emi.id == modalData.id ? { ...emi, ...data } : emi
          )
        );
        console.log("modalData.id ", modalData.id);
      } else {
        setEmiList((prev) => [...prev, { ...data, id: response.insertId }]);
      }

      reset(defaultFormData);
      if (onClose) onClose(); // close modal after save
    } else {
      console.error("Failed:", response.message);
    }

    setApiLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Loan Name */}
        <div className="w-full">
          <label className="block text-sm">Loan/Item Name</label>
          <input
            type="text"
            placeholder="e.g. Car Loan, Mobile EMI"
            {...register("loan_name", { required: "Loan Name is required" })}
            className="w-full p-2 rounded border border-gray-500 focus:outline-none "
          />
          {errors.loan_name && (
            <p className="text-red-500 text-sm">{errors.loan_name.message}</p>
          )}
        </div>

        {/* Loan Amount & EMI */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm">Loan Amount</label>
            <input
              type="number"
              placeholder="Enter total loan amount"
              {...register("loan_amount", {
                required: "Loan Amount is required",
                min: { value: 1, message: "Must be greater than 0" },
              })}
              className="w-full p-2 rounded border border-gray-500 focus:outline-none "
            />
            {errors.loan_amount && (
              <p className="text-red-500 text-sm">
                {errors.loan_amount.message}
              </p>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm">EMI Amount</label>
            <input
              type="number"
              placeholder="Enter monthly EMI amount"
              {...register("emi_amount", {
                required: "EMI Amount is required",
                min: { value: 1, message: "Must be greater than 0" },
              })}
              className="w-full p-2 rounded border border-gray-500 focus:outline-none "
            />
            {errors.emi_amount && (
              <p className="text-red-500 text-sm">
                {errors.emi_amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Tenure & Start Date */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm">Tenure (months)</label>
            <input
              type="number"
              placeholder="e.g. 12"
              {...register("tenure_months", {
                required: "Tenure is required",
                min: { value: 1, message: "Must be at least 1 month" },
              })}
              className="w-full p-2 rounded border border-gray-500 focus:outline-none "
            />
            {errors.tenure_months && (
              <p className="text-red-500 text-sm">
                {errors.tenure_months.message}
              </p>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm">Start Date</label>
            <input
              type="date"
              {...register("start_date", {
                required: "Start Date is required",
              })}
              className="w-full p-2 rounded border border-gray-500 focus:outline-none "
            />
            {errors.start_date && (
              <p className="text-red-500 text-sm">
                {errors.start_date.message}
              </p>
            )}
          </div>
        </div>

        {/* Payment Mode & Due Date */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm">Payment Mode</label>
            <select
              {...register("payment_mode", {
                required: "Payment Mode is required",
              })}
              className="w-full p-2 rounded border border-gray-500 focus:outline-none "
            >
              <option value="">-- Select Payment Mode --</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
            </select>
            {errors.payment_mode && (
              <p className="text-red-500 text-sm">
                {errors.payment_mode.message}
              </p>
            )}
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm">Due Date (Monthly)</label>
            <input
              type="date"
              {...register("due_date", { required: "Due Date is required" })}
              className="w-full p-2 rounded border border-gray-500 focus:outline-none "
            />
            {errors.due_date && (
              <p className="text-red-500 text-sm">{errors.due_date.message}</p>
            )}
          </div>
        </div>

        {/* Status (Edit mode only) */}
        {isEdit && (
          <div className="w-full">
            <label className="block text-sm">Status</label>
            <select
              {...register("status")}
              className="w-full p-2 rounded border border-gray-500 focus:outline-none "
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <div className="w-full">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            {apiLoading ? "Submitting..." : isEdit ? "Update EMI" : "Add EMI"}
          </button>
        </div>
      </form>
    </div>
  );
}
