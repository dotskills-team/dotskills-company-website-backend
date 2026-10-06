import type { NextFunction, Request, RequestHandler, Response } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";

import { CONTACT_STATUSES, Contact, type ContactStatus } from "./contact.model";

const createSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address").max(150),
  phone: z.string().trim().max(30).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  projectTypes: z
    .array(z.string().trim().min(1).max(50))
    .min(1, "Choose at least one project type")
    .max(10),
  budget: z.string().trim().max(50).optional().default(""),
  hpField: z.string().optional(), // honeypot, real users never fill this
});

const statusSchema = z.object({ status: z.enum(CONTACT_STATUSES) });

const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next: NextFunction) => {
    fn(req, res).catch(next);
  };

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isStatus = (value: string): value is ContactStatus =>
  (CONTACT_STATUSES as readonly string[]).includes(value);

/** PUBLIC: POST /contacts */
export const createContact = wrap(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid data",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { hpField, ...input } = parsed.data;

  // Bot detected: fake success, nothing is saved
  if (hpField) {
    return res.status(201).json({ success: true, message: "Message received" });
  }

  const ipAddress = req.ip;
  const userAgent = req.get("user-agent")?.slice(0, 300);

  await Contact.create({
    ...input,
    ...(ipAddress ? { ipAddress } : {}),
    ...(userAgent ? { userAgent } : {}),
  });

  return res.status(201).json({ success: true, message: "Message received" });
});

/** ADMIN: GET /contacts?page=&limit=&search=&status= */
export const listContacts = wrap(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const status = typeof req.query.status === "string" ? req.query.status : "";

  const filter: Record<string, unknown> = {};

  if (isStatus(status)) filter.status = status;

  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }, { message: rx }];
  }

  const [items, total, grouped] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Contact.countDocuments(filter),
    Contact.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const counts: Record<"all" | ContactStatus, number> = {
    all: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  };

  for (const row of grouped) {
    if (isStatus(row._id)) {
      counts[row._id] = row.count;
      counts.all += row.count;
    }
  }

  return res.json({
    success: true,
    message: "Contacts fetched",
    data: items,
    counts,
    meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  });
});

/** ADMIN: PATCH /contacts/:id/status */
export const updateContactStatus = wrap(async (req, res) => {
  const id = String(req.params.id);
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }

  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const contact = await Contact.findByIdAndUpdate(
    id,
    { status: parsed.data.status },
    { new: true },
  );
  if (!contact) {
    return res.status(404).json({ success: false, message: "Message not found" });
  }

  return res.json({ success: true, message: "Status updated", data: contact });
});

/** ADMIN: DELETE /contacts/:id */
export const deleteContact = wrap(async (req, res) => {
  const id = String(req.params.id);
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid id" });
  }

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    return res.status(404).json({ success: false, message: "Message not found" });
  }

  return res.json({ success: true, message: "Message deleted" });
});