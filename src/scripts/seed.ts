import "dotenv/config";
import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import { seedServices } from "../modules/services/services.seed.js";
import { User } from "../modules/auth/auth.model.js";

const runSeed = async (): Promise<void> => {
    try {
        await connectDatabase();
        const admin = await User.findOneAndUpdate(
            { email: "test@dotskills.com" },
            { $set: { role: "admin", status: "active" } },
            { new: true },
        );

        if (!admin) {
            throw new Error("test@dotskills.com user not found");
        }

        console.log(`Admin role assigned to ${admin.email}`);
        await seedServices();

        console.log("Database seeding completed successfully");
    } catch (error) {
        console.error("Database seeding failed", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    }
};

runSeed();