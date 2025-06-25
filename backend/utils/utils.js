import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Check password
export async function checkPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate token
export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// Decode token
export function decodeToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Get token from header
export function getTokenFromHeader(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
}
