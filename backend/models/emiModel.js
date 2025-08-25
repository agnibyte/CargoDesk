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
                    response.message = "EMI added successfully";

                    resolve(response);
                } else {
                    response.message = "Failed to add EMI.";
                    resolve(response);
                }
            })
            .catch((error) => {
                console.error("Error adding EMI:", error);
                if (error.code === "ER_DUP_ENTRY") {
                    response.message =
                        "EMI already exists. Please check in All EMIs section";
                    resolve(response);
                } else {
                    // Log but DO NOT reject – avoid unhandledRejection
                    response.message = "Database error while adding contact.";
                    reject(response);
                }
            });
    });
}