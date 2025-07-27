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

    const values = [data.name, data.contactNo, data.note || "", contactId];

    executeQuery(updateQuery, values)
      .then((result) => {
        if (result.affectedRows > 0) {
          response.status = true;
          response.message = "Contact updated successfully";
          resolve(response);
        } else {
          response.message = "Contact not found for selected ID";
          resolve(response);
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

export function deleteBulkContactsModel(contactIds = []) {
  return new Promise(async (resolve, reject) => {
    const response = { status: false };

    try {
      if (!Array.isArray(contactIds) || contactIds.length === 0) {
        return resolve({ status: false, message: "No contact IDs provided" });
      }

      const placeholders = contactIds.map(() => "?").join(",");
      const query = `DELETE FROM contacts WHERE id IN (${placeholders})`;

      const result = await executeQuery(query, contactIds);

      if (result.affectedRows > 0) {
        response.message = `${result.affectedRows} contact(s) deleted successfully`;
        response.status = true;
        resolve(response);
      } else {
        response.message = "No matching contacts found to delete";
        resolve(response);
      }
    } catch (error) {
      console.error("Error in bulk delete:", error);
      response.message = "Database error during bulk delete";
      resolve(response);
    }
  });
}

export function addContactGroupModel(userId, groupName) {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO contact_groups (userId, groupName) VALUES (?, ?)`;

    executeQuery(insertQuery, [userId, groupName])
      .then((result) => {
        if (result.affectedRows > 0) {
          resolve({
            status: true,
            message: "Group created successfully",
            id: result.insertId,
          });
        } else {
          resolve({ status: false, message: "Failed to create group" });
        }
      })
      .catch((error) => {
        console.error("Error creating group:", error);
        reject({
          status: false,
          message: "Database error while creating group",
        });
      });
  });
}

export function editContactGroupModel(groupId, groupName) {
  return new Promise((resolve, reject) => {
    const updateQuery = `
      UPDATE contact_groups 
      SET groupName = ?, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    executeQuery(updateQuery, [groupName, groupId])
      .then((result) => {
        if (result.affectedRows > 0) {
          resolve({ status: true, message: "Group name updated successfully" });
        } else {
          resolve({ status: false, message: "Group not found or unchanged" });
        }
      })
      .catch((error) => {
        console.error("Error editing group:", error);
        reject({
          status: false,
          message: "Database error while editing group",
        });
      });
  });
}

export function addContactsToGroupModel(groupId, contactIds = []) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(contactIds) || contactIds.length === 0) {
      return resolve({ status: false, message: "No contacts provided" });
    }

    const insertQuery = `
      INSERT IGNORE INTO contact_group_members (groupId, contactId)
      VALUES ?
    `;

    const values = contactIds.map((cid) => [groupId, cid]);

    executeQuery(insertQuery, [values])
      .then((result) => {
        resolve({
          status: true,
          message: `${result.affectedRows} contact(s) added to group`,
        });
      })
      .catch((error) => {
        console.error("Error adding contacts to group:", error);
        reject({
          status: false,
          message: "Database error while adding contacts to group",
        });
      });
  });
}

export function getGroupsByUserModel(userId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id, groupName, createdAt FROM contact_groups WHERE userId = ?`;

    executeQuery(query, [userId])
      .then((result) => {
        resolve({
          status: true,
          data: result,
        });
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
        reject({
          status: false,
          message: "Database error while fetching groups",
        });
      });
  });
}

export function getContactsByGroupIdModel(groupId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT c.id AS contactId, c.name,  c.contactNo,  c.note,  c.status
                FROM 
                  contact_group_members gm
                INNER JOIN 
                  contacts c ON gm.contactId = c.id
                WHERE 
                  gm.groupId = ? AND c.status = 1;`;

    executeQuery(query, [groupId])
      .then((result) => {
        // console.log("result", result);
        resolve({
          status: true,
          data: result,
        });
      })
      .catch((error) => {
        console.error("Error fetching contacts in group:", error);
        reject({
          status: false,
          message: "Database error while fetching group contacts",
        });
      });
  });
}

export function createGroupWithContactsModel(request) {
  return new Promise((resolve, reject) => {
    const { userId, groupName, description, contactIds = [] } = request;
    const payload = { userId, groupName, description };
    const insertGroupQuery = `INSERT INTO contact_groups set ?`;

    executeQuery(insertGroupQuery, payload)
      .then((groupResult) => {
        if (!groupResult.insertId) {
          return resolve({
            status: false,
            message: "Failed to create group",
          });
        }

        const groupId = groupResult.insertId;

        // If no contacts to add, return early
        if (!Array.isArray(contactIds) || contactIds.length === 0) {
          return resolve({
            status: true,
            message: `Group '${groupName}' created with 0 contacts`,
            groupId,
          });
        }

        const insertContactsQuery = `
          INSERT IGNORE INTO contact_group_members (groupId, contactId)
          VALUES ?
        `;

        const values = contactIds.map((contactId) => [groupId, contactId]);

        executeQuery(insertContactsQuery, [values])
          .then((memberResult) => {
            resolve({
              status: true,
              message: `Group '${groupName}' created with ${memberResult.affectedRows} contact(s)`,
              groupId,
            });
          })
          .catch((error) => {
            console.error("Error inserting group members:", error);
            resolve({
              status: true,
              message: `Group '${groupName}' created, but failed to add contacts`,
              groupId,
            });
          });
      })
      .catch((error) => {
        console.error("Error creating group:", error);
        reject({
          status: false,
          message: "Database error while creating group",
          error: error.sqlMessage || error.message,
        });
      });
  });
}
