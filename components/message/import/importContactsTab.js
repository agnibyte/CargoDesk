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
      <h2 className="text-xl font-bold mb-4">Import Contacts</h2>
      <div className="md:p-6 mt-3 flex flex-col md:flex-row space-x-4 mx-auto">
        <div className="flex flex-row md:flex-col gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setContacts([]);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                activeTab === tab.id
                  ? "bg-gray-200 text-black border-2 border-blue-600"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "google" && <GoogleSignIn setContacts={setContacts} />}

        {activeTab === "csv" && (
          <ContactsFromCSV
            contacts={contacts}
            setContacts={setContacts}
          />
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
    </>
  );
}
