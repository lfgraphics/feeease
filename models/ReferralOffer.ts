import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReferralOffer extends Document {
  title: string;
  description: string;
  referralTarget: number;       // e.g., 20 (refer 20 schools)
  rewardMonths: number;         // e.g., 6 (6 months free recurring)
  validUntil: Date;             // e.g., 2027-04-30
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralOfferSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  referralTarget: { type: Number, required: true, min: 1 },
  rewardMonths: { type: Number, required: true, min: 1 },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete (mongoose.models as any).ReferralOffer;
}

const ReferralOffer: Model<IReferralOffer> = mongoose.models.ReferralOffer || mongoose.model<IReferralOffer>('ReferralOffer', ReferralOfferSchema);

export default ReferralOffer;
