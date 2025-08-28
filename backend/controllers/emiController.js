import { addNewEmiModel, getAllEmisModel } from "../models/emiModel";

export function addNewEmiController(request) {
    return new Promise((resolve, reject) => {
        const response = {
            status: false,
        };

        addNewEmiModel(request)
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

export function getAllEmiDataList(request) {
    return new Promise((resolve, reject) => {
        const response = {
            status: false,
        };

        getAllEmisModel(request)
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

// uodate emi entry
export function updateEmiController(id, data) {
    return new Promise((resolve, reject) => {
        const response = {
            status: false,
        };
        updateEmiModel(id, data)
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
                {
                    console.error("Error updating EMI entry:", error);
                    reject(error);
                }
            });
    });
}

// delete emi entry
export function deleteEmiController(id) {
    return new Promise((resolve, reject) => {
        const response = {
            status: false,
        };
        deleteEmiModel(id)
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
                {
                    console.error("Error deleting EMI entry:", error);
                    reject(error);
                }
            });
    });
}