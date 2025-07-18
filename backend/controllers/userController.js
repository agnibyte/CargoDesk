import {
  addNewUserModel,
  getUserDetailsByIdModel,
  verifyUserModel,
} from "../models/userModel";

const response = {
  status: false,
};

export function addNeUserController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

    addNewUserModel(request)
      .then((result) => {
        if (result.status) {
          response.status = true;
          response.message = "User added successfully";
          resolve(response);
        } else {
          response.message = result.message || "cannot add user";
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function verifyUserController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };
    const user_id = request.user_id;
    const password = request.password; //test
    console.log("user_id, password", request);
    verifyUserModel(user_id, password)
      .then((result) => {
        if (result.status) {
          response.status = true;
          response.user = result.user;
          response.userId = result.userId;
          response.message = "User login successfully";
          resolve(response);
        } else {
          response.message = result.message;
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getUserDetailsById(id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      response.message = "id is required";
      return resolve(response);
    }
    getUserDetailsByIdModel(id)
      .then((result) => {
        if (result) {
          response.status = true;
          response.data = result;
          resolve(response);
        } else {
          response.message = "deatails not found";
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
