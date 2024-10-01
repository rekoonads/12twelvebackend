import mongoose from "mongoose";

const affiliateSchema = new mongoose.Schema({
  generatedVal: String,
  redirectLink: String,
  impression: { type: Number, default: 0 },
  userId: String,
  redirects: [
    {
      uniqueId: String,
      timestamp: Date,
    },
  ],
}, 
{
  timestamps: true,
},);

const Affiliate = mongoose.model("Affiliate", affiliateSchema);

export default Affiliate;
