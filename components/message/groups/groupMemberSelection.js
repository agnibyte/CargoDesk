import { useState, useEffect } from "react";

export default function GroupMemberSelection({
  contactsList = [],
  formData,
  setFormData,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contactsList);

  useEffect(() => {
    const filtered = contactsList.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactNo.includes(searchTerm)
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contactsList]);

  const handleMemberToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      contactIds: prev.contactIds.includes(id)
        ? prev.contactIds.filter((memberId) => memberId !== id)
        : [...prev.contactIds, id],
    }));
  };

  return (
    <>
      <div className="my-3 flex items-center justify-between flex-wrap gap-2">
        <label className="block mb-2 font-semibold text-gray-700">
          Select Members
        </label>
        <input
          type="text"
          placeholder="Search by name or number"
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="text-sm text-gray-600 mt-1 md:mt-0 text-end mb-3">
        <strong>{formData?.contactIds?.length}</strong> selected out of{" "}
        <strong>{contactsList.length}</strong> contacts
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => {
            const isSelected = formData?.contactIds?.includes(contact.id);
            return (
              <div
                key={contact.id}
                onClick={() => handleMemberToggle(contact.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMemberToggle(contact.id);
                  }
                }}
                className={`
    cursor-pointer p-4 rounded-md border transition shadow-sm 
    outline-none 
    focus:ring-2 focus:ring-blue-500 
    ${
      isSelected
        ? "bg-cyan-50 border-cyan-200 ring-2 ring-blue-300"
        : "bg-white hover:bg-gray-50 border-gray-300"
    }
  `}
              >
                <div className="flex flex-row justify-between">
                  <div className="font-medium text-sm text-gray-900">
                    {contact.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {contact.contactNo}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-sm text-gray-500">
            No contacts found.
          </div>
        )}
      </div>
    </>
  );
}
