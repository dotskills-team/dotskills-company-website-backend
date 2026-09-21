import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

import type {
  ServiceBenefit,
  ServiceFeature,
  ServiceFaq,
  ServiceImage,
  ServiceProcess,
} from "./services.types.js";

export interface IService extends Document {
  slug: string;
  title: string;
  category: string;
  icon: string;
  shortDescription: string;
  description: string;

  image: ServiceImage;

  technologies: string[];

  features: ServiceFeature[];

  benefits: ServiceBenefit[];

  process: ServiceProcess[];

  useCases: string[];

  faqs: ServiceFaq[];

  isPublished: boolean;

  sortOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

const featureSchema = new Schema<ServiceFeature>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },

    icon: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false },
);

const benefitSchema = new Schema<ServiceBenefit>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },

    icon: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false },
);

const processSchema = new Schema<ServiceProcess>(
  {
    number: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },
  },
  { _id: false },
);

const faqSchema = new Schema<ServiceFaq>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 300,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },
  },
  { _id: false },
);

const imageSchema = new Schema<ServiceImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    alt: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 300,
    },
  },
  { _id: false },
);

const serviceSchema = new Schema<IService>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      minlength: 2,
      maxlength: 100,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
      minlength: 2,
      maxlength: 100,
    },

    icon: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },

    image: {
      type: imageSchema,
      required: true,
    },

    technologies: {
      type: [String],
      default: [],
    },

    features: {
      type: [featureSchema],
      default: [],
    },

    benefits: {
      type: [benefitSchema],
      default: [],
    },

    process: {
      type: [processSchema],
      default: [],
    },

    useCases: {
      type: [String],
      default: [],
    },

    faqs: {
      type: [faqSchema],
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

serviceSchema.index({
  isPublished: 1,
  sortOrder: 1,
});

export const Service: Model<IService> =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", serviceSchema);