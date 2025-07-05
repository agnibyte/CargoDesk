import executeQuery from "@/helpers/dbConnection";

const response = {
  status: false,
  message: "",
};

export function addNewUserModel(data) {
  return new Promise((resolve, reject) => {
    const checkQuery = `SELECT userId FROM users WHERE email = ? OR phone = ?`;
    const insertQuery = `INSERT INTO users SET ?`;

    executeQuery(checkQuery, [data.email, data.phone])
      .then((existing) => {
        if (existing.length > 0) {
          response.message = "Email or Phone already exists";
          return resolve(response);
        }

        const newUser = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: data.role || "user",
          password: data.password,
        };

        return executeQuery(insertQuery, newUser);
      })
      .then((insertResult) => {
        if (insertResult.affectedRows > 0) {
          response.status = true;
          response.message = "User added successfully";
          resolve(response);
        } else {
          response.message = "Failed to add user";
          resolve(response);
        }
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        reject(response);
      });
  });
}

export function verifyUserModel(email, password) {
  return new Promise((resolve, reject) => {
    const hashedPassword = hashWithSHA256(password);
    const query = `SELECT userId, firstName, lastName, email, phone, role FROM users WHERE email = ? AND password = ?`;

    executeQuery(query, [email, hashedPassword])
      .then((result) => {
        if (result.length > 0) {
          resolve({
            status: true,
            user: result[0],
          });
        } else {
          resolve({
            status: false,
            message: "Invalid email or password",
          });
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        reject({ status: false, message: "Database error during login" });
      });
  });
}
