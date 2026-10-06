import type { CookieOptions, Response } from 'express';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const isProd = process.env['NODE_ENV'] === 'production';

const baseOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/api/v1/auth',
};

export const getRefreshTokenCookie = (req: {
  cookies?: Record<string, string | undefined>;
}): string | undefined => req.cookies?.[REFRESH_TOKEN_COOKIE];

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    ...baseOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  // options must match the ones used when the cookie was set
  res.clearCookie(REFRESH_TOKEN_COOKIE, baseOptions);
};