import React, { useState } from "react";

export default function DocumetsWrapper({ pageData }) {
  const [reminderModal, setReminderModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [reminderData, setReminderData] = useState("");
  const [documentTableData, setDocumentTableData] = useState([]);

  const onClickAddReminder = () => {
    setIsEdit(false);
    setReminderModal(true);
  };
  console.log("pageData jjjj", pageData);
  return (
    <>
      <DocumentsSection
        setReminderData={setReminderData}
        setReminderModal={setReminderModal}
        setIsEdit={setIsEdit}
        tableData={documentTableData}
        setTableData={setDocumentTableData}
        onClickAddDocument={onClickAddReminder}
      />

      <CommonModal
        modalTitle={isEdit ? "Edit Document" : "Add New Document"}
        modalOpen={reminderModal}
        setModalOpen={setReminderModal}
        modalSize={"w-11/12 md:w-3/6"}
      >
        <AddDocumentForm
          setReminderModal={setReminderModal}
          addReminderData={addReminderData}
          reminderData={reminderData}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          isLoading={isEdit ? updateLoading : addLoading}
          updateReminderData={updateReminderData}
        />
      </CommonModal>
    </>
  );
}
