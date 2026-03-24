import mongoose, { Schema, Document, Model } from 'mongoose';

import { SCHOOL_FEATURES, SchoolFeatureId } from "@/lib/features";

export interface ISchool extends Document {
  name: string;
  logo: string;
  shortName?: string;
  address: string;
  adminName: string;
  adminEmail?: string;
  adminMobile: string;
  adminPasswordHash: string;
  adminPasswordEncrypted?: string;

  features: Record<SchoolFeatureId, boolean>;

  subscription: {
    plan: string;
    status: 'active' | 'expired' | 'trial' | 'suspended' | 'revoked';
    startDate: Date;
    expiryDate: Date;
    paymentMethod?: string;
  };

  license: {
    licenseKey: string;
    token?: string;
    issuedAt?: Date;
    expiresAt?: Date;
    status: 'active' | 'expired' | 'suspended' | 'revoked';
  };

  deployment: {
    status: 'pending' | 'deployed' | 'failed';
    githubRepo?: string;
    vercelProject?: string;
    mongoDbUri?: string;
    cloudinaryConfig?: string;
    gmailAccount?: string;
    nextAuth?: string;
    encryptionKey?: string;

    licenseCookieSecret?: string;
    publicAppUrl?: string;
    notes?: string;
  };

  referral: {
    code?: string;
    referredBy?: mongoose.Types.ObjectId;
    referredByType?: 'marketing' | 'school';
    referredSchools?: Array<{
      schoolId: mongoose.Types.ObjectId;
      schoolName: string;
      onboardedAt: Date;
    }>;
    offerRewardMonthsRemaining?: number;
    offerGrantedAt?: Date;
  };

  financials: {
    installationCost: number;
    recurringCosts: Array<{
      amount: number;
      effectiveDate: Date;
    }>;
    planType: 'monthly' | 'quarterly' | 'yearly';
  };

  whatsappUsage?: {
    sentThisMonth: number;
    softLimit: number;
    monthYear: string;
  };

  activationStatus: 'not_activated' | 'license_entered' | 'app_initialized' | 'active';
  createdAt: Date;
  updatedAt: Date;
}

// Generate features schema dynamically
const featuresSchemaDefinition = SCHOOL_FEATURES.reduce((acc, feature) => {
  acc[feature.id] = { type: Boolean, default: false };
  return acc;
}, {} as Record<string, { type: BooleanConstructor, default: boolean }>);

const SchoolSchema: Schema = new Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  shortName: { type: String },
  address: { type: String, required: true },
  adminName: { type: String, required: true },
  adminEmail: { type: String },
  adminMobile: { type: String, required: true },
  adminPasswordHash: { type: String, required: true },
  adminPasswordEncrypted: { type: String },

  features: featuresSchemaDefinition,

  subscription: {
    plan: { type: String, default: 'Basic' },
    status: { type: String, enum: ['active', 'expired', 'trial', 'suspended', 'revoked'], default: 'trial' },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    paymentMethod: { type: String },
  },

  license: {
    licenseKey: { type: String, unique: true },
    token: { type: String },
    issuedAt: { type: Date },
    expiresAt: { type: Date },
    status: { type: String, enum: ['active', 'expired', 'suspended', 'revoked'], default: 'active' },
  },

  deployment: {
    status: { type: String, enum: ['pending', 'deployed', 'failed'], default: 'pending' },
    githubRepo: { type: String },
    vercelProject: { type: String },
    mongoDbUri: { type: String },
    cloudinaryConfig: { type: String },
    gmailAccount: { type: String },
    nextAuth: { type: String },
    encryptionKey: { type: String },

    licenseCookieSecret: { type: String },
    publicAppUrl: { type: String },
    notes: { type: String },
  },

  referral: {
    code: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId },
    referredByType: { type: String, enum: ['marketing', 'school'] },
    referredSchools: [{
      schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
      schoolName: { type: String },
      onboardedAt: { type: Date, default: Date.now }
    }],
    offerRewardMonthsRemaining: { type: Number, default: 0 },
    offerGrantedAt: { type: Date },
  },

  financials: {
    installationCost: { type: Number, default: 0 },
    recurringCosts: [{
      amount: { type: Number },
      effectiveDate: { type: Date, default: Date.now }
    }],
    planType: { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' },
  },

  whatsappUsage: {
    sentThisMonth: { type: Number, default: 0 },
    softLimit: { type: Number, default: 5000 },
    monthYear: { type: String },
  },

  activationStatus: { type: String, enum: ['not_activated', 'license_entered', 'app_initialized', 'active'], default: 'not_activated' },
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete (mongoose.models as any).School;
}

const School: Model<ISchool> = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);

export default School;
