import React, { useEffect, useState } from "react";
import CommonModal from "./common/commonModal";
import DocumentsSection from "./layouts/documentsSection";
import EmiSection from "./layouts/emiSection";
import { postApiData } from "@/utilities/services/apiService";
import TabComponent from "./common/tabComponent";
import dashboardStyle from "@/styles/dashBoard.module.scss";
import AddDocumentForm from "./common/molecules/addDocumentForm";

const Dashboard = ({ pageData }) => {
  const [reminderModal, setReminderModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [reminderData, setReminderData] = useState("");
  const [documentTableData, setDocumentTableData] = useState([]);

  const dashboardTabs = [
    {
      id: "01",
      label: "Documents",
      value: "document",
      component: <></>,
    },
    { id: "02", label: "EMI", value: "emi", component: <></> },
  ];

  const [selectedTab, setSelectedTab] = useState("");

  const addReminderData = async (data) => {
    const payload = {
      vehicleNo: data.vehicleNo,
      documentType: data.documentType,
      expiryDate: data.expiryDate,
      note: data.note,
    };
    setAddLoading(true);
    try {
      const response = await postApiData("ADD_NEW_VEHICALE_DOCUMENTS", payload);
      if (response.status) {
        const LatestData = [...documentTableData, { id: response.id, ...data }];
        setDocumentTableData(LatestData);
        setReminderModal(false);
      }
    } catch (error) {
      console.error("Error occurred during form submission:", error);
    }
    setAddLoading(false);
  };

  const updateReminderData = async (updatedData) => {
    const payload = {
      id: updatedData.id,
      vehicleNo: updatedData.vehicleNo,
      documentType: updatedData.documentType,
      expiryDate: updatedData.expiryDate,
      note: updatedData.note,
    };
    setUpdateLoading(true);
    try {
      const response = await postApiData("UPDATE_VEHICALE_DOCUMENTS", payload);
      if (response.status) {
        setDocumentTableData((prevData) =>
          prevData.map((item) =>
            item.id === updatedData.id ? { ...item, ...updatedData } : item
          )
        );
      }
      setReminderModal(false);
      setIsEdit(false);
    } catch (error) {
      console.error("Error occurred during form submission:", error);
    }
    setUpdateLoading(false);
  };

  const onClickDashboardTab = (val) => {
    setSelectedTab(val);
  };

  const onClickAddReminder = () => {
    console.log("onclickkk");
    setIsEdit(false);
    setReminderModal(true);
  };

  const getAllVehicleDocuments = async () => {
    try {
      const response = await postApiData("GET_ALL_VEHICALE_DOCUMENTS");
      if (response.status && response.data.length > 0) {
        setDocumentTableData(response.data);
      } else {
        setDocumentTableData([]);
      }
    } catch (error) {
      console.error("Error occurred during form submission:", error);
    }
  };

  useEffect(() => {
    getAllVehicleDocuments();
  }, []);

  return (
    <div className={dashboardStyle.dashboardContainer}>
      <div className="m-5">
        <div className="flex flex-col shadow-lg rounded-lg">
          <div className="card-header flex justify-between items-center p-2">
            <h2 className="text-white my-1.5">Dashboard</h2>
            {/* <button
              onClick={onClickAddReminder}
              className="d-flex align-items-center addButton btn btn-primary"
            >
              <FontAwesomeIcon
                icon={faPlusCircle}
                className="me-2"
              />
              Add Reminder
            </button> */}
          </div>
          <div className={dashboardStyle["mainTabel"]}>
            <TabComponent
              tabsData={dashboardTabs}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>

          <div className="mb-3">
            {selectedTab == "document" ? (
              <DocumentsSection
                setReminderData={setReminderData}
                setReminderModal={setReminderModal}
                setIsEdit={setIsEdit}
                tableData={documentTableData}
                setTableData={setDocumentTableData}
                onClickAddDocument={onClickAddReminder}
              />
            ) : selectedTab == "emi" ? (
              <EmiSection />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Dashboard;
