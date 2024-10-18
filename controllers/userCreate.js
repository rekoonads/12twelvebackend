import { userModel } from "../models/User.js";

export default async (req, res) => {
  try {
    const { id, first_name, last_name, email_addresses, userType } =
      req.body.data;

    // Validate userType
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

    console.log(new_user);
    let response_data = [];

    const user = await userModel.findOne({ userId: id });

    if (user) {
      console.log(`User with ID ${id} already exists.`);
      return res
        .status(409)
        .json({ error: `User with ID ${id} already exists.` });
    } else {
      const createdUser = await userModel.create(new_user);
      response_data.push({ user_data: createdUser });
    }

    console.log(response_data);
    return res.status(201).json(response_data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
