import mongoose, { Schema, Document, Model } from 'mongoose';

export type SchoolQueryStatus =
  | 'initiated'
  | 'assigned'
  | 'pending'
  | 'resolved'
  | 'rejected';

interface ILogEntry {
  at: Date;
  by?: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  action: string;
  details?: string;
}

export interface ISchoolQuery extends Document {
  school: mongoose.Types.ObjectId;
  schoolName: string;
  query: string;
  adminName: string;
  adminMobile: string;
  referrerEmail?: string;
  contactPersonName?: string;
  contactPersonMobile?: string;
  status: SchoolQueryStatus;
  note?: string;
  assigned?: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
  logTrail: ILogEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const LogEntrySchema: Schema = new Schema(
  {
    at: { type: Date, default: Date.now },
    by: {
      _id: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
      name: { type: String },
      email: { type: String },
    },
    action: { type: String, required: true },
    details: { type: String },
  },
  { _id: false }
);

const SchoolQuerySchema: Schema = new Schema(
  {
    school: { type: Schema.Types.ObjectId, ref: 'School', required: true },
    schoolName: { type: String, required: true },
    query: { type: String, required: true },
    adminName: { type: String, required: true },
    adminMobile: { type: String, required: true },
    referrerEmail: { type: String },
    contactPersonName: { type: String },
    contactPersonMobile: { type: String },
    status: {
      type: String,
      enum: ['initiated', 'assigned', 'pending', 'resolved', 'rejected'],
      default: 'initiated',
    },
    note: { type: String },
    assigned: {
      _id: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
      name: { type: String },
      email: { type: String },
    },
    logTrail: { type: [LogEntrySchema], default: [] },
  },
  { timestamps: true }
);

const SchoolQuery: Model<ISchoolQuery> =
  mongoose.models.SchoolQuery || mongoose.model<ISchoolQuery>('SchoolQuery', SchoolQuerySchema);

export default SchoolQuery;