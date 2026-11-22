import type { NextFunction, Request, Response } from 'express';
import type { ServerConfig } from '../config/env.ts';

export function createSecurityHeadersMiddleware(config: ServerConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    if (config.nodeEnv === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    // CSP compatible with React + Tailwind + Google Fonts; avoids inline eval in production
    const csp = [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      config.nodeEnv === 'development'
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self'",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
    res.setHeader('Content-Security-Policy', csp);

    // Strict CORS handling on API endpoints (never wildcard '*' on authenticated endpoints)
    if (req.path.startsWith('/api/')) {
      const origin = req.headers.origin;
      if (origin) {
        const hostHeader = req.headers['x-forwarded-host'] || req.headers.host;
        const isSameHost =
          typeof hostHeader === 'string' &&
          (origin === `https://${hostHeader}` || origin === `http://${hostHeader}`);

        if (isSameHost || config.corsAllowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin);
          res.setHeader('Vary', 'Origin');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
          res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, X-CSRF-Token, X-Requested-With'
          );
        } else {
          res.status(403).json({
            errorCode: 'CORS_ORIGIN_DENIED',
            message: 'Origin is not permitted by server CORS policy.',
          });
          return;
        }
      }

      if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
      }
    }

    next();
  };
}
