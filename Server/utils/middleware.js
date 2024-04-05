const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided. Authorization denied." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token is invalid or expired. Authorization denied." });
  }
};

const unknownEndpointHandler = (_req, res) => {
  res.status(404).send({ message: "Unknown endpoint." });
};

const errorHandler = (error, _req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ message: "Malformatted ID." });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ message: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).send({ message: "Invalid token." });
  } else {
    res.status(400).send({ message: error.message });
  }

  next(error);
};

module.exports = {
  auth,
  unknownEndpointHandler,
  errorHandler,
};
