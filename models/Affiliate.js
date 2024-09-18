
import mongoose, { Schema } from 'mongoose';

// Define the payment schema
const affiliateSchema = new Schema(
  {
   redirectLink :{ type :String,required:true},
   generatedVal :{ type : String,required:true},
   impression :{ type :Number,default:0}
  },
  {
    timestamps: true,
  }
);

const Affiliate = mongoose.model('affiliate', affiliateSchema);

export default Affiliate;

