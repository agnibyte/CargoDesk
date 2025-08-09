import React, { useState } from "react";
import DocumentTable from "../common/tabels/documentTable";
import CommonModal from "../common/commonModal";
import modalStyle from "@/styles/modal.module.scss";
import commonStyle from "@/styles/common/common.module.scss";
import { getConstant } from "@/utilities/utils";
import { allContactsTableHeadCells } from "@/utilities/masterData";
import ManualAddForm from "../message/import/manualAddForm";
import { postApiData } from "@/utilities/services/apiService";
import { showToast } from "@/utilities/toastService";

export default function AllContactsTab({
  pageData,
  contactsList,
  setContactsList,
  searchTerm = "",
  setSelectedTab,
}) {
  const [selected, setSelected] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [contactModal, setContactModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalData, setModalData] = useState({});

  const onClickDelete = async (ids) => {
    const payload = {
      contacts: selected,
    };
    setDeleteLoad(true);
    // setDeleteError("");
    try {
      // Simulate API call to delete contacts
      const response = await postApiData("DELETE_BULK_CONTACTS", payload);
      if (response.status) {
        setContactsList((prev) =>
          prev.filter((item) => !selected.includes(item.id))
        );
        setDeletePopup(false);
        setSelected([]);
      }
    } catch (error) {
      console.error("Error occurred during deletion:", error);
      // setDeleteError(
      //   "Error occurred while deleting contacts, Please try again later"
      // );
      showToast({
        message:
          "Error occurred while deleting contacts, Please try again later",
        type: "error",
      });
    }
    setDeleteLoad(false);
  };

  const onClickEdit = (id) => {
    console.log("Edit clicked for id:", id);

    const selectedItem = contactsList.find((item) => item.id == id);
    setModalData({
      id: selectedItem.id,
      name: selectedItem.name,
      phone: selectedItem.contactNo,
      note: selectedItem.note,
    });
    setContactModal(true);
    setIsEdit(true);
  };

  return (
    <div>
      {contactsList.length > 0 ? (
        <DocumentTable
          rows={contactsList}
          headCells={allContactsTableHeadCells}
          onClickEdit={onClickEdit}
          selected={selected}
          setSelected={setSelected}
          onClickDelete={() => setDeletePopup(true)}
          isFilterApplied={false}
          searchTerm={searchTerm}
        />
      ) : (
        <div className="flex items-center justify-center h-[200px] bg-white text-gray-500 rounded-b-xl shadow-md">
          <div className="flex items-center flex-col">
            <h1>No Contacts Found</h1>
            <button
              className={commonStyle.commonButton + " mt-3"}
              onClick={() => setSelectedTab("import")}
            >
              Import Contacts
            </button>
          </div>
        </div>
      )}

      <CommonModal
        modalTitle={"Delete Document"}
        modalOpen={deletePopup}
        setModalOpen={setDeletePopup}
        modalSize={"w-11/12 md:w-3/8"}
      >
        <div className={modalStyle.deleteModal}>
          <p className={modalStyle.conformationMsg}>
            Are you sure you want to delete selected contacts?
          </p>
          <div className={modalStyle.buttonsWrapper}>
            <button
              className={`${modalStyle.btn} ${modalStyle.cancel}`}
              onClick={() => setDeletePopup(false)}
            >
              No
            </button>
            <button
              className={`${modalStyle.btn} ${modalStyle.delete}`}
              onClick={() => onClickDelete(selected)}
            >
              {deleteLoad ? getConstant("LOADING_TEXT") : "Yes"}
            </button>
          </div>
          {deleteError && (
            <span className={commonStyle["errorMsg"]}>{deleteError}</span>
          )}
        </div>
      </CommonModal>
      <CommonModal
        modalTitle={isEdit ? "Edit Contact" : "Add New Contact"}
        modalOpen={contactModal}
        setModalOpen={setContactModal}
        modalSize={"w-11/12 md:w-3/6"}
      >
        <ManualAddForm
          isEdit={isEdit}
          modalData={modalData}
          pageData={pageData}
          setContactModal={setContactModal}
          setContactsList={setContactsList}
        />
      </CommonModal>
    </div>
  );
}
