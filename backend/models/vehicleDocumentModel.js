import executeQuery from "@/helpers/dbConnection";
import { getConstant } from "@/utilities/utils";
import moment from "moment";
import { logFleetActivity } from "./fleetActivityModel";

export function addNewVehicleDocument(request) {
  return new Promise((resolve, reject) => {
    // Calculate alertDate (30 days before expiryDate)
    let alertDate = null;
    let isInAlertDate = 0; // Default: Not in alert period

    if (request.expiryDate) {
      alertDate = moment(request.expiryDate)
        .subtract(getConstant("DAYS_BEFORE_ALERT"), "days")
        .format("YYYY-MM-DD");

      // Check if today is on or after alertDate
      if (moment().isSameOrAfter(alertDate, "day")) {
        isInAlertDate = 1; // Set as true
      }
    }

    const tempObj = {
      vehicleNo: request.vehicleNo,
      documentType: request.documentType,
      expiryDate: request.expiryDate || null,
      alertDate,
      isInAlertDate,
      note: request.note || null,
    };

    const insertQuery = `INSERT INTO vehicle_documents SET ?`;

    executeQuery(insertQuery, [tempObj])
      .then(async (insertResult) => {
        if (insertResult.affectedRows > 0) {
          const docId = insertResult.insertId;
          // Log Fleet Activity for document upload
          await logFleetActivity({
            fleetId: request.fleetId || null,
            vehicleNo: request.vehicleNo,
            operationType: "DOCUMENT",
            entityType: (request.documentType || "DOCUMENT").toUpperCase(),
            entityId: String(docId),
            action: "UPLOAD",
            title: `${request.documentType || "Document"} uploaded`,
            description: request.expiryDate
              ? `Document expiry: ${moment(request.expiryDate).format("DD MMM YYYY")}`
              : `${request.documentType || "Document"} uploaded for vehicle ${request.vehicleNo}`,
            oldValue: null,
            newValue: tempObj,
            changedFields: Object.keys(tempObj),
            performedByName: request.performedByName || "Admin User",
            source: "documents",
            metadata: { vehicleNo: request.vehicleNo, documentType: request.documentType, expiryDate: request.expiryDate },
          });

          resolve({
            success: true,
            id: insertResult.insertId,
            message: "Vehicle document added successfully",
          });
        } else {
          reject(new Error("Insertion failed"));
        }
      })
      .catch((error) => {
        console.error("Error inserting vehicle document:", error);
        reject(error);
      });
  });
}

export function getAllVehicleDocuments() {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT * FROM vehicle_documents`;

    executeQuery(selectQuery)
      .then((result) => {
        resolve({
          success: true,
          data: result,
        });
      })
      .catch((error) => {
        console.error("Error fetching vehicle documents:", error);
        reject(error);
      });
  });
}

export function deleteVehicleDocumentByIds(ids) {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(ids) || ids.length == 0) {
      return reject(new Error("Invalid or empty array of IDs"));
    }

    try {
      // Fetch documents before deletion for permanent audit logging
      const placeholders = ids.map(() => "?").join(",");
      const existingDocs = await executeQuery(`SELECT * FROM vehicle_documents WHERE id IN (${placeholders})`, ids);

      const deleteQuery = `DELETE FROM vehicle_documents WHERE id IN (${placeholders})`;
      const deleteResult = await executeQuery(deleteQuery, ids);

      if (deleteResult.affectedRows > 0) {
        if (Array.isArray(existingDocs)) {
          for (const doc of existingDocs) {
            await logFleetActivity({
              fleetId: doc.fleetId || null,
              vehicleNo: doc.vehicleNo,
              operationType: "DOCUMENT",
              entityType: (doc.documentType || "DOCUMENT").toUpperCase(),
              entityId: String(doc.id),
              action: "DELETE",
              title: `${doc.documentType || "Document"} deleted`,
              description: `${doc.documentType || "Document"} removed for vehicle ${doc.vehicleNo}`,
              oldValue: doc,
              newValue: null,
              changedFields: ["deleted"],
              performedByName: "Admin User",
              source: "documents",
            });
          }
        }

        resolve({
          success: true,
          message: `${deleteResult.affectedRows} vehicle document(s) deleted successfully`,
        });
      } else {
        reject(new Error("No records found with the given IDs"));
      }
    } catch (error) {
      console.error("Error deleting vehicle documents:", error);
      reject(error);
    }
  });
}

export function editVehicleDocumentById(id, updatedFields) {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch old document record before update for audit diff
      const oldRows = await executeQuery(`SELECT * FROM vehicle_documents WHERE id = ?`, [id]);
      const oldDoc = Array.isArray(oldRows) && oldRows.length > 0 ? oldRows[0] : null;

      const updateQuery = `UPDATE vehicle_documents SET ? WHERE id = ?`;
      const updateResult = await executeQuery(updateQuery, [updatedFields, id]);

      if (updateResult.affectedRows > 0) {
        if (oldDoc) {
          const isExpiryChanged = updatedFields.expiryDate && oldDoc.expiryDate !== updatedFields.expiryDate;
          let description = `${updatedFields.documentType || oldDoc.documentType || "Document"} updated`;

          if (isExpiryChanged) {
            const oldExpFormatted = oldDoc.expiryDate ? moment(oldDoc.expiryDate).format("DD MMM YYYY") : "N/A";
            const newExpFormatted = moment(updatedFields.expiryDate).format("DD MMM YYYY");
            description = `Expiry date changed from ${oldExpFormatted} → ${newExpFormatted}`;
          }

          await logFleetActivity({
            fleetId: updatedFields.fleetId || oldDoc.fleetId || null,
            vehicleNo: updatedFields.vehicleNo || oldDoc.vehicleNo,
            operationType: "DOCUMENT",
            entityType: (updatedFields.documentType || oldDoc.documentType || "DOCUMENT").toUpperCase(),
            entityId: String(id),
            action: isExpiryChanged ? "RENEW" : "UPDATE",
            title: `${updatedFields.documentType || oldDoc.documentType || "Document"} updated`,
            description,
            oldValue: oldDoc,
            newValue: { ...oldDoc, ...updatedFields },
            performedByName: updatedFields.performedByName || "Admin User",
            source: "documents",
            metadata: { vehicleNo: updatedFields.vehicleNo || oldDoc.vehicleNo },
          });
        }

        resolve({
          success: true,
          message: "Vehicle document updated successfully",
        });
      } else {
        reject(
          new Error("No record found with the given ID or no changes made")
        );
      }
    } catch (error) {
      console.error("Error updating vehicle document:", error);
      reject(error);
    }
  });
}
