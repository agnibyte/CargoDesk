"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { postApiData } from "@/utilities/services/apiService";
import { showToast } from "@/utilities/toastService";
import { vehicleNoListArr } from "@/utilities/dummyData";
import {
  FLEET_VEHICLE_TYPES,
  FLEET_FUEL_TYPES,
  FLEET_OWNERSHIP_TYPES,
  FLEET_STATUS_OPTIONS,
} from "@/utilities/masterData";
import {
  FiTruck,
  FiUser,
  FiFileText,
  FiSettings,
  FiCheck,
  FiShield,
} from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";

export default function FleetForm({
  setFleetList,
  modalData,
  isEdit,
  onClose,
  toggleModal,
}) {
  const defaultFormData = {
    vehicle_number: "",
    vehicle_model: "",
    vehicle_type: FLEET_VEHICLE_TYPES[0] || "Heavy Truck (16-25T)",
    capacity: "",
    fuel_type: "Diesel",
    ownership_type: "Owned",
    manufacturing_year: new Date().getFullYear().toString(),
    driver_name: "",
    driver_contact: "",
    gps_tracking_id: "",
    chassis_number: "",
    engine_number: "",
    status: "Active",
    notes: "",
  };

  const [apiLoading, setApiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: defaultFormData,
  });

  // Populate data when editing
  useEffect(() => {
    if (isEdit && modalData) {
      reset({
        vehicle_number: modalData.vehicle_number || modalData.vehicleNo || "",
        vehicle_model: modalData.vehicle_model || "",
        vehicle_type: modalData.vehicle_type || FLEET_VEHICLE_TYPES[0],
        capacity: modalData.capacity || "",
        fuel_type: modalData.fuel_type || "Diesel",
        ownership_type: modalData.ownership_type || "Owned",
        manufacturing_year: modalData.manufacturing_year || "",
        driver_name: modalData.driver_name || "",
        driver_contact: modalData.driver_contact || "",
        gps_tracking_id: modalData.gps_tracking_id || "",
        chassis_number: modalData.chassis_number || "",
        engine_number: modalData.engine_number || "",
        status: modalData.status || "Active",
        notes: modalData.notes || modalData.note || "",
      });
    } else {
      reset(defaultFormData);
    }
  }, [isEdit, modalData, reset]);

  const handleClose = () => {
    if (onClose) onClose();
    if (toggleModal) toggleModal();
  };

  const onSubmit = async (data) => {
    setApiLoading(true);

    const payload = {
      vehicle_number: data.vehicle_number
        ? data.vehicle_number.toUpperCase().trim()
        : "",
      vehicle_model: data.vehicle_model ? data.vehicle_model.trim() : "",
      vehicle_type: data.vehicle_type || "",
      capacity: data.capacity ? data.capacity.trim() : "",
      fuel_type: data.fuel_type || "Diesel",
      ownership_type: data.ownership_type || "Owned",
      manufacturing_year: data.manufacturing_year
        ? data.manufacturing_year.trim()
        : "",
      driver_name: data.driver_name ? data.driver_name.trim() : "",
      driver_contact: data.driver_contact ? data.driver_contact.trim() : "",
      gps_tracking_id: data.gps_tracking_id
        ? data.gps_tracking_id.trim()
        : "",
      chassis_number: data.chassis_number ? data.chassis_number.trim() : "",
      engine_number: data.engine_number ? data.engine_number.trim() : "",
      status: data.status || "Active",
      notes: data.notes ? data.notes.trim() : "",
    };

    let response;
    if (isEdit) {
      payload.id = modalData.id;
      response = await postApiData("UPDATE_FLEET", payload);
    } else {
      response = await postApiData("ADD_NEW_FLEET", payload);
    }

    if (response && response.status) {
      if (isEdit) {
        setFleetList((prev) =>
          prev.map((item) =>
            item.id == modalData.id
              ? { ...item, ...payload, id: modalData.id }
              : item
          )
        );
        showToast(response.message || "Fleet updated successfully", "success");
      } else {
        showToast(response.message || "Fleet added successfully", "success");
        setFleetList((prev) => [
          { ...payload, id: response.id || Date.now() },
          ...prev,
        ]);
      }

      reset(defaultFormData);
      handleClose();
    } else {
      showToast(response?.message || "Failed to save fleet record", "error");
    }

    setApiLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 md:p-6 space-y-5 max-h-[82vh] overflow-y-auto"
    >
      {/* 1. Vehicle Identity & Model */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shadow-2xs">
            <FiTruck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Vehicle Identity & Specification
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Registration number, model, vehicle category and fuel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vehicle Registration Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Vehicle Registration No. <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              list="fleetVehicleSuggestions"
              placeholder="e.g. MH 04 EF 9101"
              {...register("vehicle_number", {
                required: "Vehicle Registration Number is required",
                onChange: (e) =>
                  setValue("vehicle_number", e.target.value.toUpperCase()),
              })}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border ${
                errors.vehicle_number
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/15"
              } outline-none focus:ring-2 transition-all shadow-2xs uppercase placeholder:normal-case font-semibold`}
            />
            <datalist id="fleetVehicleSuggestions">
              {vehicleNoListArr.map((item) => (
                <option key={item.id} value={item.label} />
              ))}
            </datalist>
            {errors.vehicle_number && (
              <p className="text-rose-500 text-xs font-medium mt-1">
                {errors.vehicle_number.message}
              </p>
            )}
          </div>

          {/* Model & Make */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Make & Model <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tata Prima 5530.S / Ashok Leyland 2820"
              {...register("vehicle_model", {
                required: "Make & Model is required",
              })}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border ${
                errors.vehicle_model
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/15"
              } outline-none focus:ring-2 transition-all shadow-2xs font-medium placeholder-slate-400`}
            />
            {errors.vehicle_model && (
              <p className="text-rose-500 text-xs font-medium mt-1">
                {errors.vehicle_model.message}
              </p>
            )}
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Vehicle Type / Body <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("vehicle_type", {
                required: "Vehicle Type is required",
              })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-medium cursor-pointer"
            >
              {FLEET_VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Fuel Type
            </label>
            <select
              {...register("fuel_type")}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-medium cursor-pointer"
            >
              {FLEET_FUEL_TYPES.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Capacity & Ownership */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shadow-2xs">
            <FiShield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Payload, Ownership & Tracking
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Capacity payload, manufacturing year, ownership and GPS tracking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payload Capacity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Payload Capacity <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 25 Tons / 35 Tons / 18 Cu.M"
              {...register("capacity", {
                required: "Payload Capacity is required",
              })}
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border ${
                errors.capacity
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/15"
              } outline-none focus:ring-2 transition-all shadow-2xs font-semibold placeholder-slate-400`}
            />
            {errors.capacity && (
              <p className="text-rose-500 text-xs font-medium mt-1">
                {errors.capacity.message}
              </p>
            )}
          </div>

          {/* Manufacturing Year */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Manufacturing / Model Year
            </label>
            <input
              type="number"
              min="1990"
              max="2035"
              placeholder="e.g. 2023"
              {...register("manufacturing_year")}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-medium placeholder-slate-400"
            />
          </div>

          {/* Ownership Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ownership Type
            </label>
            <select
              {...register("ownership_type")}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-medium cursor-pointer"
            >
              {FLEET_OWNERSHIP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* GPS Tracking Device ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              GPS Tracking ID / Fastag{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. GPS-TRK-9101"
              {...register("gps_tracking_id")}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-mono font-medium placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Driver Assignment */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shadow-2xs">
            <FiUser className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assigned Driver Details
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Primary driver name and direct contact mobile number
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Driver Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Assigned Driver Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Sharma"
              {...register("driver_name")}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-medium placeholder-slate-400"
            />
          </div>

          {/* Driver Contact */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Driver Mobile Contact
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98201 44552"
              {...register("driver_contact")}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-medium placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 4. Operational Status & Notes */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/60">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shadow-2xs">
            <FiFileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Operational Status & Notes
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Current vehicle operational status and special maintenance notes
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Operational Status
            </label>
            <select
              {...register("status")}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-medium cursor-pointer"
            >
              {FLEET_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Notes & Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Dedicated for North Corridor route. Tyre replacement scheduled next month..."
              {...register("notes")}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-2xs font-medium placeholder-slate-400 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 sticky bottom-0 bg-white py-2">
        <button
          type="button"
          onClick={handleClose}
          disabled={apiLoading}
          className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={apiLoading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/25 hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {apiLoading ? (
            <>
              <ImSpinner9 className="w-4 h-4 animate-spin" />
              <span>Saving Fleet...</span>
            </>
          ) : (
            <>
              <FiCheck className="w-4 h-4" />
              <span>{isEdit ? "Update Fleet Vehicle" : "Save Fleet Vehicle"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
