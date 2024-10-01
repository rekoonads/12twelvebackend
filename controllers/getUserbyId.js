import { userModel } from "../models/User";


export default async (req, res) => {
  try {
    const {userId } = req.body;
    const user = await userModel.findOne({userId});
    return res.status(500).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
