import type { Language } from '../types';
import type {
  ParentRegistrationPayload,
  RegistrationStatusLookupPayload,
  RegistrationStatusLookupResponse,
  RegistrationSubmitResponse,
  StaffRegistrationPayload,
  StudentRegistrationPayload,
} from '../../shared/types/auth';

export class PortalApiError extends Error {
  readonly status: number;
  readonly errorCode: string;

  constructor(status: number, errorCode: string, message: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

async function requestJson<T>(
  path: string,
  options: {
    method: 'GET' | 'POST';
    body?: unknown;
    lang?: Language;
  }
): Promise<T> {
  const response = await fetch(path, {
    method: options.method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': options.lang ?? 'kn',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new PortalApiError(
      response.status,
      typeof data.errorCode === 'string' ? data.errorCode : 'API_ERROR',
      typeof data.message === 'string'
        ? data.message
        : 'Unable to complete request. Please try again.'
    );
  }

  return data as T;
}

export const portalApi = {
  registerStudent(payload: StudentRegistrationPayload, lang: Language) {
    return requestJson<RegistrationSubmitResponse>('/api/v1/auth/register/student', {
      method: 'POST',
      body: payload,
      lang,
    });
  },
  registerParent(payload: ParentRegistrationPayload, lang: Language) {
    return requestJson<RegistrationSubmitResponse>('/api/v1/auth/register/parent', {
      method: 'POST',
      body: payload,
      lang,
    });
  },
  registerStaff(payload: StaffRegistrationPayload, lang: Language) {
    return requestJson<RegistrationSubmitResponse>('/api/v1/auth/register/staff', {
      method: 'POST',
      body: payload,
      lang,
    });
  },
  checkRegistrationStatus(payload: RegistrationStatusLookupPayload, lang: Language) {
    return requestJson<RegistrationStatusLookupResponse>(
      '/api/v1/auth/registration-status',
      {
        method: 'POST',
        body: payload,
        lang,
      }
    );
  },
};
