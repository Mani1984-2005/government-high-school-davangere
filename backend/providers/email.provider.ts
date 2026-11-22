export interface EmailVerificationRequest {
  recipientEmail: string;
  purpose: 'register_verify' | 'security_alert' | 'recovery_alert';
  verificationToken?: string;
  expiresHours?: number;
  language: 'kn' | 'en';
}

export interface EmailDispatchResult {
  delivered: boolean;
  provider: 'disabled_dev' | 'configured';
  status: 'disabled_dev' | 'dispatched' | 'unavailable';
  messageId?: string;
  reason?: string;
}

export interface EmailProvider {
  readonly mode: 'disabled_dev' | 'configured';
  sendVerification(request: EmailVerificationRequest): Promise<EmailDispatchResult>;
}

/**
 * Isolated development adapter:
 * - Never sends real emails.
 * - Never writes verification tokens to console logs.
 * - Never claims delivery succeeded.
 */
export class DisabledDevEmailProvider implements EmailProvider {
  readonly mode = 'disabled_dev' as const;

  async sendVerification(request: EmailVerificationRequest): Promise<EmailDispatchResult> {
    if (!request.recipientEmail) {
      return {
        delivered: false,
        provider: this.mode,
        status: 'unavailable',
        reason: 'Missing recipient email address.',
      };
    }

    return {
      delivered: false,
      provider: this.mode,
      status: 'disabled_dev',
      reason:
        'Email delivery is disabled in development mode. Configure SMTP or an approved transactional email provider before live verification.',
    };
  }
}
