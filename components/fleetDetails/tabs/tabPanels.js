import React from "react";
import moment from "moment";
import {
  FiFileText,
  FiCreditCard,
  FiUser,
  FiTool,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiPhone,
  FiShield,
  FiActivity,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { HiOutlineTruck, HiOutlineDocumentText } from "react-icons/hi";

/**
 * Overview Tab Panel
 */
export function OverviewPanel({ fleet, onNavigateTab, onAddDocument }) {
  const status = (fleet?.status || "Active").toLowerCase();

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Vehicle Status
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                status === "active" ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900 capitalize">
            {fleet?.status || "Active"}
          </div>
          <p className="text-xs text-slate-400 mt-1">Operational state</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Documents
            </span>
            <HiOutlineDocumentText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {fleet?.counts?.documents || 0} Registered
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("documents")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1 inline-flex items-center gap-1"
          >
            View all documents <FiArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assigned Driver
            </span>
            <FiUser className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-base font-bold text-slate-900 truncate">
            {fleet?.driver_name || "No Driver Assigned"}
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("driver")}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-1 inline-flex items-center gap-1"
          >
            Manage driver <FiArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Financing & EMI
            </span>
            <FiCreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {fleet?.counts?.emi || 0} Active Loans
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("emi")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-1 inline-flex items-center gap-1"
          >
            View EMI schedule <FiArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Vehicle Operational Notes */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Fleet Vehicle Overview & Notes</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {fleet?.notes ||
            "Assigned for commercial logistics operations. All regular services, insurance, and fitness compliance certificates are monitored under CargoDesk fleet system."}
        </p>
      </div>
    </div>
  );
}

/**
 * Documents Tab Panel
 */
export function DocumentsPanel({ fleet, onAddDocument }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Vehicle Documents</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compliance certificates, insurance, PUC, permit, and fitness records.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddDocument}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="py-6 text-center text-slate-500 text-xs sm:text-sm">
        <p>Use the <strong>+ Add Document</strong> button above to upload insurance, PUC, fitness, or tax certificates for vehicle {fleet?.vehicle_number}.</p>
      </div>
    </div>
  );
}

/**
 * EMI Tab Panel
 */
export function EmiPanel({ fleet }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Loan & EMI Financing</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Active finance plans, monthly installments, and payment schedules.
          </p>
        </div>
      </div>

      <div className="py-6 text-center text-slate-500 text-xs sm:text-sm">
        <p>EMI and finance tracking for vehicle <strong>{fleet?.vehicle_number}</strong>.</p>
      </div>
    </div>
  );
}

/**
 * Driver Tab Panel
 */
export function DriverPanel({ fleet }) {
  const hasDriver = Boolean(fleet?.driver_name);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Assigned Driver</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary driver allocated to operate vehicle {fleet?.vehicle_number}.
          </p>
        </div>
      </div>

      {hasDriver ? (
        <div className="py-4 flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xl shadow-xs">
            {fleet.driver_name.charAt(0)}
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{fleet.driver_name}</h4>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <FiPhone className="w-3.5 h-3.5" />
              <span>{fleet.driver_contact || "No Contact Number"}</span>
            </p>
            {fleet.driver_license_number && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <FiShield className="w-3.5 h-3.5" />
                <span>License: {fleet.driver_license_number}</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-500 text-xs sm:text-sm">
          <p>No driver currently assigned to this fleet vehicle.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Maintenance Tab Panel
 */
export function MaintenancePanel({ fleet }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Maintenance & Service Logs</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Periodic maintenance, repairs, and service records.
          </p>
        </div>
      </div>

      <div className="py-6 text-center text-slate-500 text-xs sm:text-sm">
        <p>Current vehicle status: <strong className="capitalize">{fleet?.status || "Active"}</strong>.</p>
      </div>
    </div>
  );
}
