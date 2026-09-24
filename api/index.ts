import type { Request, Response } from "express";
import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

let databaseConnected = false;

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!databaseConnected) {
      await connectDatabase();
      databaseConnected = true;
    }

    app(req, res);
  } catch (error) {
    console.error("Vercel API error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}