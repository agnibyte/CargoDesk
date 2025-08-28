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
