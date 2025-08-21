import React, { useState, useEffect } from "react";
import moment from "moment";
import EmiForm from "../emi/emiForm";
export default function EmiSection() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">EMI and Truck Details</h1>
      <EmiForm />
    </>
  );
}
