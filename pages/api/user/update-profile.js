// import { updateUserDetailsById } from "@/backend/controllers/usersController";

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    const request = req.body;
    const response = {
      status: false,
    };

    resolve();
    // updateUserDetailsById(request)
    //   .then((result) => {
    //     res.status(200).json(result);
    //   })
    //   .catch((error) => {
    //     response.error = error;
    //     res.status(200).json(response);
    //     console.error("Error in update user details:", error);
    //     resolve();
    //   });
  });
}
