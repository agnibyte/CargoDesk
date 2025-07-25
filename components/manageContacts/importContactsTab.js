import React, { useState } from "react";
import Papa from "papaparse";
import GoogleSignIn from "../message/import/googleSignIn";
import ManualAddForm from "../message/import/manualAddForm";
import { parseVCF } from "@/utilities/vcfParser";
import ContactsFromCSV from "../message/import/contactsFromCSV";
import ContactsFromVCF from "../message/import/contactsFromVCF";
import { FcGoogle } from "react-icons/fc";
import { PiFileCsvDuotone } from "react-icons/pi";
// import { ReactComponent as Dialpad } from "@/public/imges/svg/dialpad.svg";
import msgStyle from "@/styles/manageContacts.module.scss";
import { BsPersonVcard } from "react-icons/bs";
import Image from "next/image";
import ContactsPreviewList from "../message/import/contactsPreviewList";
import GoogleContacts from "../message/googleContacts";

const tabs = [
  { id: "google", label: "Google" },
  { id: "csv", label: "CSV" },
  { id: "vcf", label: "vCard" },
  { id: "manual", label: "Manual" },
];
export default function ImportContactsTab({ pageData, setContactsList }) {
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [apiSuccess, setApiSuccess] = useState(false);

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
                    alt="CSV logo"
                    width={15}
                    height={15}
                    className={msgStyle.importOptionIcon}
                  />
                ) : tab.id == "manual" ? (
                  <Image
                    src={"/imges/svg/dialpad.svg"}
                    alt="Dialpad logo"
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
              // <GoogleSignIn setContacts={setContacts} />
              <GoogleContacts
                contacts={contacts}
                setContacts={setContacts}
              />
            )}

            {/* CSV Import */}
            {activeTab === "csv" && (
              <ContactsFromCSV
                contacts={contacts}
                setContacts={setContacts}
                apiSuccess={apiSuccess}
              />
            )}

            {/* VCF Import */}
            {activeTab === "vcf" && (
              <ContactsFromVCF
                contacts={contacts}
                setContacts={setContacts}
                apiSuccess={apiSuccess}
              />
            )}

            {/* Manual Input */}
            {activeTab === "manual" && (
              <ManualAddForm
                setContacts={setContacts}
                pageData={pageData}
                setContactsList={setContactsList}
              />
            )}

            {/* Imported Contacts Preview */}

            <ContactsPreviewList
              contacts={contacts}
              setContacts={setContacts}
              pageData={pageData}
              apiSuccess={apiSuccess}
              setApiSuccess={setApiSuccess}
              setContactsList={setContactsList}
            />
          </div>
        </div>
      </div>
    </>
  );
}
