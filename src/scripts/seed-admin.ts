/**
 * Creates (or promotes) an admin user.
 *
 * Usage:  npm run seed:admin
 * Reads from .env:  ADMIN_NAME (optional), ADMIN_EMAIL, ADMIN_PASSWORD
 *
 * Safe to run multiple times:
 *  - email does not exist  -> creates a new admin
 *  - email already exists  -> promotes it to an active admin (password NOT changed)
 */
// import 'dotenv/config';

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { z } from 'zod';

import { User } from '../modules/auth/auth.model.js';

const SALT_ROUNDS = 12;

const configSchema = z.object({
  mongoUri: z.string().min(1, 'MONGODB_URI (or MONGO_URI) is required'),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email('ADMIN_EMAIL is invalid'),
  password: z
    .string()
    .min(8, 'ADMIN_PASSWORD must be at least 8 characters')
    .max(128),
});

const main = async (): Promise<void> => {
  const parsed = configSchema.safeParse({
    mongoUri: process.env['MONGODB_URI'] ?? process.env['MONGO_URI'],
    name: process.env['ADMIN_NAME'] ?? 'Admin',
    email: process.env['ADMIN_EMAIL'],
    password: process.env['ADMIN_PASSWORD'],
  });

  if (!parsed.success) {
    console.error('Invalid seed configuration:');
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  const { mongoUri, name, email, password } = parsed.data;

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');

  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role === 'admin' && existing.status === 'active') {
      console.log(`"${email}" is already an active admin. Nothing to do.`);
      return;
    }

    await User.updateOne(
      { _id: existing._id },
      { $set: { role: 'admin', status: 'active' } }
    );
    console.log(`Existing user "${email}" promoted to admin.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await User.create({
    name,
    email,
    passwordHash,
    role: 'admin',
    status: 'active',
  });

  console.log(`Admin created: ${email}`);
};

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });