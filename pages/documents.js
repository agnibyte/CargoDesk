// pages/documents.js
import { getAllVehicleDocumentsController } from "@/backend/controllers/vehicleDocumentController";
import DocumetsWrapper from "@/components/documents/documetsWrapper";
import React from "react";

export default function Documents({ pageData }) {
  return <DocumetsWrapper pageData={pageData} />;
}

export async function getServerSideProps() {
  const pageData = {};

  const [documents] = await Promise.all([getAllVehicleDocumentsController()]);

  if (documents.status) {
    pageData.documents = documents.data;
  }

  return {
    props: {
      pageData,
    },
  };
}
