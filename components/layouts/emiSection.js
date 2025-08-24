import React, { useState, useEffect } from "react";
import moment from "moment";
import EmiForm from "../emi/emiForm";
import CommonModal from "../common/commonModal";
export default function EmiSection() {
  const [emiModal, setEmiModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [emiList, setEmiList] = useState([]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">EMI and Truck Details</h1>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setEmiModal(true)}
      >
        Add New EMI
      </button>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white border">

          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Loan/Item Name</th>
              <th className="py-2 px-4 border-b">Loan Amount</th>
              <th className="py-2 px-4 border-b">EMI Amount</th>
              <th className="py-2 px-4 border-b">Tenure (Months)</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">Payment Mode</th>
              <th className="py-2 px-4 border-b">Due Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>

          <tbody>
            {emiList.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No EMI records found.
                </td>
              </tr>
            ) : (
              emiList.map((emi, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-2 px-4 border-b">{emi.loanName}</td>
                  <td className="py-2 px-4 border-b">{emi.loanAmount}</td>
                  <td className="py-2 px-4 border-b">{emi.emiAmount}</td>
                  <td className="py-2 px-4 border-b">{emi.tenure}</td>
                  <td className="py-2 px-4 border-b">
                    {emi.startDate ? moment(emi.startDate).format("DD-MM-YYYY") : ""}
                  </td>
                  <td className="py-2 px-4 border-b">{emi.paymentMode}</td>
                  <td className="py-2 px-4 border-b">
                    {emi.dueDate ? moment(emi.dueDate).format("DD-MM-YYYY") : ""}
                  </td>
                  <td className="py-2 px-4 border-b">{emi.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>


      <CommonModal
        modalTitle={isEdit ? "Edit EMI Data" : "Add New EMI Data"}
        modalOpen={emiModal}
        setModalOpen={setEmiModal}
        modalSize={"w-11/12 md:w-3/6"}
      >
        <EmiForm setEmiList={setEmiList} />
      </CommonModal>
    </>
  );
}
