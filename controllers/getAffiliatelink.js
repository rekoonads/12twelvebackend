import Affiliate from "../models/Affiliate.js";

export default async (req, res) => {
  try {
    const val = req.query.val;
    console.log("searched val : - ", val);

    const affiliate = await Affiliate.findOne({ generatedVal: val });

    if (!affiliate) return res.status(404).send("Affiliate link not found");

    const redirectUrl = new URL(affiliate.redirectLink);
    redirectUrl.searchParams.append("utm_source", "my12twelve");
    redirectUrl.searchParams.append("utm_medium", "affiliate");
    redirectUrl.searchParams.append("utm_campaign", val);
    redirectUrl.searchParams.append("referring_site","https://www.test.com")

    console.log("Full redirect URL:", redirectUrl.toString());

    // Instead of redirecting, let's send the URL back for verification
    res.json({ redirectUrl: redirectUrl.toString() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
