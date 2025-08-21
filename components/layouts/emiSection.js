import React, { useState, useEffect } from "react";
import moment from "moment";
import EmiForm from "../emi/emiForm";
import CommonModal from "../common/commonModal";
export default function EmiSection() {
  const [emiModal, setEmiModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">EMI and Truck Details</h1>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New EMI
      </button>


      <CommonModal
        modalTitle={isEdit ? "Edit EMI Data" : "Add New EMI Data"}
        modalOpen={emiModal}
        setModalOpen={setEmiModal}
        modalSize={"w-11/12 md:w-3/6"}
      >
        <EmiForm />
      </CommonModal>
    </>
  );
}
