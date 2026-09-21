import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers and hyphens",
  );

const imageSchema = z.object({
  url: z.string().trim().url().max(2000),
  alt: z.string().trim().min(2).max(300),
});

const featureSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(2).max(1000),
  icon: z.string().trim().min(1).max(100),
});

const benefitSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(2).max(1000),
  icon: z.string().trim().min(1).max(100),
});

const processSchema = z.object({
  number: z.string().trim().min(1).max(20),
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(2).max(1000),
});

const faqSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(2000),
});

const baseServiceSchema = z.object({
  slug: slugSchema,

  title: z.string().trim().min(2).max(150),

  category: z.string().trim().min(2).max(100),

  icon: z.string().trim().min(1).max(100),

  shortDescription: z
    .string()
    .trim()
    .min(10)
    .max(500),

  description: z
    .string()
    .trim()
    .min(20)
    .max(5000),

  image: imageSchema,

  technologies: z
    .array(z.string().trim().min(1).max(100))
    .max(50)
    .default([]),

  features: z
    .array(featureSchema)
    .max(50)
    .default([]),

  benefits: z
    .array(benefitSchema)
    .max(50)
    .default([]),

  process: z
    .array(processSchema)
    .max(30)
    .default([]),

  useCases: z
    .array(z.string().trim().min(1).max(200))
    .max(50)
    .default([]),

  faqs: z
    .array(faqSchema)
    .max(50)
    .default([]),

  isPublished: z.boolean().default(false),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .max(100000)
    .default(0),
});

export const createServiceSchema =
  baseServiceSchema;

export const updateServiceSchema =
  baseServiceSchema.partial();

export const serviceListQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(12),

  category: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional(),
});

export type CreateServiceInput = z.infer<
  typeof createServiceSchema
>;

export type UpdateServiceInput = z.infer<
  typeof updateServiceSchema
>;

export type ServiceListQuery = z.infer<
  typeof serviceListQuerySchema
>;