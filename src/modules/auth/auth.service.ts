// import bcrypt from "bcrypt";
// import { User } from "./auth.model.js";
// import type { LoginInput, RegisterInput } from "./auth.validation.js";
// import {
//   verifyRefreshToken,
//   signAccessToken,
//   signRefreshToken,
// } from "../../utils/jwt.js";

// const SALT_ROUNDS = 12;

// export class AuthService {
//   async register(input: RegisterInput) {
//     const existingUser = await User.findOne({
//       email: input.email,
//     }).lean();

//     if (existingUser) {
//       throw new Error("EMAIL_ALREADY_EXISTS");
//     }

//     const passwordHash = await bcrypt.hash(
//       input.password,
//       SALT_ROUNDS,
//     );

//     const user = await User.create({
//       name: input.name,
//       email: input.email,
//       passwordHash,
//       role: "user",
//       status: "active",
//     });

//     return {
//       id: user._id.toString(),
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       status: user.status,
//       createdAt: user.createdAt,
//     };
//   }

//   async login(input: LoginInput) {
//     const user = await User.findOne({
//       email: input.email,
//     }).select("+passwordHash");

//     if (!user) {
//       throw new Error("INVALID_CREDENTIALS");
//     }

//     if (user.status !== "active") {
//       throw new Error("ACCOUNT_INACTIVE");
//     }

//     const passwordMatched = await bcrypt.compare(
//       input.password,
//       user.passwordHash,
//     );

//     if (!passwordMatched) {
//       throw new Error("INVALID_CREDENTIALS");
//     }

//     user.lastLoginAt = new Date();

//     await user.save();

//     return {
//       id: user._id.toString(),
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       status: user.status,
//       lastLoginAt: user.lastLoginAt,
//     };
//   }

//   async refresh(refreshToken: string) {
//     let payload;

//     try {
//       payload = verifyRefreshToken(refreshToken);
//     } catch {
//       throw new Error("INVALID_REFRESH_TOKEN");
//     }

//     const user = await User.findById(payload.userId).lean();

//     if (!user) {
//       throw new Error("USER_NOT_FOUND");
//     }

//     if (user.status !== "active") {
//       throw new Error("ACCOUNT_INACTIVE");
//     }

//     const accessToken = signAccessToken({
//       userId: user._id.toString(),
//       role: user.role,
//     });

//     const newRefreshToken = signRefreshToken({
//       userId: user._id.toString(),
//       role: user.role,
//     });

//     return {
//       accessToken,
//       refreshToken: newRefreshToken,
//     };
//   }

//   async getMe(userId: string) {
//     const user = await User.findById(userId).lean();

//     if (!user) {
//       throw new Error("USER_NOT_FOUND");
//     }

//     if (user.status !== "active") {
//       throw new Error("ACCOUNT_INACTIVE");
//     }

//     return {
//       id: user._id.toString(),
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       status: user.status,
//       lastLoginAt: user.lastLoginAt,
//       createdAt: user.createdAt,
//     };
//   }
// }

// export const authService = new AuthService();
import bcrypt from 'bcrypt';

import { ApiError } from '../../utils/ApiError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt.js';

import { User } from './auth.model.js';
import type { UserRole, UserStatus } from './auth.model.js';
import type { LoginInput, RegisterInput } from './auth.validation.js';

const SALT_ROUNDS = 12;

/**
 * Compared against when the email does not exist, so the response time is
 * the same for "unknown email" and "wrong password" (prevents user enumeration).
 */
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', SALT_ROUNDS);

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date | null;
  createdAt: Date;
}

export interface AuthResult {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

interface UserLike {
  _id: unknown;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date | null;
  createdAt: Date;
}

const toUserDto = (user: UserLike): UserDto => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  lastLoginAt: user.lastLoginAt ?? null,
  createdAt: user.createdAt,
});

const issueTokens = (user: UserDto) => {
  const payload = { userId: user.id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

const isDuplicateKey = (err: unknown): boolean =>
  typeof err === 'object' &&
  err !== null &&
  (err as { code?: unknown }).code === 11000;

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    try {
      const created = await User.create({
        name: input.name,
        email: input.email,
        passwordHash,
        role: 'user',
        status: 'active',
      });

      const user = toUserDto(created);
      return { user, ...issueTokens(user) };
    } catch (err) {
      // unique index is the source of truth (no check-then-insert race)
      if (isDuplicateKey(err)) {
        throw ApiError.conflict('An account with this email already exists');
      }
      throw err;
    }
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const found = await User.findOne({ email: input.email }).select(
      '+passwordHash'
    );

    const passwordMatched = await bcrypt.compare(
      input.password,
      found?.passwordHash ?? DUMMY_HASH
    );

    if (!found || !passwordMatched) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Checked AFTER the password so inactive status is not leaked to strangers
    if (found.status !== 'active') {
      throw ApiError.forbidden('Your account is inactive');
    }

    const lastLoginAt = new Date();
    await User.updateOne({ _id: found._id }, { $set: { lastLoginAt } });

    const user = toUserDto({ ...found.toObject(), lastLoginAt });
    return { user, ...issueTokens(user) };
  }

  async refresh(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let userId: string;

    try {
      userId = verifyRefreshToken(refreshToken).userId;
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const found = await User.findById(userId).lean();

    if (!found) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    if (found.status !== 'active') {
      throw ApiError.forbidden('Your account is inactive');
    }

    return issueTokens(toUserDto(found));
  }

  async getMe(userId: string): Promise<UserDto> {
    const found = await User.findById(userId).lean();

    if (!found) {
      throw ApiError.unauthorized('Authentication required');
    }

    if (found.status !== 'active') {
      throw ApiError.forbidden('Your account is inactive');
    }

    return toUserDto(found);
  }
}

export const authService = new AuthService();