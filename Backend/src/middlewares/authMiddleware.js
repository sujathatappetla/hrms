import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload: { userId, orgId, iat, exp }
    req.user = { userId: payload.userId };
    req.organisation_id = payload.orgId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
