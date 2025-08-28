import executeQuery from "@/helpers/dbConnection";

const response = {
    status: false,
    message: "Something went wrong",
};

export function addNewEmiModel(data) {

    return new Promise((resolve) => {
        const insertQuery = `INSERT INTO emi_master SET ?`;
        const { loan_name, loan_amount, emi_amount, tenure_months, start_date, payment_mode, due_date } = data;

        const payload = {
            loan_name,
            loan_amount,
            emi_amount,
            tenure_months,
            start_date,
            payment_mode,
            due_date,
            status: 1,
        };

        executeQuery(insertQuery, payload)
            .then((result) => {
                if (result && result.affectedRows > 0) {
                    response.status = true;
                    response.message = "EMI deatails added successfully";

                    resolve(response);
                } else {
                    response.message = "Failed to add EMI deatails.";
                    resolve(response);
                }
            })
            .catch((error) => {
                console.error("Error adding EMI:", error);
                if (error.code === "ER_DUP_ENTRY") {
                    response.message =
                        "EMI deatails already exists. Please check in All EMIs section";
                    resolve(response);
                } else {
                    // Log but DO NOT reject – avoid unhandledRejection
                    response.message = "Database error while adding contact.";
                    reject(response);
                }
            });
    });
}


export function getAllEmisModel() {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT * FROM emi_master ORDER BY created_at DESC`;

    executeQuery(selectQuery)
      .then((rows) => {
        resolve({ status: true, data: rows, message: "EMIs fetched successfully" });
      })
      .catch((error) => {
        console.error("Error fetching EMIs:", error);
        reject({ status: false, message: "Database error while fetching EMIs" });
      });
  });
}



// ✅ Update EMI entry
export function updateEmiModel(id, data) {
  return new Promise((resolve, reject) => {
    const updateQuery = `
      UPDATE emi_master SET
        loan_name = ?,
        loan_amount = ?,
        emi_amount = ?,
        tenure_months = ?,
        start_date = ?,
        payment_mode = ?,
        due_date = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    const values = [
      data.loan_name,
      data.loan_amount,
      data.emi_amount,
      data.tenure_months,
      data.start_date,
      data.payment_mode,
      data.due_date,
      data.status,
      id,
    ];

    executeQuery(updateQuery, values)
      .then((result) => {
        if (result.affectedRows > 0) {
          resolve({ status: true, message: "EMI entry updated successfully" });
        } else {
          resolve({ status: false, message: "EMI not found or unchanged" });
        }
      })
      .catch((error) => {
        console.error("Error updating EMI:", error);
        reject({ status: false, message: "Database error while updating EMI" });
      });
  });
}

// ✅ Delete EMI entry
export function deleteEmiModel(id) {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE FROM emi_master WHERE id = ?`;

    executeQuery(deleteQuery, [id])
      .then((result) => {
        if (result.affectedRows > 0) {
          resolve({ status: true, message: "EMI entry deleted successfully" });
        } else {
          resolve({ status: false, message: "EMI not found" });
        }
      })
      .catch((error) => {
        console.error("Error deleting EMI:", error);
        reject({ status: false, message: "Database error while deleting EMI" });
      });
  });
}

