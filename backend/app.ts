import express, { type NextFunction, type Request, type Response } from 'express';
import { getServerConfig, type ServerConfig } from './config/env.ts';
import {
  createRequireAuth,
  type AuthenticatedRequest,
  type AuthSessionResolver,
} from './middleware/auth.guard.ts';
import { requirePermissions, requireRoles } from './middleware/rbac.guard.ts';
import { createSecurityHeadersMiddleware } from './middleware/securityHeaders.ts';
import { DbAuthSessionResolver } from './middleware/sessionResolver.ts';
import {
  DrizzleRegistrationRepository,
  type RegistrationRepository,
} from './modules/registration/registration.repository.ts';
import {
  detectForbiddenFields,
  parentRegistrationSchema,
  registrationStatusSchema,
  staffRegistrationSchema,
  studentRegistrationSchema,
} from './modules/registration/registration.schemas.ts';
import {
  RegistrationError,
  RegistrationService,
} from './modules/registration/registration.service.ts';
import { DisabledDevEmailProvider, type EmailProvider } from './providers/email.provider.ts';
import { InMemoryRateLimitStore, type RateLimitStore } from './providers/rateLimit.store.ts';
import { DisabledDevSmsProvider, type SmsProvider } from './providers/sms.provider.ts';
import {
  createErrorHandlerMiddleware,
  createErrorLogger,
  sendInternalErrorResponse,
  type ErrorLogger,
} from './utils/errorLogger.ts';
import { isDatabaseConfigured } from '../src/db/index.ts';

export interface BackendAppDependencies {
  config?: ServerConfig;
  registrationRepo?: RegistrationRepository;
  smsProvider?: SmsProvider;
  emailProvider?: EmailProvider;
  rateLimitStore?: RateLimitStore;
  authResolver?: AuthSessionResolver;
  errorLogger?: ErrorLogger;
}

export function createBackendRouter(deps: BackendAppDependencies = {}) {
  const config = deps.config ?? getServerConfig();
  const errorLogger = deps.errorLogger ?? createErrorLogger(config);
  const rateLimitStore = deps.rateLimitStore ?? new InMemoryRateLimitStore();
  const smsProvider = deps.smsProvider ?? new DisabledDevSmsProvider();
  const emailProvider = deps.emailProvider ?? new DisabledDevEmailProvider();
  const registrationRepo = deps.registrationRepo ?? new DrizzleRegistrationRepository();
  const authResolver = deps.authResolver ?? new DbAuthSessionResolver();

  const registrationService = new RegistrationService({
    repo: registrationRepo,
    smsProvider,
    emailProvider,
    config,
  });

  const requireAuth = createRequireAuth(authResolver, errorLogger);

  const router = express.Router();
  router.use(createSecurityHeadersMiddleware(config));
  router.use(express.json({ limit: '64kb' }));

  const enforcePublicRateLimit = (actionKey: string, maxRequests: number, windowSec: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const result = await rateLimitStore.consume(
        `${actionKey}:${ip}`,
        maxRequests,
        windowSec
      );
      if (!result.allowed) {
        res.setHeader('Retry-After', String(result.retryAfterSeconds));
        res.status(429).json({
          errorCode: 'RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: result.retryAfterSeconds,
          message: 'Too many requests. Please wait before trying again.',
        });
        return;
      }
      next();
    };
  };

  // Health endpoint (exposes zero secrets or connection strings)
  router.get('/api/v1/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      databaseConfigured: isDatabaseConfigured(),
      smsProviderMode: smsProvider.mode,
      emailProviderMode: emailProvider.mode,
    });
  });

  // Self-Registration Endpoints (Milestone 2)
  router.post(
    '/api/v1/auth/register/student',
    enforcePublicRateLimit('register_student', 10, 600),
    async (req: Request, res: Response) => {
      const forbidden = detectForbiddenFields(req.body);
      if (forbidden.length > 0) {
        res.status(400).json({
          errorCode: 'FORBIDDEN_FIELDS',
          message:
            'Aadhaar numbers and client-supplied role/status fields are not accepted during registration.',
        });
        return;
      }

      const parsed = studentRegistrationSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          errorCode: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message || 'Invalid student registration payload.',
        });
        return;
      }

      try {
        const lang = req.headers['accept-language']?.startsWith('en') ? 'en' : 'kn';
        const result = await registrationService.registerStudent(
          parsed.data,
          req.ip || 'unknown',
          lang
        );
        res.status(201).json(result);
      } catch (err) {
        if (err instanceof RegistrationError) {
          res.status(err.statusCode).json({ errorCode: err.errorCode, message: err.message });
          return;
        }
        sendInternalErrorResponse(errorLogger, req, res, err, {
          operation: 'register_student',
          publicMessage: 'Unable to process registration request.',
          metadata: { classGrade: parsed.data.classGrade },
        });
      }
    }
  );

  router.post(
    '/api/v1/auth/register/parent',
    enforcePublicRateLimit('register_parent', 10, 600),
    async (req: Request, res: Response) => {
      const forbidden = detectForbiddenFields(req.body);
      if (forbidden.length > 0) {
        res.status(400).json({
          errorCode: 'FORBIDDEN_FIELDS',
          message:
            'Aadhaar numbers and client-supplied role/status fields are not accepted during registration.',
        });
        return;
      }

      const parsed = parentRegistrationSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          errorCode: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message || 'Invalid parent registration payload.',
        });
        return;
      }

      try {
        const lang = req.headers['accept-language']?.startsWith('en') ? 'en' : 'kn';
        const result = await registrationService.registerParent(
          parsed.data,
          req.ip || 'unknown',
          lang
        );
        res.status(201).json(result);
      } catch (err) {
        if (err instanceof RegistrationError) {
          res.status(err.statusCode).json({ errorCode: err.errorCode, message: err.message });
          return;
        }
        sendInternalErrorResponse(errorLogger, req, res, err, {
          operation: 'register_parent',
          publicMessage: 'Unable to process registration request.',
          metadata: {
            classGrade: parsed.data.classGrade,
            relationship: parsed.data.relationship,
          },
        });
      }
    }
  );

  router.post(
    '/api/v1/auth/register/staff',
    enforcePublicRateLimit('register_staff', 10, 600),
    async (req: Request, res: Response) => {
      const forbidden = detectForbiddenFields(req.body);
      if (forbidden.length > 0) {
        res.status(400).json({
          errorCode: 'FORBIDDEN_FIELDS',
          message:
            'Aadhaar numbers and client-supplied role/status fields are not accepted during registration.',
        });
        return;
      }

      const parsed = staffRegistrationSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          errorCode: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message || 'Invalid staff registration payload.',
        });
        return;
      }

      try {
        const lang = req.headers['accept-language']?.startsWith('en') ? 'en' : 'kn';
        const result = await registrationService.registerStaff(
          parsed.data,
          req.ip || 'unknown',
          lang
        );
        res.status(201).json(result);
      } catch (err) {
        if (err instanceof RegistrationError) {
          res.status(err.statusCode).json({ errorCode: err.errorCode, message: err.message });
          return;
        }
        sendInternalErrorResponse(errorLogger, req, res, err, {
          operation: 'register_staff',
          publicMessage: 'Unable to process registration request.',
        });
      }
    }
  );

  router.post(
    '/api/v1/auth/registration-status',
    enforcePublicRateLimit('registration_status', 20, 300),
    async (req: Request, res: Response) => {
      const parsed = registrationStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          errorCode: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message || 'Invalid status lookup input.',
        });
        return;
      }

      try {
        const statusResult = await registrationService.checkRegistrationStatus(parsed.data);
        res.status(200).json(statusResult);
      } catch (err) {
        if (err instanceof RegistrationError) {
          res.status(err.statusCode).json({ errorCode: err.errorCode, message: err.message });
          return;
        }
        sendInternalErrorResponse(errorLogger, req, res, err, {
          operation: 'registration_status_lookup',
          publicMessage: 'Unable to check registration status.',
        });
      }
    }
  );

  // Server-Side Authorization Boundary Endpoints (Enforce auth + approved status + RBAC)
  router.get(
    '/api/v1/student/profile',
    requireAuth,
    requireRoles('STUDENT'),
    requirePermissions('profile:read:own'),
    (req: AuthenticatedRequest, res: Response) => {
      res.status(501).json({
        errorCode: 'MILESTONE_PENDING',
        userId: req.auth?.userId,
        message: 'Student profile retrieval endpoints will be completed in Milestone 4.',
      });
    }
  );

  router.get(
    '/api/v1/parent/children',
    requireAuth,
    requireRoles('PARENT_GUARDIAN'),
    requirePermissions('parent:children:read:linked'),
    (req: AuthenticatedRequest, res: Response) => {
      res.status(501).json({
        errorCode: 'MILESTONE_PENDING',
        userId: req.auth?.userId,
        message: 'Parent linked-children endpoints will be completed in Milestone 4.',
      });
    }
  );

  router.get(
    '/api/v1/staff/profile',
    requireAuth,
    requireRoles('TEACHER', 'HEADMASTER', 'SCHOOL_ADMIN'),
    requirePermissions('profile:read:own'),
    (req: AuthenticatedRequest, res: Response) => {
      res.status(501).json({
        errorCode: 'MILESTONE_PENDING',
        userId: req.auth?.userId,
        message: 'Staff profile endpoints will be completed in Milestone 4.',
      });
    }
  );

  router.get(
    '/api/v1/admin/registrations',
    requireAuth,
    requireRoles('HEADMASTER', 'SCHOOL_ADMIN'),
    requirePermissions('registrations:review'),
    (req: AuthenticatedRequest, res: Response) => {
      res.status(501).json({
        errorCode: 'MILESTONE_PENDING',
        userId: req.auth?.userId,
        message: 'Admin approval workflow endpoints will be completed in Milestone 4.',
      });
    }
  );

  router.use(createErrorHandlerMiddleware(errorLogger));

  return router;
}

export function createApiApp(deps: BackendAppDependencies = {}) {
  const app = express();
  app.set('trust proxy', 1);
  app.use(createBackendRouter(deps));
  return app;
}
