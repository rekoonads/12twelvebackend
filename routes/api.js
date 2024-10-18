import { Router } from "express";
import getAffiliatelink from "../controllers/getAffiliatelink.js";
import addAffiliatelink from "../controllers/addAffiliatelink.js";
import userCreate from "../controllers/userCreate.js";
import { userModel } from "../models/User.js";
import getUserbyId from "../controllers/getUserbyId.js";

const router = Router();

router.get("/affiliate", getAffiliatelink);
router.post("/add-affiliate", addAffiliatelink);
router.post("/webhook/user-created", userCreate);
router.get("/get-all-user", async (req, res) => {
  const users = await userModel.find({});
  return res.json(users);
});
router.get("/get-user", getUserbyId);

router.post("/create-user", async (req, res) => {
  try {
    const { id, userType, first_name, last_name, email_addresses } =
      req.body.data;

    if (!userType || (userType !== "influencer" && userType !== "brand")) {
      return res
        .status(400)
        .json({
          error:
            "Invalid or missing user type. Must be 'influencer' or 'brand'.",
        });
    }

    const new_user = new userModel({
      userId: id,
      firstName: first_name,
      lastName: last_name,
      userType: userType,
      email: email_addresses[0].email_address,
      phoneNo: "",
    });

    const user = await userModel.findOne({ userId: id });

    if (user) {
      return res
        .status(409)
        .json({ error: `User with ID ${id} already exists.` });
    } else {
      const createdUser = await userModel.create(new_user);
      return res.status(201).json({ user_data: createdUser });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
