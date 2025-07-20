import {
  addNewContactModel,
  deleteContactModel,
  getContactsModel,
  updateContactModel,
} from "../models/contactsModel";

export function addNewContactController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

    addNewContactModel(request)
      .then((result) => {
        if (result.status) {
          response.status = true;
          response.message = result.message;
          resolve(response);
        } else {
          response.message = result.message;
          resolve(response);
        }
      })
      .catch((error) => {
        console.log('error000000000000000000000================', error)
        reject(error);
      });
  });
}

export function getContactListController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };
    const userId = request.userId;

    getContactsModel(userId)
      .then((result) => {
        if (result.status) {
          response.status = true;
          response.message = result.message;
          response.data = result.data;
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

export function updateContactController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };
    const contactId = request.id;

    const data = request.data;

    updateContactModel(contactId, data)
      .then((result) => {
        if (result.status) {
          response.status = true;
          response.message = result.message;
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

export function deleteContactController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };
    const contactId = request.id;

    deleteContactModel(contactId)
      .then((result) => {
        if (result.status) {
          response.status = true;
          response.message = result.message;
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
