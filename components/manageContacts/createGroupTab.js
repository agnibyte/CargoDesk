import React, { useState } from "react";
import ContactsPreviewList from "../message/import/contactsPreviewList";
import GroupForm from "../message/groups/groupForm";

export default function CreateGroupTab({
  pageData,
  setGroupsList,
  contactsList,
}) {
  const [apiSuccess, setApiSuccess] = useState(false);

  return (
    <>
      <div className="mx-auto bg-white shadow-xl min-h-[60vh]">
        {/* <h2 className="text-2xl font-medium mb-6 text-gray-800">
          Import Contacts
        </h2> */}
        <GroupForm
          pageData={pageData}
          setGroupsList={setGroupsList}
          contactsList={contactsList}
        />

        {/* Imported Contacts Preview */}

        {/* <ContactsPreviewList
          contacts={contacts}
          setContacts={setContacts}
          pageData={pageData}
          apiSuccess={apiSuccess}
          setApiSuccess={setApiSuccess}
          setGroupsList={setGroupsList}
        /> */}
      </div>
    </>
  );
}
