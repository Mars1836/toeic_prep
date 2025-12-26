export interface CsrfOptions {
  /**
   * Routes to whitelist (skip CSRF check)
   * Example: ['/api/pub/partner', '/api/pub/csrf-token']
   */
  whitelist?: string[];
  
  /**
   * Cookie name for CSRF token
   * Default: 'XSRF-TOKEN'
   */
  cookieName?: string;
  
  /**
   * Header name for CSRF token
   * Default: 'x-csrf-token'
   */
  headerName?: string;
  
  /**
   * Token length in bytes
   * Default: 32 (64 hex characters)
   */
  tokenLength?: number;
}

export interface CsrfError extends Error {
  code: 'CSRF_INVALID' | 'CSRF_MISSING';
  statusCode: 403;
}
