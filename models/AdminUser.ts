import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminUser extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  passwordHash: string;
  role: 'super_admin' | 'operations_admin' | 'support_admin';
  isActive: boolean;
  requiresPasswordChange: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'operations_admin', 'support_admin'], default: 'support_admin' },
  isActive: { type: Boolean, default: true },
  requiresPasswordChange: { type: Boolean, default: false },
  lastLogin: { type: Date },
}, { timestamps: true });

const AdminUser: Model<IAdminUser> = mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
