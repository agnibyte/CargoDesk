import React, { useEffect, useState } from "react";
import moment from "moment";
import { checkExpiryCounts, getConstant } from "@/utilities/utils";
import { DOCUMENTS_TYPE_LIST } from "@/utilities/dummyData";
import DocumentTable from "../common/tabels/documentTable";
import { docTableHeadCells } from "@/utilities/masterData";
import { FaEdit, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import docSecStyle from "@/styles/docSec.module.scss";
import CommonModal from "../common/commonModal";
import modalStyle from "@/styles/modal.module.scss";
import { postApiData } from "@/utilities/services/apiService";
import commonStyle from "@/styles/common/common.module.scss";
import DocumentsFilterCard from "../common/items/documentsFilterCard";

export default function DocumentsSection({
  setReminderData,
  setReminderModal,
  setIsEdit,
  tableData,
  setTableData,
  onClickAddDocument = () => {},
  rowsPerPageOptions = [],
}) {
  const [documentsTypeList, setDocumentsTypeList] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [selected, setSelected] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const onClickEdit = (id) => {
    const selectedItem = tableData.find((item) => item.id == id);
    setReminderData(selectedItem);
    setReminderModal(true);
    setIsEdit(true);
  };
  var dateString = moment.unix("1757008114").format("MM/DD/YYYY");
  // console.log('dateString', dateString)

  const onClickDelete = async (ids) => {
    const payload = {
      ids: ids,
    };
    setDeleteLoad(true);
    setDeleteError("");
    try {
      const response = await postApiData("DELETE_VEHICALE_DOCUMENTS", payload);
      if (response.status) {
        setTableData((prev) => prev.filter((item) => !ids.includes(item.id)));
        setDeletePopup(false);
        setSelected([]);
      }
    } catch (error) {
      console.error("Error occurred during form submission:", error);
      setDeleteError(
        "Error occurred while deleting record, Please try again later"
      );
    }
    setDeleteLoad(false);
  };

  useEffect(() => {
    setDocumentsTypeList(checkExpiryCounts(tableData));
  }, [tableData]);

  const onFilterClick = (value) => {
    setAppliedFilter(
      (prevFilters) =>
        prevFilters.includes(value)
          ? prevFilters.filter((filtervalue) => filtervalue !== value) // Remove if already selected
          : [...prevFilters, value] // Add if not already selected
    );
  };

  const handleRemoveFilter = (value) => {
    setAppliedFilter((prevFilters) =>
      prevFilters.filter((filtervalue) => filtervalue !== value)
    );
  };

  useEffect(() => {
    if (appliedFilter.length > 0) {
      const filteredDataTemp = tableData.filter((item) =>
        appliedFilter.includes(item.documentType)
      );
      setFilteredData(filteredDataTemp);
    } else {
      setFilteredData([]);
    }
  }, [appliedFilter]);

  return (
    <div>
      <div className="flex flex-wrap w-full flex-row">
        {documentsTypeList.map((item) => (
          <DocumentsFilterCard
            key={item.id}
            item={item}
            isSelected={appliedFilter.includes(item.value)}
            onFilterClick={onFilterClick}
          />
        ))}
      </div>

      {/* Display selected filters */}
      <div className={`${docSecStyle.appliedFiltersContainer} mt-4 ml-5`}>
        {appliedFilter.length > 0 ? (
          <div className={docSecStyle.filterChips}>
            <h5>Records:</h5>
            {documentsTypeList
              .filter((item) => appliedFilter.includes(item.value))
              .map((filteredItem) => (
                <div
                  key={filteredItem.id}
                  className={docSecStyle.filterChip}
                  onClick={() => handleRemoveFilter(filteredItem.value)}
                >
                  {filteredItem.label}
                  <span className={docSecStyle.closeIcon}>×</span>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h5>All Records</h5>
            <button
              onClick={onClickAddDocument}
              className={"flex items-center " + docSecStyle.addButton}
            >
              <FaPlusCircle className="mr-3 text-[12px] md:text-[16px]" />
              Add Document
            </button>
          </div>
        )}
      </div>

      <DocumentTable
        rows={appliedFilter.length > 0 ? filteredData : tableData}
        headCells={docTableHeadCells}
        onClickEdit={onClickEdit}
        selected={selected}
        setSelected={setSelected}
        onClickDelete={() => {
          setDeletePopup(true);
        }}
        isFilterApplied={appliedFilter.length > 0}
        rowsPerPageOptions={rowsPerPageOptions}
        // renderActions={(id) => (
        //   <div className="d-flex justify-content-center">
        //     <button check
        //       className="btn btn-warning btn-sm mx-1"
        //       onClick={() => onClickEdit(id)}
        //       title="Edit"
        //     >
        //       <FaEdit />
        //     </button>
        //     <button
        //       className="btn btn-danger btn-sm mx-1"
        //       onClick={() => onClickDelete(id)}
        //       title="Delete"
        //     >
        //       <FaTrashAlt />
        //     </button>
        //   </div>
        // )}
      />

      <CommonModal
        modalTitle={"Delete Document"}
        modalOpen={deletePopup}
        setModalOpen={setDeletePopup}
        modalSize={"w-11/12 md:w-3/8"}
      >
        <div className={modalStyle.deleteModal}>
          <p className={modalStyle.conformationMsg}>
            Are you sure you want to delete this document?
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
