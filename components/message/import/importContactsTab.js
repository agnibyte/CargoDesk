import React, { useState } from "react";
import Papa from "papaparse";
import GoogleSignIn from "./googleSignIn";
import ManualAddForm from "./manualAddForm";
import { parseVCF } from "@/utilities/vcfParser";
import ContactsFromCSV from "./contactsFromCSV";
import ContactsFromVCF from "./contactsFromVCF";
import { FcGoogle } from "react-icons/fc";
import { PiFileCsvDuotone } from "react-icons/pi";
// import { ReactComponent as Dialpad } from "@/public/imges/svg/dialpad.svg";
import msgStyle from "@/styles/manageContacts.module.scss";

import { BsPersonVcard } from "react-icons/bs";
import Image from "next/image";

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

  return (
    <>
      <div className="mx-auto px-4 py-6 bg-white shadow-xl min-h-[60vh]">
        {/* <h2 className="text-2xl font-medium mb-6 text-gray-800">
          Import Contacts
        </h2> */}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="flex md:flex-col justify-start gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setContacts([]);
                }}
                className={`${msgStyle.importOption} ${
                  activeTab === tab.id ? msgStyle.active : msgStyle.inactive
                }`}
              >
                {tab.id == "google" ? (
                  <FcGoogle className="text-sm " />
                ) : tab.id == "vcf" ? (
                  <BsPersonVcard className="text-sm" />
                ) : tab.id == "csv" ? (
                  <Image
                    src={"/imges/svg/csv.svg"}
                    width={15}
                    height={15}
                    className={msgStyle.importOptionIcon}
                    />
                  ) : tab.id == "manual" ? (
                    <Image
                    src={"/imges/svg/dialpad.svg"}
                    width={15}
                    height={15}
                    className={msgStyle.importOptionIcon}
                  />
                ) : (
                  ""
                )}
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
              <ContactsFromVCF
                contacts={contacts}
                setContacts={setContacts}
              />
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
