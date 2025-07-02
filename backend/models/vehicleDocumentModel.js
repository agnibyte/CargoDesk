import executeQuery from "@/helpers/dbConnection";
import { getConstant } from "@/utilities/utils";
import moment from "moment";

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
      .then((insertResult) => {
        if (insertResult.affectedRows > 0) {
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
  return new Promise((resolve, reject) => {
    if (!Array.isArray(ids) || ids.length == 0) {
      return reject(new Error("Invalid or empty array of IDs"));
    }

    const placeholders = ids.map(() => "?").join(","); // Create placeholders for the query
    const deleteQuery = `DELETE FROM vehicle_documents WHERE id IN (${placeholders})`;

    executeQuery(deleteQuery, ids)
      .then((deleteResult) => {
        if (deleteResult.affectedRows > 0) {
          resolve({
            success: true,
            message: `${deleteResult.affectedRows} vehicle document(s) deleted successfully`,
          });
        } else {
          reject(new Error("No records found with the given IDs"));
        }
      })
      .catch((error) => {
        console.error("Error deleting vehicle documents:", error);
        reject(error);
      });
  });
}

export function editVehicleDocumentById(id, updatedFields) {
  return new Promise((resolve, reject) => {
    const updateQuery = `UPDATE vehicle_documents SET ? WHERE id = ?`;

    executeQuery(updateQuery, [updatedFields, id])
      .then((updateResult) => {
        if (updateResult.affectedRows > 0) {
          resolve({
            success: true,
            message: "Vehicle document updated successfully",
          });
        } else {
          reject(
            new Error("No record found with the given ID or no changes made")
          );
        }
      })
      .catch((error) => {
        console.error("Error updating vehicle document:", error);
        reject(error);
      });
  });
}
