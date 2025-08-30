"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { postApiData } from "@/utilities/services/apiService";

export default function EmiForm({ setEmiList, modalData, isEdit, onClose }) {
  const defaultFormData = {
    loanName: "",
    loanAmount: "",
    emiAmount: "",
    tenure: "",
    startDate: "",
    paymentMode: "",
    dueDate: "",
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
        loanName: modalData.loan_name,
        loanAmount: modalData.loan_amount,
        emiAmount: modalData.emi_amount,
        tenure: modalData.tenure_months,
        startDate: modalData.start_date,
        paymentMode: modalData.payment_mode,
        dueDate: modalData.due_date,
        status: modalData.status === 1 ? "Active" : "Closed",
      });
    }
  }, [isEdit, modalData, reset]);

  const onSubmit = async (data) => {
    setApiLoading(true);

    const payload = {
      loan_name: data.loanName,
      loan_amount: data.loanAmount,
      emi_amount: data.emiAmount,
      tenure_months: data.tenure,
      start_date: data.startDate,
      payment_mode: data.paymentMode,
      due_date: data.dueDate,
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
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Loan Name */}
        <div>
          <label className="block text-sm">Loan/Item Name</label>
          <input
            type="text"
            placeholder="e.g. Car Loan, Mobile EMI"
            {...register("loanName", { required: "Loan Name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.loanName && (
            <p className="text-red-500 text-sm">{errors.loanName.message}</p>
          )}
        </div>

        {/* Loan Amount */}
        <div>
          <label className="block text-sm">Loan Amount</label>
          <input
            type="number"
            placeholder="Enter total loan amount"
            {...register("loanAmount", {
              required: "Loan Amount is required",
              min: { value: 1, message: "Must be greater than 0" },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.loanAmount && (
            <p className="text-red-500 text-sm">{errors.loanAmount.message}</p>
          )}
        </div>

        {/* EMI Amount */}
        <div>
          <label className="block text-sm">EMI Amount</label>
          <input
            type="number"
            placeholder="Enter monthly EMI amount"
            {...register("emiAmount", {
              required: "EMI Amount is required",
              min: { value: 1, message: "Must be greater than 0" },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.emiAmount && (
            <p className="text-red-500 text-sm">{errors.emiAmount.message}</p>
          )}
        </div>

        {/* Tenure */}
        <div>
          <label className="block text-sm">Tenure (months)</label>
          <input
            type="number"
            placeholder="e.g. 12"
            {...register("tenure", {
              required: "Tenure is required",
              min: { value: 1, message: "Must be at least 1 month" },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.tenure && (
            <p className="text-red-500 text-sm">{errors.tenure.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm">Start Date</label>
          <input
            type="date"
            {...register("startDate", { required: "Start Date is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm">Payment Mode</label>
          <select
            {...register("paymentMode", {
              required: "Payment Mode is required",
            })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Payment Mode --</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
          </select>
          {errors.paymentMode && (
            <p className="text-red-500 text-sm">{errors.paymentMode.message}</p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm">Due Date (Monthly)</label>
          <input
            type="date"
            {...register("dueDate", { required: "Due Date is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Status (Visible in edit mode) */}
        {isEdit && (
          <div>
            <label className="block text-sm">Status</label>
            <select
              {...register("status")}
              className="w-full p-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <div className="md:col-span-2">
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
