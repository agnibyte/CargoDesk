import executeQuery from "@/helpers/dbConnection";

export function addNewMessageTemplateModel(data) {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO message_templates (userId, message) VALUES (?, ?)
    `;

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
