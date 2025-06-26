import User from "../models/User.js";
import { decodeToken, getTokenFromHeader } from "../utils/utils.js";

export async function authMiddleware(req, res, next) {
  try {
    // Get the token from the request header
    const token = getTokenFromHeader(req);

    // Check if the token is present
    if (!token) return res.status(401).json({ message: "Token missing" });

    // Decode the token to get the user ID
    const { id } = decodeToken(token);

    // Check if the user ID is present
    if (!id) return res.status(401).json({ message: "Invalid token" });

    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) return res.status(404).json({ message: "User not found" });

    // Attach the user object to the request object
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}
