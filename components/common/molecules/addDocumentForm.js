import React, { useEffect, useState } from "react";
import { DocValidation } from "@/utilities/formValidation";
import { Controller, useForm } from "react-hook-form";
import commonStyle from "@/styles/common/common.module.scss";
import { DOCUMENTS_TYPE_LIST, vehicleNoListArr } from "@/utilities/dummyData";
import moment from "moment";
import { getConstant } from "@/utilities/utils";
import styles from "@/styles/formStyles.module.scss";
import CustomDatePicker from "../customDatePicker";
import CustomSearch from "../customSearch";
import { InputWithVoice } from "../inputWithVoice";

export default function AddDocumentForm({
  addReminderData,
  reminderData,
  isEdit,
  setIsEdit,
  updateReminderData,
  isLoading,
}) {
  const defaultData = {
    // masterNo: "",
    vehicleNo: "",
    documentType: "",
    expiryDate: moment(),
    alertDate: "",
    note: "",
  };

  const DOCUMENTS_TYPE_LIST_ARR = DOCUMENTS_TYPE_LIST;
  const VEHICLE_NO_LIST_ARR = vehicleNoListArr;

  const initialFormData = isEdit
    ? {
        ...reminderData,
        vehicleNo:
          VEHICLE_NO_LIST_ARR.find(
            (el) => el.value === reminderData.vehicleNo
          ) || null,
        documentType:
          DOCUMENTS_TYPE_LIST_ARR.find(
            (el) => el.value === reminderData.documentType
          ) || null,
      }
    : defaultData;

  const [formData, setFormData] = useState(initialFormData);
  const [expiryDateError, setExpiryDateError] = useState("");
  const [expiryDate, setExpiryDate] = useState(
    isEdit ? reminderData.expiryDate : defaultData.expiryDate
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();

  useEffect(() => {
    if (isEdit && reminderData) {
      setValue("vehicleNo", initialFormData.vehicleNo);
      setValue("documentType", initialFormData.documentType);
      setValue("expiryDate", initialFormData.expiryDate);
    }
  }, [isEdit, reminderData, setValue]);

  const updateSelectedForm = (type, value) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const onChangeExpiryDate = (date) => {
    if (!date) {
      setExpiryDateError("Please enter the expiry date");
    } else {
      setExpiryDateError("");
      const formattedDate = moment(date).toISOString();
      setExpiryDate(formattedDate);
      updateSelectedForm("expiryDate", formattedDate);
    }
  };

  const onClickSubmit = () => {
    if (!formData.expiryDate) {
      setExpiryDateError("Please enter the expiry date");
      return;
    }

    const newData = {
      ...formData,
      vehicleNo: formData.vehicleNo?.value,
      documentType: formData.documentType?.value,
    };

    if (isEdit) {
      updateReminderData(newData);
    } else {
      addReminderData(newData);
    }

    reset(defaultData);
  };

  return (
    <form
      onSubmit={handleSubmit(onClickSubmit)}
      className={styles.formContainer}
    >
      {/* <div className="form-group">
        <label
          htmlFor="masterNo"
          className="form-label"
        >
          Master Number
        </label>
        <input
          {...validation.masterNo}
          type="text"
          placeholder="Enter master number"
          className={`form-control ${errors?.masterNo ? "is-invalid" : ""}`}
          id="masterNo"
          name="masterNo"
          value={formData.masterNo}
          onChange={(e) => updateSelectedForm("masterNo", e.target.value)}
        />
        {errors?.masterNo && (
          <div className="invalid-feedback">{errors.masterNo.message}</div>
        )}
      </div> */}
      <InputWithVoice
        note={formData.note}
        setNote={(value) => updateSelectedForm("note", value)}
        label="Add Note"
      />

      <div className="form-group mt-3">
        <label
          htmlFor="vehicleNo"
          className="form-label"
        >
          Vehicle Number
        </label>
        <Controller
          control={control}
          name="vehicleNo"
          render={({ field }) => (
            <CustomSearch
              {...field}
              {...register("vehicleNo", DocValidation.vehicleNo)}
              selectedValue={formData.vehicleNo}
              options={VEHICLE_NO_LIST_ARR}
              onChange={(e) => {
                field.onChange(e);
                clearErrors("vehicleNo");
                updateSelectedForm("vehicleNo", e);
              }}
              className="form-control"
              placeholder="Please Select Vehicle Number"
              isSearchable
            />
          )}
        />
        {errors.vehicleNo && (
          <div className={styles.errorMsg}>{errors.vehicleNo.message}</div>
        )}
      </div>

      <div className="form-group mt-3">
        <label
          htmlFor="documentType"
          className="form-label"
        >
          Document Type
        </label>
        <Controller
          control={control}
          name="documentType"
          render={({ field }) => (
            <CustomSearch
              {...field}
              {...register("documentType", DocValidation.documentType)}
              selectedValue={formData.documentType}
              options={DOCUMENTS_TYPE_LIST_ARR}
              onChange={(e) => {
                field.onChange(e);
                clearErrors("documentType");
                updateSelectedForm("documentType", e);
              }}
              placeholder="Please Select Document Type"
              isSearchable
            />
          )}
        />
        {errors.documentType && (
          <div className={styles.errorMsg}>{errors.documentType.message}</div>
        )}
      </div>

      <div className="form-group mt-3">
        <label
          htmlFor="expiryDate"
          className="form-label"
        >
          Select Expiry Date
        </label>{" "}
        <br />
        <div className="mt-2">
          <CustomDatePicker
            value={expiryDate ? moment(expiryDate) : null}
            onChange={onChangeExpiryDate}
          />
        </div>
        {expiryDateError && (
          <div className={styles.errorMsg}>{expiryDateError}</div>
        )}
      </div>

      <div className={`${styles.formActions}`}>
        <button
          type="submit"
          className={` ${styles.btn} ${
            isEdit ? styles.btnWarning : styles.btnPrimary
          }`}
        >
          {isLoading
            ? getConstant("LOADING_TEXT")
            : isEdit
            ? "Update"
            : "Submit"}
        </button>
      </div>
    </form>
  );
}
