import { deleteVehicleDocumentController } from "@/backend/controllers/vehicleDocumentController";

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    const deleteIds = req.body.ids;
    const response = {
      status: false,
    };

    deleteVehicleDocumentController(deleteIds)
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
