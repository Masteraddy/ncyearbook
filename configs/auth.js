const jwt = require("jsonwebtoken");
const Matric = require("../models/Matrics");
const jwtSecret = process.env.JWT_SECRET;

const authorization = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader.includes("Bearer")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    //Verify Auth Token
    const decoded = jwt.verify(token, jwtSecret);
    //Add Decoded Info to Request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.message.includes("expired")) {
      res.status(401).json({ success: false, message: "Your session has expired" });
      return;
    }
    res.status(401).json({ success: false, message: "You are not authorized" });
    return;
  }
};

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader.includes("Bearer")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    //Verify Auth Token
    const decoded = jwt.verify(token, jwtSecret);
    //Add Decoded Info to Request
    if (decoded.usertype !== "admin") {
      return res.status(401).json({ success: false, message: "You are not authorized" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.message.includes("expired")) {
      res.status(401).json({ success: false, message: "Your session has expired" });
      return;
    }
    res.status(401).json({ success: false, message: "You are not authorized" });
    return;
  }
};

const regAuthorization = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader.includes("Bearer")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }

    //Verify Auth Token
    const decoded = await jwt.verify(token, jwtSecret);
    //Add Decoded Info to Request
    let matric = await Matric.findOne({ _id: decoded.id });
    if (!matric) {
      return res.status(401).json({ success: false, message: "You are not authorized" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.message.includes("expired")) {
      res.status(401).json({ success: false, message: "Your session has expired" });
      return;
    }
    res.status(401).json({ success: false, message: "You are not authorized" });
    return;
  }
};

module.exports = { authorization, regAuthorization, adminAuth };
