import { Router } from "express";
import getAffiliatelink from "../controllers/getAffiliatelink.js";
import addAffiliatelink from "../controllers/addAffiliatelink.js";
import userCreate from "../controllers/userCreate.js";

const router = Router();

router.get('/affiliate',getAffiliatelink);
router.post('/add-affiliate',addAffiliatelink);
router.post("/webhook/user-created", userCreate);

export default router;