import mongoose from "mongoose";

const affiliateSchema = new mongoose.Schema({
  generatedVal: String,
  redirectLink: String,
  impression: { type: Number, default: 0 },
  redirects: [
    {
      uniqueId: String,
      timestamp: Date,
    },
  ],
});

const Affiliate = mongoose.model("Affiliate", affiliateSchema);

export default Affiliate;
