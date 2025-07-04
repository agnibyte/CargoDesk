import { chnageUserPassword } from "@/backend/controllers/usersController";

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    const request = req.body;
    const response = {
      status: false,
    };

    chnageUserPassword(request)
      .then((result) => {
        res.status(200).json(result);
        resolve();
      })
      .catch((error) => {
        response.error = error;
        res.status(200).json(response);
        console.error("Error in update user password:", error);
        resolve();
      });
  });
}
