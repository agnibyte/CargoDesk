"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import { DOCUMENTS_TYPE_LIST } from "@/utilities/dummyData";
import { getConstant } from "@/utilities/utils";
import { useFleetDriver } from "@/context/fleetDriverContext";
import {
  FloatingInput,
  FloatingSelect,
  FloatingDatePicker,
  FloatingTextarea,
} from "../floatingInput";
import { FiMic, FiCheck, FiFileText } from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";
import useAutoFocusField from "@/hooks/useAutoFocusField";

const DEFAULT_DOC_VALUES = {
  vehicleNo: "",
  documentType: "",
  expiryDate: moment().format("YYYY-MM-DD"),
  note: "",
};

export default function AddDocumentForm({
  setReminderModal,
  addReminderData,
  reminderData,
  isEdit,
  setIsEdit,
  focusField,
  updateReminderData,
  isLoading,
}) {
  const [isListening, setIsListening] = useState(false);
  const { fleets = [], refreshFleets } = useFleetDriver() || {};

  useEffect(() => {
    if (Array.isArray(fleets) && fleets.length === 0 && refreshFleets) {
      refreshFleets();
    }
  }, [fleets, refreshFleets]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_DOC_VALUES,
  });

  const watchedNote = watch("note");

  // Dynamic vehicle options populated from common fleets context
  const vehicleOptions = useMemo(() => {
    const list = [{ value: "", label: "Select Vehicle Number" }];
    const seen = new Set();

    if (Array.isArray(fleets)) {
      fleets.forEach((f) => {
        const vNum = f.vehicle_number?.trim();
        if (vNum && !seen.has(vNum.toUpperCase())) {
          seen.add(vNum.toUpperCase());
          const labelSuffix = f.vehicle_model
            ? ` (${f.vehicle_model})`
            : f.vehicle_type
            ? ` (${f.vehicle_type})`
            : "";
          list.push({
            value: vNum,
            label: `${vNum}${labelSuffix}`,
            id: f.id,
            fleet: f,
          });
        }
      });
    }

    return list;
  }, [fleets]);

  // Standardized document type options
  const documentTypeOptions = useMemo(() => {
    return [
      { value: "", label: "Select Document Type" },
      ...DOCUMENTS_TYPE_LIST.map((d) => ({
        value: (d.value || d.label).toLowerCase(),
        label: d.label,
      })),
    ];
  }, []);

  // Sync form values on edit or reset
  useEffect(() => {
    if (isEdit && reminderData) {
      // Resolve vehicleNo (could be object, formatted string, or lowercase)
      let vNo = "";
      if (typeof reminderData.vehicleNo === "object" && reminderData.vehicleNo !== null) {
        vNo = reminderData.vehicleNo.value || reminderData.vehicleNo.label || "";
      } else if (reminderData.vehicleNo) {
        vNo = String(reminderData.vehicleNo);
      }

      // Check if matched in vehicleOptions
      const matchedVeh = vehicleOptions.find(
        (opt) =>
          opt.value?.toUpperCase() === vNo.toUpperCase() ||
          opt.label?.toUpperCase() === vNo.toUpperCase()
      );
      if (matchedVeh && matchedVeh.value) {
        vNo = matchedVeh.value;
      }

      // Resolve documentType
      let docType = "";
      if (typeof reminderData.documentType === "object" && reminderData.documentType !== null) {
        docType = reminderData.documentType.value || reminderData.documentType.label || "";
      } else if (reminderData.documentType) {
        docType = String(reminderData.documentType);
      }

      const matchedDoc = documentTypeOptions.find(
        (opt) =>
          opt.value?.toLowerCase() === docType.toLowerCase() ||
          opt.label?.toLowerCase() === docType.toLowerCase()
      );
      if (matchedDoc && matchedDoc.value) {
        docType = matchedDoc.value;
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
      reset(DEFAULT_DOC_VALUES);
    }
  }, [isEdit, reminderData, reset, vehicleOptions, documentTypeOptions]);

  // Reusable platform-wide auto-scroll and highlight target field (only when triggered from table cell)
  useAutoFocusField(focusField, Boolean(focusField), [reminderData, isEdit]);

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
    const formattedExpiryDate = data.expiryDate
      ? moment(data.expiryDate).toISOString()
      : moment().toISOString();

    const selectedVehicleObj = vehicleOptions.find(
      (v) =>
        v.value?.toUpperCase() === String(data.vehicleNo).toUpperCase() ||
        v.label?.toUpperCase() === String(data.vehicleNo).toUpperCase()
    );
    const selectedDocObj = documentTypeOptions.find(
      (d) =>
        d.value?.toLowerCase() === String(data.documentType).toLowerCase() ||
        d.label?.toLowerCase() === String(data.documentType).toLowerCase()
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-4 sm:px-6 py-3 space-y-4 bg-slate-50">
      {/* Vehicle Number Field */}
      <div data-field-container data-field="vehicleNo">
        <Controller
          name="vehicleNo"
          control={control}
          rules={{ required: "Please select vehicle number" }}
          render={({ field }) => (
            <FloatingSelect
              id="doc_vehicle_no"
              name="vehicleNo"
              label="Vehicle Number"
              required
              options={vehicleOptions}
              error={errors.vehicleNo}
              value={field.value}
              selectedValue={field.value}
              onChange={(val) => {
                const actualVal =
                  val && typeof val === "object"
                    ? val.value !== undefined
                      ? val.value
                      : val.target?.value
                    : val;
                field.onChange(actualVal || "");
              }}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      {/* Document Type Field */}
      <div data-field-container data-field="documentType">
        <Controller
          name="documentType"
          control={control}
          rules={{ required: "Please select document type" }}
          render={({ field }) => (
            <FloatingSelect
              id="doc_type"
              name="documentType"
              label="Document Type"
              required
              options={documentTypeOptions}
              error={errors.documentType}
              value={field.value}
              selectedValue={field.value}
              onChange={(val) => {
                const actualVal =
                  val && typeof val === "object"
                    ? val.value !== undefined
                      ? val.value
                      : val.target?.value
                    : val;
                field.onChange(actualVal || "");
              }}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      {/* Expiry Date Field with Material UI X Date Picker */}
      <div data-field-container data-field="expiryDate">
        <Controller
          name="expiryDate"
          control={control}
          rules={{ required: "Please enter the expiry date" }}
          render={({ field }) => (
            <FloatingDatePicker
              id="doc_expiry_date"
              name="expiryDate"
              label="Select Expiry Date"
              required
              format="DD/MM/YYYY"
              error={errors.expiryDate}
              value={field.value}
              onChange={(val) => {
                const formatted =
                  val && moment(val).isValid()
                    ? moment(val).format("YYYY-MM-DD")
                    : val;
                field.onChange(formatted);
              }}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      {/* Add Note with Voice Recording */}
      <div data-field-container data-field="note">
        <FloatingInput
          id="doc_note"
          name="note"
          label="Add Note (Optional)"
          placeholder="Type or click mic to speak..."
          error={errors.note}
          rightElement={
            <button
              type="button"
              tabIndex={-1}
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
      </div>

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
