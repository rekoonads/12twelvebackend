import Affiliate from "../models/Affiliate.js";

export default async (req, res) => {
  try {
    const { val } = req.query;

    if (!val) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: val" });
    }

    const affiliate = await Affiliate.findOne({ generatedVal: val });

    if (!affiliate) {
      return res.status(404).json({ message: "Affiliate link not found" });
    }

    const redirectUrl = new URL(affiliate.redirectLink);
    redirectUrl.searchParams.set("utm_source", "my12twelve");
    redirectUrl.searchParams.set("utm_medium", "affiliate");
    redirectUrl.searchParams.set("utm_campaign", val);
    redirectUrl.searchParams.set("referring_site", "https://www.test.com");

    console.log("Full redirect URL:", redirectUrl.toString());

    // Redirect the user instead of sending JSON
    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error in getAffiliatelink:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
