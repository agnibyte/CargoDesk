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


