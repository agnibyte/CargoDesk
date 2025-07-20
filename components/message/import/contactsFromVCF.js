import React, { useEffect, useRef, useState } from "react";
import { parseVCF } from "@/utilities/vcfParser";

export default function ContactsFromVCF({ contacts, setContacts, apiSuccess }) {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (apiSuccess) {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [apiSuccess]);

  const handleVCFImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const rawContacts = parseVCF(text); // expected output: [{ name, contactNo }, ...]

    const seen = new Set();

    const cleanedContacts = rawContacts
      .map((contact) => {
        const name = contact.name?.trim() || "";
        let contactNo = contact.contactNo?.replace(/\D/g, "") || "";

        if (contactNo.length > 10) {
          contactNo = contactNo.slice(-10);
        }

        if (contactNo.length === 10 && !seen.has(contactNo)) {
          seen.add(contactNo);
          return { name, contactNo };
        }

        return null;
      })
      .filter(Boolean); // remove nulls

    setContacts(cleanedContacts);
  };

  return (
    <div className="w-full  bg-white border border-gray-200 rounded-xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Upload vCard (.vcf) File
        </h3>
      </div>

      <div className="bg-gray-10 md:p-4 rounded-md mb-4">
        <input
          type="file"
          accept=".vcf"
          ref={fileInputRef}
          onChange={handleVCFImport}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4
            file:rounded-l-md file:border file:border-gray-300
            file:text-sm file:font-semibold
            file:bg-blue-100 file:text-blue-900 
            hover:file:bg-blue-100 border border-gray-300 rounded-md file:cursor-pointer cursor-pointer"
        />
      </div>

      <p className="text-xs text-gray-500">
        Accepted format: <code>.vcf</code> only. Must contain <code>name</code>{" "}
        and <code>contactNo</code> columns.
      </p>
    </div>
  );
}
