import jwt from "jsonwebtoken";

type TokenType = "access" | "refresh";

type UserRole = "user" | "admin";

interface JwtPayload {
  userId: string;
  role: UserRole;
  type: TokenType;
}

const getSecret = (type: TokenType): string => {
  const secret =
    type === "access"
      ? process.env.JWT_ACCESS_SECRET
      : process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error(
      `${type === "access" ? "JWT_ACCESS_SECRET" : "JWT_REFRESH_SECRET"} is not configured`,
    );
  }

  return secret;
};

const getExpiresInSeconds = (type: TokenType): number => {
  const value =
    type === "access"
      ? process.env.JWT_ACCESS_EXPIRES_IN
      : process.env.JWT_REFRESH_EXPIRES_IN;

  if (!value) {
    return type === "access" ? 15 * 60 : 7 * 24 * 60 * 60;
  }

  const match = value.trim().match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(
      `Invalid ${type} token expiration format: ${value}`,
    );
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s":
      return amount;

    case "m":
      return amount * 60;

    case "h":
      return amount * 60 * 60;

    case "d":
      return amount * 24 * 60 * 60;

    default:
      throw new Error(
        `Unsupported ${type} token expiration unit`,
      );
  }
};

export const signAccessToken = (
  payload: Omit<JwtPayload, "type">,
): string => {
  return jwt.sign(
    {
      ...payload,
      type: "access",
    },
    getSecret("access"),
    {
      expiresIn: getExpiresInSeconds("access"),
    },
  );
};

export const signRefreshToken = (
  payload: Omit<JwtPayload, "type">,
): string => {
  return jwt.sign(
    {
      ...payload,
      type: "refresh",
    },
    getSecret("refresh"),
    {
      expiresIn: getExpiresInSeconds("refresh"),
    },
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, getSecret("access"));

  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.userId !== "string" ||
    (payload.role !== "user" && payload.role !== "admin") ||
    payload.type !== "access"
  ) {
    throw new Error("INVALID_ACCESS_TOKEN");
  }

  return payload as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, getSecret("refresh"));

  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.userId !== "string" ||
    (payload.role !== "user" && payload.role !== "admin") ||
    payload.type !== "refresh"
  ) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  return payload as JwtPayload;
};