import Affiliate from "../models/Affiliate.js";

export default async (req, res) => {
  try {
    const val = req.query.val;
    console.log("searched val : - ", val);

    const affiliate = await Affiliate.findOneAndUpdate(
      { generatedVal: val },
      { $inc: { impression: 1 } },
      { new: true }
    );

    if (!affiliate) return res.status(404).send("Affiliate link not found");

    // Add UTM parameters for better tracking on Shopify
    const redirectUrl = `${affiliate.redirectLink}?utm_source=https://www.my12twelve.com/&utm_medium=referral&utm_campaign=affiliate&utm_referrer=https://www.my12twelve.com/`;

    console.log("Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
