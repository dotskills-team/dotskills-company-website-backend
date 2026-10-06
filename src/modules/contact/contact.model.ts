import { Schema, model, type Document } from "mongoose";

export const CONTACT_STATUSES = ["new", "read", "replied", "archived"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  projectTypes: string[];
  budget: string;
  status: ContactStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    phone: { type: String, trim: true, default: "", maxlength: 30 },
    company: { type: String, trim: true, default: "", maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    projectTypes: { type: [String], default: [] },
    budget: { type: String, trim: true, default: "" },
    status: { type: String, enum: CONTACT_STATUSES, default: "new", index: true },
    ipAddress: { type: String },
    userAgent: { type: String, maxlength: 300 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.ipAddress;
        delete ret.userAgent;
        return ret;
      },
    },
  },
);

contactSchema.index({ createdAt: -1 });

export const Contact = model<IContact>("Contact", contactSchema);