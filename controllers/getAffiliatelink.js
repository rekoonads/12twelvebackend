import Affiliate from "../models/Affiliate.js";
export default async (req, res) => {
  try {
    const val = req.query.val;
    console.log("searched val : - ", val)
    const affiliate = await Affiliate.findOneAndUpdate(
      { generatedVal: val },
      { $inc: { impression: 1 } }, 
      { new: true } 
    );

    
    if (!affiliate) return res.status(404).send('Affilaite link not found');
    res.redirect(affiliate.redirectLink);
    // res.json(affiliate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
