import React, { useState } from "react";
import DocumentTable from "../common/tabels/documentTable";
import CommonModal from "../common/commonModal";
import modalStyle from "@/styles/modal.module.scss";
import commonStyle from "@/styles/common/common.module.scss";
import { getConstant } from "@/utilities/utils";
import {
  allContactsGroupsTableHeadCells,
  allContactsTableHeadCells,
} from "@/utilities/masterData";
import ManualAddForm from "../message/import/manualAddForm";
import { postApiData } from "@/utilities/services/apiService";
import GroupForm from "../message/groups/groupForm";

export default function AllGroupsSection({
  pageData,
  contactsList,
  setContactsList,
  searchTerm = "",
  groupsList,
  setGroupsList,
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
    setDeleteError("");
    try {
      // Simulate API call to delete contacts
      const response = await postApiData("DELETE_BULK_CONTACTS", payload);
      if (response.status) {
        setGroupsList((prev) =>
          prev.filter((item) => !selected.includes(item.id))
        );
        setDeletePopup(false);
        setSelected([]);
      }
    } catch (error) {
      console.error("Error occurred during deletion:", error);
      setDeleteError(
        "Error occurred while deleting contacts, Please try again later"
      );
    }
    setDeleteLoad(false);
  };

  const onClickEdit = async (id) => {
    console.log("Edit clicked for id:", id);
    const response = await postApiData("GET_GROUP_MEMBERS", { groupId: id });
    console.log("response", response);

    const selectedItem = groupsList.find((item) => item.id == id);
    setModalData({
      id: selectedItem.id,
      groupName: selectedItem.groupName,
      description: selectedItem.description,
      contactIds: selectedItem.contactIds,
    });
    setContactModal(true);
    setIsEdit(true);
  };

  return (
    <div>
      <DocumentTable
        rows={groupsList}
        headCells={allContactsGroupsTableHeadCells}
        onClickEdit={onClickEdit}
        selected={selected}
        setSelected={setSelected}
        onClickDelete={() => setDeletePopup(true)}
        isFilterApplied={false}
        searchTerm={searchTerm}
      />

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
        <GroupForm
          isEdit={isEdit}
          modalData={modalData}
          pageData={pageData}
          setContactModal={setContactModal}
          setGroupsList={setGroupsList}
        />
      </CommonModal>
    </div>
  );
}
