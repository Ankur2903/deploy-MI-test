import jwt from "jsonwebtoken";

const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers["authorization"];

  if (!auth) {
    return res.status(403).json({
      message: "Unauthorized, JWT token is required",
    });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Unauthorized, JWT token is wrong or expired",
    });
  }
};

export default ensureAuthenticated;
