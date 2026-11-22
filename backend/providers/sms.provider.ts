export interface SmsDispatchRequest {
  recipientMobileE164: string;
  purpose: 'login' | 'register_verify' | 'recovery' | 'admin_stepup';
  otpCode: string;
  ttlMinutes: number;
  language: 'kn' | 'en';
}

export interface SmsDispatchResult {
  delivered: boolean;
  provider: 'disabled_dev' | 'configured';
  status: 'disabled_dev' | 'dispatched' | 'unavailable';
  messageId?: string;
  reason?: string;
}

export interface SmsProvider {
  readonly mode: 'disabled_dev' | 'configured';
  sendOtp(request: SmsDispatchRequest): Promise<SmsDispatchResult>;
}

/**
 * Isolated development adapter:
 * - Never sends real SMS messages.
 * - Never prints OTP values to console logs.
 * - Never claims delivery succeeded.
 */
export class DisabledDevSmsProvider implements SmsProvider {
  readonly mode = 'disabled_dev' as const;

  async sendOtp(request: SmsDispatchRequest): Promise<SmsDispatchResult> {
    if (!request.recipientMobileE164 || !request.otpCode) {
      return {
        delivered: false,
        provider: this.mode,
        status: 'unavailable',
        reason: 'Missing recipient or OTP payload.',
      };
    }

    return {
      delivered: false,
      provider: this.mode,
      status: 'disabled_dev',
      reason:
        'SMS delivery is disabled in development mode. Configure a DLT-approved SMS gateway provider before enabling live OTP delivery.',
    };
  }
}
