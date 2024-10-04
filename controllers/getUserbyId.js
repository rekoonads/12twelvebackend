import { userModel } from "../models/User.js";


export default async (req, res) => {
  try {

    const userId  = req.query.userId;
    console.log(userId)
    const user = await userModel.findOne({userId});
    return res.status(500).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
