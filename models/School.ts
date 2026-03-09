import mongoose, { Schema, Document, Model } from 'mongoose';

// Add a method or pre-save hook if needed, but for now just interface
export interface ISchool extends Document {
  name: string;
  logo: string;
  shortName?: string;
  address: string;
  adminName: string;
  adminEmail?: string;
  adminMobile: string;
  adminPasswordHash: string; // Store hashed password for admin login
  adminPasswordEncrypted?: string; // Encrypted for retrieval during activation
  
  features: {
    whatsapp: boolean;
    teachersLogin: boolean;
    parentsLogin: boolean;
    attendance: boolean;
    payroll: boolean;
  };
  
  subscription: {
    plan: string;
    status: 'active' | 'expired' | 'trial' | 'suspended';
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
    mongoDbUri?: string; // Encrypted
    cloudinaryConfig?: string; // Encrypted JSON string
    gmailAccount?: string; // Encrypted JSON string {email, password}
    nextAuth?: string; // Encrypted JSON string { secret, url }
    encryptionKey?: string; // Encrypted string
    aiSensy?: string; // Encrypted JSON string { apiKey }
    triggerDev?: string; // Encrypted JSON string { apiKey, projectId }
    licenseCookieSecret?: string; // Encrypted string
    publicAppUrl?: string; // Plain text (publicly available anyway)
    whatsappTemplates?: string; // Encrypted JSON string { receipt, reminderHindi, reminderEnglish, reminderUrdu }
    notes?: string;
  };
  
  activationStatus: 'not_activated' | 'license_entered' | 'app_initialized' | 'active';
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema: Schema = new Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  shortName: { type: String },
  address: { type: String, required: true },
  adminName: { type: String, required: true },
  adminEmail: { type: String },
  adminMobile: { type: String, required: true },
  adminPasswordHash: { type: String, required: true },
  adminPasswordEncrypted: { type: String }, // Encrypted for retrieval during activation

  features: {
    whatsapp: { type: Boolean, default: false },
    teachersLogin: { type: Boolean, default: false },
    parentsLogin: { type: Boolean, default: false },
    attendance: { type: Boolean, default: false },
    payroll: { type: Boolean, default: false },
  },
  
  subscription: {
    plan: { type: String, default: 'Basic' },
    status: { type: String, enum: ['active', 'expired', 'trial', 'suspended'], default: 'trial' },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date }, // Default could be set in logic
    paymentMethod: { type: String },
  },

  license: {
    licenseKey: { type: String, unique: true }, // Immutable public key
    token: { type: String }, // The signed JWT
    issuedAt: { type: Date },
    expiresAt: { type: Date },
    status: { type: String, enum: ['active', 'expired', 'suspended', 'revoked'], default: 'active' },
  },

  deployment: {
    status: { type: String, enum: ['pending', 'deployed', 'failed'], default: 'pending' },
    githubRepo: { type: String },
    vercelProject: { type: String },
    mongoDbUri: { type: String }, // Should be stored encrypted
    cloudinaryConfig: { type: String }, // Should be stored encrypted
    gmailAccount: { type: String }, // Should be stored encrypted
    nextAuth: { type: String }, // Encrypted JSON string { secret, url }
    encryptionKey: { type: String }, // Encrypted string
    aiSensy: { type: String }, // Encrypted JSON string { apiKey }
    triggerDev: { type: String }, // Encrypted JSON string { apiKey, projectId }
    licenseCookieSecret: { type: String }, // Encrypted string
    publicAppUrl: { type: String }, // Plain text
    whatsappTemplates: { type: String }, // Should be stored encrypted
    notes: { type: String },
  },

  activationStatus: { type: String, enum: ['not_activated', 'license_entered', 'app_initialized', 'active'], default: 'not_activated' },
}, { timestamps: true });

// Prevent overwrite if model already exists (important for hot reload in Next.js)
const School: Model<ISchool> = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);

export default School;
