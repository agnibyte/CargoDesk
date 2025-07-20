import executeQuery from "@/helpers/dbConnection";

const response = {
  status: false,
  message: "",
};

export function getContactsModel(userId) {
  return new Promise((resolve, reject) => {
    const getQuery = `
      SELECT id, userId, name, contactNo, note, status, createdAt, updatedAt 
      FROM contacts 
      WHERE userId = ? AND status = 1
      ORDER BY name ASC
    `;

    executeQuery(getQuery, [userId])
      .then((result) => {
        if (result.length > 0) {
          const contacts = result.map((contact, index) => ({
            srNo: index + 1,
            id: contact.id,
            name: contact.name,
            contactNo: contact.contactNo,
            note: contact.note,
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt,
          }));
          response.status = true;
          response.data = contacts;
          response.message = "Contacts fetched successfully";
          resolve(response);
        } else {
          response.message = "No contacts found";
          resolve(response);
        }
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        reject({
          status: false,
          message: "Database error while getting contacts",
        });
      });
  });
}

export function addNewContactModel(data) {
  return new Promise((resolve) => {
    const insertQuery = `INSERT INTO contacts SET ?`;

    const contactObj = {
      userId: data.userId,
      name: data.name,
      contactNo: data.contactNo,
      note: data.note || "",
      status: 1,
    };

    executeQuery(insertQuery, contactObj)
      .then((result) => {
        if (result && result.affectedRows > 0) {
          response.status = true;
          response.message = "Contact added successfully";

          resolve(response);
        } else {
          response.message = "Failed to add contact.";
          resolve(response);
        }
      })
      .catch((error) => {
        console.error("Error adding contact:", error);
        if (error.code === "ER_DUP_ENTRY") {
          response.message =
            "Contact already exists. Please check in All Contacts section";
          resolve(response);
        } else {
          // Log but DO NOT reject – avoid unhandledRejection
          response.message = "Database error while adding contact.";
          reject(response);
        }
      });
  });
}

export function updateContactModel(contactId, data) {
  return new Promise((resolve, reject) => {
    const updateQuery = `
      UPDATE contacts 
      SET name = ?, contactNo = ?, note = ?, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    const values = [data.name, data.contactNo, data.note || null, contactId];

    executeQuery(updateQuery, values)
      .then((result) => {
        if (result.affectedRows > 0) {
          response.status = true;
          response.message = "Contact updated successfully";
          resolve(response);
        } else {
          resolve({
            status: false,
            message: "Contact not found or no changes made",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating contact:", error);
        response.message = "Database error while updating contact.";
        reject(response);
      });
  });
}
export function deleteContactModel(contactId) {
  return new Promise((resolve, reject) => {
    const deleteQuery = `
      UPDATE contacts 
      SET status = 0, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    executeQuery(deleteQuery, [contactId])
      .then((result) => {
        if (result.affectedRows > 0) {
          response.status = true;
          response.message = "Contact deleted successfully";
          resolve(response);
        } else {
          response.message = "Contact not found";
          resolve(response);
        }
      })
      .catch((error) => {
        console.error("Error deleting contact:", error);
        response.message = "Database error while deleting contact.";
        reject(response);
      });
  });
}
export function addBulkContactsModel(userId, contactList) {
  return new Promise(async (resolve, reject) => {
    if (!Array.isArray(contactList) || contactList.length === 0) {
      return resolve({ status: false, message: "Empty contact list" });
    }

    try {
      const insertQuery = `
        INSERT IGNORE INTO contacts (userId, name, contactNo, note, status)
        VALUES ?
      `;

      const values = contactList.map((c) => [
        userId,
        c.name,
        c.contactNo,
        c.note || null,
        1,
      ]);

      const BATCH_SIZE = 500;
      let insertedRows = 0;

      for (let i = 0; i < values.length; i += BATCH_SIZE) {
        const chunk = values.slice(i, i + BATCH_SIZE);
        const result = await executeQuery(insertQuery, [chunk]);
        insertedRows += result.affectedRows || 0;
      }

      resolve({
        status: true,
        message: `${insertedRows} new contacts added`,
        skipped: contactList.length - insertedRows,
      });
    } catch (error) {
      console.error("Bulk insert failed:", error);
      reject({
        status: false,
        message: "Database error while inserting contacts",
      });
    }
  });
}
