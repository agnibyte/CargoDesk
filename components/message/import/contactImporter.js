import React, { useState } from "react";
import Papa from "papaparse";
import GoogleSignIn from "./googleSignIn";
import ManualAddForm from "./manualAddForm";
import { parseVCF } from "@/utilities/vcfParser";

const tabs = [
  { id: "google", label: "Google" },
  { id: "csv", label: "CSV" },
  { id: "vcf", label: "vCard" },
  { id: "manual", label: "Manual" },
];

export default function ContactImporter() {
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("google");

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data.map((row) => ({
          name: row.name || row.Name || "Unnamed",
          contactNo: row.contactNo || row.Phone || "",
        }));
        setContacts(data);
      },
    });
  };

  const handleVCFImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseVCF(text);
    setContacts(parsed);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Import Contdddacts</h2>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "google" && <GoogleSignIn setContacts={setContacts} />}

      {activeTab === "csv" && (
        <div className="border p-4 rounded shadow-sm bg-white">
          <label className="block font-medium mb-2">Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            className="w-full"
          />
        </div>
      )}

      {activeTab === "vcf" && (
        <div className="border p-4 rounded shadow-sm bg-white">
          <label className="block font-medium mb-2">
            Upload vCard (.vcf) File
          </label>
          <input
            type="file"
            accept=".vcf"
            onChange={handleVCFImport}
            className="w-full"
          />
        </div>
      )}

      {activeTab === "manual" && <ManualAddForm setContacts={setContacts} />}

      {contacts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Imported Contacts</h3>
          <div className="grid grid-cols-1 gap-3">
            {contacts.map((c, i) => (
              <div
                key={i}
                className="bg-gray-100 p-3 rounded shadow-sm flex justify-between"
              >
                <span className="font-medium text-sm">{c.name}</span>
                <span className="text-sm text-gray-600">{c.contactNo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
