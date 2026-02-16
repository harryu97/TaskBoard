
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const { JWT_SECRET } = process.env


export const generateTokenAndSetCookie = (userId, res) => {

  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  //Httponlycookie
  res.cookie("jwt", token, {

    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Prevents XSS (JavaScript can't read this)
    sameSite: "lax", // Prevents CSRF attacks
    //secure: process.env.NODE_ENV === "development", // Only sends over HTTPS in production
    secure: false,
  });
  return token;
};
export const verifyToken = async (req, res, next) => {
  try {
    //Checks cookies first 
    const token = req.cookies.jwt || req.get('token');
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    req.user = user;
    next();
  }
  catch (error) {
    console.log("Error in verifyToekn", error)
    res.status(500).json({ message: "Internal server error" });
  }
};
