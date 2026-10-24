import React, { useState, useEffect } from "react";
import CommonModal from "../common/commonModal";
import {
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHash,
  FiX,
  FiCheck,
  FiUserCheck,
} from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";

export default function OrganizationModal({
  isOpen,
  onClose,
  onSubmit,
  isEdit = false,
  orgData = null,
  isSubmitting = false,
}) {
  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (orgData && isEdit) {
      setOrgName(orgData.orgName || "");
      setOrgCode(orgData.orgCode || "");
      setContactEmail(orgData.contactEmail || "");
      setContactPhone(orgData.contactPhone || "");
      setAddress(orgData.address || "");
      setStatus(orgData.status || "Active");
    } else {
      setOrgName("");
      setOrgCode("");
      setContactEmail("");
      setContactPhone("");
      setAddress("");
      setStatus("Active");
    }
    setErrors({});
  }, [orgData, isEdit, isOpen]);

  const handleNameChange = (val) => {
    setOrgName(val);
    if (!isEdit && !orgCode) {
      const generated = val
        .split(" ")
        .map((w) => w.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 4);
      if (generated) {
        setOrgCode(generated + "-" + Math.floor(100 + Math.random() * 900));
      }
    }
  };

  const validate = () => {
    const errs = {};
    if (!orgName.trim()) errs.orgName = "Organization name is required";
    if (
      contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())
    ) {
      errs.contactEmail = "Please enter a valid email address";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      orgName: orgName.trim(),
      orgCode: orgCode.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim(),
      address: address.trim(),
      status: status,
    };

    if (isEdit && orgData?.orgId) {
      payload.orgId = orgData.orgId;
    }

    onSubmit(payload);
  };

  return (
    <CommonModal
      modalOpen={isOpen}
      setModalOpen={onClose}
      backDrop={false}
      modalSize="w-11/12 sm:max-w-lg"
      noScroll={true}
    >
      <div className="w-full flex flex-col h-full min-h-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <FiBriefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                {isEdit ? "Edit Organization" : "Create New Organization"}
              </h3>
              <p className="text-xs text-purple-200">
                {isEdit
                  ? "Update company information and branch details."
                  : "Register an organization to provision administrators and staff."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0"
        >
          {/* Auto Admin Provisioning Callout */}
          {!isEdit && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/80 border border-purple-200/70 text-xs text-purple-900">
              <FiUserCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-purple-950">Auto Admin User:</span>{" "}
                Creating this organization will automatically provision an Admin user{" "}
                <span className="font-bold underline decoration-purple-300">
                  "{orgName.trim() ? `${orgName.trim()} - Admin` : "Organization - Admin"}"
                </span>{" "}
                with these contact details and default password{" "}
                <code className="px-1.5 py-0.5 rounded bg-purple-200/60 font-mono text-[11px] font-semibold text-purple-900">
                  CargoDesk@2025
                </code>
                .
              </div>
            </div>
          )}

          {/* Organization Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organization Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FiBriefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orgName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Apex Cargo Movers Ltd"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                  errors.orgName
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all`}
              />
            </div>
            {errors.orgName && (
              <p className="text-xs text-rose-500 mt-1">{errors.orgName}</p>
            )}
          </div>

          {/* Org Code & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Org Code / Identifier
              </label>
              <div className="relative">
                <FiHash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                  placeholder="e.g. APEX-101"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>

              <div className="flex items-center w-full rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all overflow-hidden">
                {/* India Flag + Country Code */}
                <div className="flex items-center gap-2 pl-3 pr-3 py-2 bg-slate-50 border-r border-slate-200 shrink-0">
                  {/* <span
                    className="text-base"
                    role="img"
                    aria-label="India flag"
                  >
                    🇮🇳
                  </span> */}
                  <span className="text-sm font-medium text-slate-700 select-none">
                    +91
                  </span>
                </div>

                {/* Phone Number Input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={contactPhone}
                  onChange={(e) =>
                    setContactPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="00000 00000"
                  minLength={10}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                  className="w-full min-w-0 px-3 py-2 text-sm bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email
            </label>
            <div className="relative">
              <FiMail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@apexcargo.com"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                  errors.contactEmail
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-slate-200"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all`}
              />
            </div>
            {errors.contactEmail && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.contactEmail}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Office / Depot Address
            </label>
            <div className="relative">
              <FiMapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Logistics Park, Hub 4, Mumbai, India"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStatus("Active")}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus("Inactive")}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  status === "Inactive"
                    ? "bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-500/20"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Inactive
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:scale-98 rounded-xl shadow-md shadow-purple-600/25 transition-all flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <ImSpinner9 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>
                {isEdit ? "Update Organization" : "Create Organization"}
              </span>
            )}
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
