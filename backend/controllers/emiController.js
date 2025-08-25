
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
