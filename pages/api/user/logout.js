import Cookies from "cookies";

export default async function handler(req, res) {
  const cookies = new Cookies(req, res, {
    secure: process.env.NODE_ENV === "production",
  });

  // Log cookies before deleting

  // Delete the auth_token cookie
  cookies.set("auth_token", "", {
    httpOnly: true, // Prevent client-side access to the cookie
    secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration (30 days)
    path: "/", // Accessible site-wide
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow lax during development
  });

  res.status(200).json({ status: true, message: "Logged out successfully" });
}
