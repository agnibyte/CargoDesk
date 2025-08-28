
import { updateEmiModel } from "@/backend/models/emiModel";

export default function handler(req, res) {
    return new Promise((resolve, reject) => {
        const request = req.body;
        const response = {
            status: false,
        };

        const { id } = request;
        updateEmiModel(id, request)
            .then((result) => {
                res.status(200).json(result);
                resolve(result);
            })
            .catch((error) => {
                response.error = error;
                res.status(200).json(response);
                resolve();
            });
    });
}
