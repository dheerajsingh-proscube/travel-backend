import jwt from "jsonwebtoken";

export const adminAuth = async (req, res, next) => {
  try {
    console.log("Middleware Started");

    const authHeader = req.headers.authorization;

    // check client has send the token
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // return only object and if not valid token return not valid token and jump to catch
    // that is why no need to if(!decoded)


    req.admin = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or Expired Token",
    });
  }
};
