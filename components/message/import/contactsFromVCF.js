import React, { useState } from "react";
import { parseVCF } from "@/utilities/vcfParser";

export default function ContactsFromVCF({ contacts, setContacts }) {
  const handleVCFImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseVCF(text);
    setContacts(parsed);
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
