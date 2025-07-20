import React, { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import Papa from "papaparse";

export default function ContactsFromCSV({ contacts, setContacts }) {
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const seen = new Set();

        const parsedContacts = results.data
          .map((row) => {
            const name = row.name?.trim() || "";
            let contactNo = row.contactNo?.replace(/\D/g, "") || ""; // remove non-digits

            // Get last 10 digits if more than 10
            if (contactNo.length > 10) {
              contactNo = contactNo.slice(-10);
            }

            // Only allow valid 10-digit numbers
            if (contactNo.length === 10 && !seen.has(contactNo)) {
              seen.add(contactNo);
              return { name, contactNo };
            }

            return null; // Invalid or duplicate
          })
          .filter(Boolean); // Remove nulls

        setContacts(parsedContacts);
      },
    });
  };

  return (
    <div className="w-full  bg-white border border-gray-200 rounded-xl shadow p-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 md:m-0">
          Import Contacts (CSV)
        </h3>
        <p className="text-sm text-gray-700 flex items-center gap-1 ">
          Need a format?{" "}
          <a
            href="/downloads/sampleContacts.csv"
            download="sampleContacts.csv"
            className="text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            <MdOutlineFileUpload className="w-4 h-4" />
            Download Sample CSV
          </a>
        </p>
      </div>

      <div className="bg-gray-10 md:p-4 rounded-md mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-l-md file:border file:border-gray-300
            file:text-sm file:font-semibold
            file:bg-blue-100 file:text-blue-900 
            hover:file:bg-blue-100 border border-gray-300 rounded-md file:cursor-pointer cursor-pointer"
        />
      </div>

      <p className="text-xs text-gray-500">
        Accepted format: <code>.csv</code> only. Must contain <code>name</code>{" "}
        and <code>contactNo</code> columns.
      </p>
    </div>
  );
}
