import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpense extends Document {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
  schoolId?: mongoose.Types.ObjectId; // For income from schools
  paidTo?: mongoose.Types.ObjectId; // For expenses paid to staff
  paidToName?: string; // If external
  approvedBy: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod?: string;
  transactionId?: string;
  billingPeriod?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  type: { type: String, enum: ['income', 'expense'], required: true, default: 'expense' },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Commission', 'Server Cost', 'Salary', 'Other', 'Installation', 'Recurring'
  date: { type: Date, default: Date.now },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  paidTo: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  paidToName: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  paymentMethod: { type: String },
  transactionId: { type: String },
  billingPeriod: { type: String },
}, { timestamps: true });

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
