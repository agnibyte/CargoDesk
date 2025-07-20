import React, { useState } from "react";
import DocumentTable from "../common/tabels/documentTable";
import CommonModal from "../common/commonModal";
import modalStyle from "@/styles/modal.module.scss";
import commonStyle from "@/styles/common/common.module.scss";
import { getConstant } from "@/utilities/utils";
import { allContactsTableHeadCells } from "@/utilities/masterData";

export default function AllContactsSection({ contacts }) {
  const [selected, setSelected] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const onClickDelete = async (ids) => {
    const payload = {
      ids: ids,
    };
    setDeleteLoad(true);
    setDeleteError("");
    try {
      // Simulate API call to delete contacts
      console.log("Deleting contacts with IDs:", ids);
      setDeletePopup(false);
      setSelected([]);
    } catch (error) {
      console.error("Error occurred during deletion:", error);
      setDeleteError(
        "Error occurred while deleting contacts, Please try again later"
      );
    }
    setDeleteLoad(false);
  };

  const onClickEdit = (id) => {
    console.log("Edit clicked for id:", id);
  };

  return (
    <div>
      <DocumentTable
        rows={contacts}
        headCells={allContactsTableHeadCells}
        onClickEdit={onClickEdit}
        selected={selected}
        setSelected={setSelected}
        onClickDelete={() => {
          setDeletePopup(true);
        }}
        isFilterApplied={false}
      />

      <CommonModal
        modalTitle={"Delete Document"}
        modalOpen={deletePopup}
        setModalOpen={setDeletePopup}
        modalSize={"w-11/12 md:w-3/8"}
      >
        <div className={modalStyle.deleteModal}>
          <p className={modalStyle.conformationMsg}>
            Are you sure you want to delete this Contact?
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
    </div>
  );
}
