import {
  addBulkContactsModel,
  addNewContactModel,
  createGroupWithContactsModel,
  deleteBulkContactGroupsModel,
  deleteBulkContactsModel,
  deleteContactModel,
  getContactsByGroupIdModel,
  getContactsModel,
  getGroupsByUserModel,
  updateContactModel,
  updateGroupInfoModel,
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
        console.log("error", error);
        reject(error);
      });
  });
}

export function getContactListController(userId) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

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

export function importContactsInBulkController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };
    const contacts = request.contacts;
    const userId = request.id;

    addBulkContactsModel(userId, contacts)
      .then((result) => {
        if (result.status) {
          response.status = true;
          response.message = result.message;
          response.skipped = result.skipped;
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

export function deleteBulkContactsController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };
    const contacts = request.contacts;

    deleteBulkContactsModel(contacts)
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
export function deleteBulkContactGroupsController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };
    const ids = request.groupIds;

    deleteBulkContactGroupsModel(ids)
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
export function addNewGroupOfContactsController(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

    createGroupWithContactsModel(request)
      .then((result) => {
        if (result.status) {
          response.status = true;
          response.message = result.message;
          response.id = result.groupId;
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

export function getUserCntactGroups(userId) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

    getGroupsByUserModel(userId)
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

export function getGroupMembersList(groupId) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

    getContactsByGroupIdModel(groupId)
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

export function updateGroupDetails(request) {
  return new Promise((resolve, reject) => {
    const response = {
      status: false,
    };

    updateGroupInfoModel(request)
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
