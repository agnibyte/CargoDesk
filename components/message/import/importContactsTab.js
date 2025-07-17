import React, { useState } from "react";
import Papa from "papaparse";
import GoogleSignIn from "./googleSignIn";
import ManualAddForm from "./manualAddForm";
import { parseVCF } from "@/utilities/vcfParser";
import ContactsFromCSV from "./contactsFromCSV";

const tabs = [
  { id: "google", label: "Google" },
  { id: "csv", label: "CSV" },
  { id: "vcf", label: "vCard" },
  { id: "manual", label: "Manual" },
];
export default function ImportContactsTab() {
  console.log("first in pinport");
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  console.log("contacts", contacts);

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
    <>
      <div className="mx-auto px-4 py-6 bg-white shadow-xl min-h-[60vh]">
        <h2 className="text-2xl font-medium mb-6 text-gray-800">
          Import Contacts
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="flex md:flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setContacts([]);
                }}
                className={`px-4 py-2 text-sm rounded-l-xl font-medium border transition ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 border-blue-500"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Google Import */}
            {activeTab === "google" && (
              <GoogleSignIn setContacts={setContacts} />
            )}

            {/* CSV Import */}
            {activeTab === "csv" && (
              <ContactsFromCSV
                contacts={contacts}
                setContacts={setContacts}
              />
            )}

            {/* VCF Import */}
            {activeTab === "vcf" && (
              <div className="border p-5 rounded-lg shadow bg-white">
                <label className="block font-semibold text-gray-800 mb-2">
                  Upload vCard (.vcf) File
                </label>
                <input
                  type="file"
                  accept=".vcf"
                  onChange={handleVCFImport}
                  className="block w-full border rounded px-3 py-2 text-sm text-gray-700"
                />
              </div>
            )}

            {/* Manual Input */}
            {activeTab === "manual" && (
              <ManualAddForm setContacts={setContacts} />
            )}

            {/* Imported Contacts Preview */}
            {contacts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Imported Contacts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contacts.map((c, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 p-4 rounded-md border border-gray-200 flex justify-between items-center shadow-sm"
                    >
                      <span className="font-medium text-gray-800 text-sm">
                        {c.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {c.contactNo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
