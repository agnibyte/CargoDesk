import { updateContactController } from "@/backend/controllers/contactController";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method not allowed",
    });
  }

  const request = req.body;

  try {
    const result = await updateContactController(request);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in update contact API:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to update contact",
      error: error.message || error,
    });
  }
}
