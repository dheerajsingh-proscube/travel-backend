import admin from "../../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const adminExist = await admin.findOne({ email });

    if (!adminExist) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isPasswordMatched = await bcrypt.compare(
      password,
      adminExist.password,
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    //token generation
    const token = jwt.sign(
      {
        id: adminExist._id,
        role: adminExist.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    // Login successful
    return res.status(200).json({
      success: true,
      msg: "Login Successfully",
      data: {
        token: token,
        user: { name: 'admin', email: 'admin@gmial.com', role: 'admin' }
      }
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};
