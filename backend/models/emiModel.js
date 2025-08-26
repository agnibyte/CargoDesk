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
        console.log('payload', payload)

        executeQuery(insertQuery, payload)
            .then((result) => {
                console.log('result', result)
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