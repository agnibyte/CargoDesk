import { postApiData } from "@/utilities/services/apiService";
import { getConstant } from "@/utilities/utils";
import React, { useState } from "react";
import { ImBin } from "react-icons/im";

export default function ContactsPreviewList({
  pageData,
  contacts,
  setContacts,
  apiSuccess,
  setApiSuccess,
  setContactsList,
}) {
  const [confirmIndex, setConfirmIndex] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = (index) => {
    console.log("Deleting contact:", contacts[index]);
    setContacts(contacts.filter((_, i) => i !== index));
    setConfirmIndex(null); // Hide confirmation
  };

  const saveAllContacts = async () => {
    setApiLoading(true);

    try {
      const payload = {
        id: pageData.user.userId,
        contacts: contacts.map((c) => ({
          name: c.name,
          contactNo: c.contactNo,
          note: c.note || "",
        })),
      };
      const response = await postApiData("IMPORT_CONTACTS_IN_BLUK", payload);
      if (response.status) {
        setContactsList((prev) => [...prev, ...contacts]);
        setSuccessMsg("Contacts saved successfully!!");
        setContacts([]);
        setApiSuccess(true);
        setTimeout(() => {
          setSuccessMsg("");
          setApiSuccess(false);
        }, 5000);
      } else {
        setErrorMsg(response.message);
      }
    } catch (err) {
      console.error("Message sending failed", err);
    }
    setApiLoading(false);
  };

  return (
    <div className="mt-6">
      {contacts.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Imported Contacts - {contacts.length}
          </h3>
          <div>
            <button
              onClick={saveAllContacts}
              className="px-6 py-2 bg-violet-700 text-white rounded hover:bg-violet-950 transition duration-300"
              disabled={apiLoading}
            >
              {apiLoading ? getConstant("LOADING_TEXT") : "Save All"}
            </button>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((c, i) => {
          const isConfirm = confirmIndex === i;
          return (
            <div
              key={i}
              className={`contact-card relative overflow-hidden border  border-gray-300 rounded-md shadow-sm transition-all duration-300 ${
                isConfirm ? "confirmContactDelete p-3" : "bg-white flex h-14"
              }`}
            >
              {!isConfirm ? (
                <>
                  <div className="w-[85%] lg:w-[90%] p-5 md:p-2 lg:p-5 bg-white text-gray-600 flex items-center justify-between">
                    <div className="text-md font-[450]">{c.name}</div>
                    <div className="text-md font-[450]">{c.contactNo}</div>
                  </div>
                  {!isConfirm && (
                    <button
                      className="w-[15%] lg:w-[10%] bg-red-600 text-white flex items-center justify-center rounded-r-md border border-red-600 text-sm hover:bg-red-700"
                      onClick={() => setConfirmIndex(i)}
                    >
                      <ImBin />
                    </button>
                  )}
                </>
              ) : (
                <div className="flex justify-between items-center relative z-10 text-white">
                  <span className="font-semibold text-sm">
                    Are you sure want delete this contact?
                  </span>
                  <div className="flex gap-2 ml-4">
                    <button
                      className="bg-white text-red-600 px-3 py-1 rounded text-sm font-semibold"
                      onClick={() => handleDelete(i)}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-white text-gray-600 px-3 py-1 rounded text-sm font-semibold"
                      onClick={() => setConfirmIndex(null)}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
