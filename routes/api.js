import { Router } from "express";
import getAffiliatelink from "../controllers/getAffiliatelink.js";
import addAffiliatelink from "../controllers/addAffiliatelink.js";

const router = Router();

router.get('/affiliate',getAffiliatelink)
router.post('/add-affiliate',addAffiliatelink)

export default router;