import bcrypt from "bcrypt";
import { User } from "./auth.model.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "../../utils/jwt.js";

const SALT_ROUNDS = 12;

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await User.findOne({
      email: input.email,
    }).lean();

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      SALT_ROUNDS,
    );

    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "user",
      status: "active",
    });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  async login(input: LoginInput) {
    const user = await User.findOne({
      email: input.email,
    }).select("+passwordHash");

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    if (user.status !== "active") {
      throw new Error("ACCOUNT_INACTIVE");
    }

    const passwordMatched = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatched) {
      throw new Error("INVALID_CREDENTIALS");
    }

    user.lastLoginAt = new Date();

    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async refresh(refreshToken: string) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    const user = await User.findById(payload.userId).lean();

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (user.status !== "active") {
      throw new Error("ACCOUNT_INACTIVE");
    }

    const accessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const newRefreshToken = signRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getMe(userId: string) {
    const user = await User.findById(userId).lean();

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (user.status !== "active") {
      throw new Error("ACCOUNT_INACTIVE");
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();