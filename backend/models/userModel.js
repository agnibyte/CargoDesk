import { hashWithSHA256 } from "./utils"; // replace with your actual hash util

export function addNewUserModel(data) {
  return new Promise((resolve, reject) => {
    const checkQuery = `SELECT userId FROM users WHERE email = ? OR phone = ?`;
    const insertQuery = `INSERT INTO users SET ?`;

    executeQuery(checkQuery, [data.email, data.phone])
      .then((existing) => {
        if (existing.length > 0) {
          return resolve({ status: false, message: "Email or Phone already exists" });
        }

        const newUser = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          role: data.role || "user",
          password: hashWithSHA256(data.password),
        };

        return executeQuery(insertQuery, newUser);
      })
      .then((insertResult) => {
        if (insertResult.affectedRows > 0) {
          resolve({ status: true, message: "User added successfully" });
        } else {
          resolve({ status: false, message: "User creation failed" });
        }
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        reject({ status: false, message: "Error occurred while adding user" });
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
