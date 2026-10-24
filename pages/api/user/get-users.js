import { getAllUsersController } from "@/backend/controllers/userController";

export default function handler(req, res) {
  return new Promise((resolve) => {
    getAllUsersController()
      .then((result) => {
        res.status(200).json(result);
        resolve(result);
      })
      .catch((error) => {
        res.status(200).json({
          status: false,
          error: error?.message || "Failed to fetch users",
          data: [],
        });
        resolve();
      });
  });
}
