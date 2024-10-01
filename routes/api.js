import { Router } from "express";
import getAffiliatelink from "../controllers/getAffiliatelink.js";
import addAffiliatelink from "../controllers/addAffiliatelink.js";
import userCreate from "../controllers/userCreate.js";
import { userModel } from "../models/User.js";

const router = Router();

router.get('/affiliate',getAffiliatelink);
router.post('/add-affiliate',addAffiliatelink);
router.post("/webhook/user-created", userCreate);
router.get("/get-all-user",async (req,res)=>{
    
    const users = await userModel.find({});
    return res.json(users);
});

export default router;