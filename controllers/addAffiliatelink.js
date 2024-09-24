import Affiliate from "../models/Affiliate.js";

export default async (req, res) => {
  try {
    const { redirectLink, generatedVal } = req.body;

    if (!redirectLink || !generatedVal) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const url = new URL(redirectLink);
    url.searchParams.set("utm_source", "my12twelve");
    url.searchParams.set("utm_medium", "affiliate");
    url.searchParams.set("utm_campaign", generatedVal);

    const newAffiliate = new Affiliate({
      redirectLink: url.toString(),
      generatedVal,
    });

    const savedAffiliate = await newAffiliate.save();

    if (savedAffiliate) {
      return res.status(201).json({ savedAffiliate });
    } else {
      return res
        .status(500)
        .json({ message: "Unable to create affiliate link" });
    }
  } catch (error) {
    console.error("Error in addAffiliatelink:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
