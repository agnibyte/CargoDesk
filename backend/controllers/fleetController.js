import {
  addNewFleetModel,
  deleteFleetModel,
  getAllFleetsModel,
  getFleetByIdModel,
  updateFleetModel,
} from "../models/fleetModel";

export function getAllFleetsController(requestOrUser = {}, authUser = null) {
  return new Promise((resolve, reject) => {
    getAllFleetsModel(requestOrUser, authUser)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getFleetByIdController(id, authUser = null) {
  return new Promise((resolve, reject) => {
    getFleetByIdModel(id)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function addNewFleetController(request, authUser = null) {
  return new Promise((resolve, reject) => {
    addNewFleetModel(request, authUser)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateFleetController(request) {
  return new Promise((resolve, reject) => {
    const id = request.id;
    updateFleetModel(id, request)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteFleetController(ids) {
  return new Promise((resolve, reject) => {
    deleteFleetModel(ids)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
