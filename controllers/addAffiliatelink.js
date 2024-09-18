import Affiliate from "../models/Affiliate.js";
export default async (req, res) => {
  try {
    const { redirectLink ,generatedVal} = req.body;

    const newaffiliate = new Affiliate({
            redirectLink ,
            generatedVal
    });

    const savedAffiliate = await newaffiliate.save();
    console.log(savedAffiliate);
    if (savedAffiliate) {
      return res.status(201).json({ savedAffiliate });
    } else {
      return res.status(403).json({ message: `Unable to create affiliate link` });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
