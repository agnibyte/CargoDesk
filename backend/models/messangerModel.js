import executeQuery from "@/helpers/dbConnection";

export function addNewMessageTemplateModel(data) {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO message_templates (userId, message) VALUES (?, ?)`;

    const values = [data.userId, data.message];

    executeQuery(insertQuery, values)
      .then((result) => {
        if (result.affectedRows > 0) {
          resolve({
            status: true,
            message: "Message template added successfully",
            templateId: result.insertId,
          });
        } else {
          resolve({
            status: false,
            message: "Failed to add template",
          });
        }
      })
      .catch((err) => {
        console.error("Error adding template:", err);
        reject({
          status: false,
          message: "Database error while adding template",
          error: err.sqlMessage || err.message,
        });
      });
  });
}

export function getUserMessageTemplatesModel(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, message, createdAt, updatedAt
      FROM message_templates
      WHERE userId = ? 
      ORDER BY updatedAt DESC
    `;

    executeQuery(query, [userId])
      .then((results) => {
        resolve({
          status: true,
          data: results,
        });
      })
      .catch((err) => {
        console.error("Error fetching templates:", err);
        reject({
          status: false,
          message: "Error while fetching message templates",
          error: err.sqlMessage || err.message,
        });
      });
  });
}

export function deleteMessageTemplateModel(userId, templateId) {
  return new Promise((resolve, reject) => {
    const deleteQuery = `
      DELETE FROM message_templates 
      WHERE id = ? AND userId = ? 
    `;

    executeQuery(deleteQuery, [templateId, userId])
      .then((result) => {
        if (result.affectedRows > 0) {
          resolve({
            status: true,
            message: "Message template deleted successfully",
          });
        } else {
          resolve({
            status: false,
            message: "Message template not found or already deleted",
          });
        }
      })
      .catch((err) => {
        console.error("Error deleting message template:", err);
        reject({
          status: false,
          message: "Database error while deleting template",
          error: err.sqlMessage || err.message,
        });
      });
  });
}
