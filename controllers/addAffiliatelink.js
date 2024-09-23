import Affiliate from "../models/Affiliate.js";

export default async (req, res) => {
  try {
    const { redirectLink, generatedVal } = req.body;

    // Create URL object from redirectLink
    const url = new URL(redirectLink);

    // Add UTM parameters
    url.searchParams.append("utm_source", "my12twelve");
    url.searchParams.append("utm_medium", "affiliate");
    url.searchParams.append("utm_campaign", generatedVal);

    const newaffiliate = new Affiliate({
      redirectLink: url.toString(),
      generatedVal,
    });

    const savedAffiliate = await newaffiliate.save();
    console.log(savedAffiliate);

    if (savedAffiliate) {
      return res.status(201).json({ savedAffiliate });
    } else {
      return res
        .status(403)
        .json({ message: `Unable to create affiliate link` });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
