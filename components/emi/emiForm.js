"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

export default function EmiForm({ setEmiList }) {
    const defaultFormData = {
        loanName: "",
        loanAmount: "",
        emiAmount: "",
        tenure: "",
        startDate: "",
        paymentMode: "",
        dueDate: "",
        status: "active",
    };

    const [formData, setFormData] = useState(defaultFormData);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: defaultFormData,
    });

    const onSubmit = (data) => {
        console.log("Submitted EMI Data:", data);
        if (setEmiList) {
            setEmiList((prevList) => [...prevList, data]);
        }

        setFormData(data);
        reset(defaultFormData);
    };

    return (
        <div className="p-6 bg-white rounded-2xl">

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Loan Name */}
                <div>
                    <label className="block text-sm font-medium">Loan/Item Name</label>
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
                    <label className="block text-sm font-medium">Loan Amount</label>
                    <input
                        type="text"
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
                    <label className="block text-sm font-medium">EMI Amount</label>
                    <input
                        type="text"
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
                    <label className="block text-sm font-medium">Tenure (months)</label>
                    <input
                        type="text"
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
                    <label className="block text-sm font-medium">Start Date</label>
                    <input
                        type="date"
                        placeholder="Select EMI start date"
                        {...register("startDate", { required: "Start Date is required" })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.startDate && (
                        <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                    )}
                </div>

                {/* Payment Mode */}
                <div>
                    <label className="block text-sm font-medium">Payment Mode</label>
                    <select
                        {...register("paymentMode", { required: "Payment Mode is required" })}
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
                    <label className="block text-sm font-medium">Due Date (Monthly)</label>
                    <input
                        type="date"
                        placeholder="Select EMI due date"
                        {...register("dueDate", { required: "Due Date is required" })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.dueDate && (
                        <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                        {...register("status")}
                        defaultValue="Active"
                        className="w-full p-2 border rounded"
                    >
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>

                {/* Submit Button - span 2 cols */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Save EMI
                    </button>
                </div>
            </form>

        </div>
    );
}
