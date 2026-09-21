"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import { DOCUMENTS_TYPE_LIST, vehicleNoListArr } from "@/utilities/dummyData";
import { getConstant } from "@/utilities/utils";
import {
  FloatingInput,
  FloatingSelect,
  FloatingTextarea,
} from "../floatingInput";
import { FiMic, FiCheck, FiFileText } from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";
import { showToast } from "@/utilities/toastService";

export default function AddDocumentForm({
  setReminderModal,
  addReminderData,
  reminderData,
  isEdit,
  setIsEdit,
  updateReminderData,
  isLoading,
}) {
  const [isListening, setIsListening] = useState(false);

  const defaultValues = {
    vehicleNo: "",
    documentType: "",
    expiryDate: moment().format("YYYY-MM-DD"),
    note: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const watchedNote = watch("note");

  useEffect(() => {
    if (isEdit && reminderData) {
      // Resolve vehicleNo (could be object or string)
      let vNo = "";
      if (typeof reminderData.vehicleNo === "object" && reminderData.vehicleNo !== null) {
        vNo = reminderData.vehicleNo.value || "";
      } else if (reminderData.vehicleNo) {
        vNo = reminderData.vehicleNo;
      }

      // Resolve documentType (could be object or string)
      let docType = "";
      if (typeof reminderData.documentType === "object" && reminderData.documentType !== null) {
        docType = reminderData.documentType.value || "";
      } else if (reminderData.documentType) {
        docType = reminderData.documentType;
      }

      const expDate = reminderData.expiryDate
        ? moment(reminderData.expiryDate).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      reset({
        vehicleNo: vNo,
        documentType: docType,
        expiryDate: expDate,
        note: reminderData.note || "",
      });
    } else {
      reset(defaultValues);
    }
  }, [isEdit, reminderData, reset]);

  // Speech recognition handler
  const handleSpeechRecognition = () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      showToast({
        message: "Speech recognition is not supported in this browser.",
        type: "error",
      });
      return;
    }

    try {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const current = watchedNote ? `${watchedNote} ` : "";
        setValue("note", `${current}${transcript}`.trim());
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const onSubmit = (data) => {
    const formattedExpiryDate = moment(data.expiryDate).toISOString();

    const selectedVehicleObj = vehicleNoListArr.find(
      (v) => v.value === data.vehicleNo || v.label === data.vehicleNo
    );
    const selectedDocObj = DOCUMENTS_TYPE_LIST.find(
      (d) => d.value === data.documentType || d.label === data.documentType
    );

    const payload = {
      ...reminderData,
      vehicleNo: data.vehicleNo,
      documentType: data.documentType,
      expiryDate: formattedExpiryDate,
      note: data.note ? data.note.trim() : "",
      vehicleObj: selectedVehicleObj,
      docObj: selectedDocObj,
    };

    if (isEdit && updateReminderData) {
      updateReminderData(payload);
    } else if (addReminderData) {
      addReminderData(payload);
    }

    if (setReminderModal) {
      setReminderModal(false);
    }
    reset(defaultValues);
  };

  // Convert dummyData arrays into label/value option items for FloatingSelect
  const vehicleOptions = [
    { value: "", label: "Select Vehicle Number" },
    ...vehicleNoListArr.map((v) => ({
      value: v.value || v.label,
      label: v.label,
    })),
  ];

  const documentTypeOptions = [
    { value: "", label: "Select Document Type" },
    ...DOCUMENTS_TYPE_LIST.map((d) => ({
      value: d.value || d.label,
      label: d.label,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-4 sm:px-6 py-3 space-y-4 bg-slate-50 rounded-xl">
      {/* Vehicle Number Field */}
      <FloatingSelect
        id="doc_vehicle_no"
        label="Vehicle Number"
        required
        options={vehicleOptions}
        error={errors.vehicleNo}
        {...register("vehicleNo", {
          required: "Please select vehicle number",
        })}
      />

      {/* Document Type Field */}
      <FloatingSelect
        id="doc_type"
        label="Document Type"
        required
        options={documentTypeOptions}
        error={errors.documentType}
        {...register("documentType", {
          required: "Please select document type",
        })}
      />

      {/* Expiry Date Field */}
      <FloatingInput
        id="doc_expiry_date"
        label="Select Expiry Date"
        required
        type="date"
        error={errors.expiryDate}
        {...register("expiryDate", {
          required: "Please enter the expiry date",
        })}
      />

      {/* Add Note with Voice Recording */}
      <FloatingInput
        id="doc_note"
        label="Add Note (Optional)"
        placeholder="Type or click mic to speak..."
        error={errors.note}
        rightElement={
          <button
            type="button"
            onClick={handleSpeechRecognition}
            title={isListening ? "Listening..." : "Voice input"}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isListening
                ? "bg-rose-500 text-white animate-pulse"
                : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <FiMic className="w-4 h-4" />
          </button>
        }
        {...register("note")}
      />

      {/* Form Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-2">
        {setReminderModal && (
          <button
            type="button"
            onClick={() => setReminderModal(false)}
            disabled={isLoading}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/25 hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <ImSpinner9 className="w-4 h-4 animate-spin" />
              <span>{getConstant("LOADING_TEXT") || "Saving..."}</span>
            </>
          ) : (
            <>
              <FiCheck className="w-4 h-4" />
              <span>{isEdit ? "Update Document" : "Save Document"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
