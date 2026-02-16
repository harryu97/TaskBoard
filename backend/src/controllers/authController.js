import User from "../models/User.js"
import { generateTokenAndSetCookie } from "../middleware/authMiddleware.js"

export const signup = async (req, res) => {

  try {
    const { fullName, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });
    const newUser = await User.create({ fullName, email, password });
    //set cookie 
    generateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({ _id: newUser._id, email: newUser.email, fullName: newUser.fullName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid user credentials" });
    }
    const isPasswordCorrect = await user?.comparePassword(password);

    if (!isPasswordCorrect) {

      return res.status(400).json({ message: "Inavlid Password credential" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({ _id: user._id, email: user.email });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  }
  catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

