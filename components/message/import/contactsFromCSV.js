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
        console.log("results", results);
        const parsedContacts = results.data.map((row) => ({
          name: row.name?.trim(),
          contactNo: row.contactNo?.trim(),
        }));
        setContacts(parsedContacts);
      },
    });
  };

  return (
    <div className="w-full  bg-white border border-gray-200 rounded-xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Import Contacts (CSV)
        </h3>
      </div>

      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-700 mb-2">
          Need a format?{" "}
          <a
            href="/downloads/sampleContacts.csv"
            download="sampleContacts.csv"
            className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
          >
            <MdOutlineFileUpload className="w-4 h-4" />
            Download Sample CSV
          </a>
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <p className="text-xs text-gray-500">
        Accepted format: <code>.csv</code> only. Must contain <code>name</code>{" "}
        and <code>contactNo</code> columns.
      </p>
    </div>
  );
}
