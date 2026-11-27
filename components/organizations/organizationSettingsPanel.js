"use client";

import React, { useMemo, useState } from "react";
import { FiSettings, FiMapPin, FiInfo } from "react-icons/fi";
import { ImSpinner9 } from "react-icons/im";
import { postApiData } from "@/utilities/services/apiService";
import { showToast } from "@/utilities/toastService";
import {
  ORGANIZATION_SETTINGS,
  resolveOrganizationSettings,
} from "@/utilities/organizationSettings";

const GROUP_ICONS = {
  "Service logs": FiMapPin,
};

/**
 * Settings tab of Organization Details. Lists every setting from utilities/organizationSettings.js, grouped, and
 * saves each change as soon as it is made. Super Admin (any organization) and this organization's Admin can edit;
 * the API enforces the same rule.
 */
export default function OrganizationSettingsPanel({ orgId, initialSettings, canEdit = true }) {
  const [settings, setSettings] = useState(() => resolveOrganizationSettings(initialSettings));
  const [savingKey, setSavingKey] = useState(null);

  const groups = useMemo(() => {
    const map = new Map();
    for (const def of ORGANIZATION_SETTINGS) {
      if (!map.has(def.group)) map.set(def.group, []);
      map.get(def.group).push(def);
    }
    return [...map.entries()];
  }, []);

  const save = async (def, value) => {
    if (!canEdit || savingKey) return;
    const previous = settings[def.key];
    setSettings((s) => ({ ...s, [def.key]: value })); // optimistic
    setSavingKey(def.key);
    try {
      const res = await postApiData("UPDATE_ORGANIZATION_SETTINGS", {
        orgId: Number(orgId),
        settings: { [def.key]: value },
      });
      if (res?.status) {
        setSettings(resolveOrganizationSettings(res.data?.settings));
        showToast({ type: "success", message: `${def.label}: ${describeValue(def, value)}` });
      } else {
        setSettings((s) => ({ ...s, [def.key]: previous }));
        showToast({ type: "error", message: res?.message || "Could not save the setting." });
      }
    } catch (err) {
      setSettings((s) => ({ ...s, [def.key]: previous }));
      showToast({ type: "error", message: "Could not save the setting." });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
          <FiSettings className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Organization Settings</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rules for how this organization&apos;s team works. Changes apply immediately to everyone in the organization.
          </p>
        </div>
      </div>

      {!canEdit && (
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <FiInfo className="w-3.5 h-3.5 shrink-0" />
          Only Super Admin or this organization&apos;s Admin can change these settings.
        </div>
      )}

      {groups.map(([group, defs]) => {
        const GroupIcon = GROUP_ICONS[group] || FiSettings;
        return (
          <section key={group} className="border border-slate-200/90 rounded-2xl overflow-hidden">
            <header className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/70 border-b border-slate-200/80">
              <GroupIcon className="w-3.5 h-3.5 text-slate-500" />
              <h4 className="text-[11px] font-bold uppercase tracking-wide text-slate-600">{group}</h4>
            </header>
            <ul className="divide-y divide-slate-100">
              {defs.map((def) => (
                <li key={def.key} className="flex items-start justify-between gap-4 px-4 py-3.5">
                  <div className="min-w-0">
                    <label htmlFor={`org-setting-${def.key}`} className="text-sm font-semibold text-slate-800">
                      {def.label}
                    </label>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">{def.description}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 pt-0.5">
                    {savingKey === def.key && <ImSpinner9 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
                    <SettingControl
                      def={def}
                      value={settings[def.key]}
                      disabled={!canEdit || Boolean(savingKey)}
                      onChange={(value) => save(def, value)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function describeValue(def, value) {
  if (def.type === "boolean") return value ? "On" : "Off";
  return def.options?.find((o) => o.value === value)?.label || String(value);
}

function SettingControl({ def, value, disabled, onChange }) {
  const id = `org-setting-${def.key}`;

  if (def.type === "boolean") {
    return (
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
          value ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span className="sr-only">{def.label}</span>
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    );
  }

  if (def.type === "select") {
    return (
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
      >
        {(def.options || []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  return null;
}
