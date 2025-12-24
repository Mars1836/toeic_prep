import { CustomValidator, CustomSanitizer } from 'express-validator';
import { sanitizeString, sanitizeHtml, isXssAttempt } from '../utils/xss.utils';

/**
 * Custom validator: Kiểm tra input không chứa XSS
 * Sử dụng với express-validator
 * 
 * @example
 * body('title').custom(isNotXss).withMessage('Invalid input detected')
 */
export const isNotXss: CustomValidator = (value) => {
  if (typeof value !== 'string') {
    return true; // Không phải string thì bỏ qua
  }

  if (isXssAttempt(value)) {
    throw new Error('Potential XSS attack detected');
  }

  return true;
};

/**
 * Custom sanitizer: Sanitize XSS từ input
 * Sử dụng với express-validator
 * 
 * @example
 * body('title').customSanitizer(sanitizeXss)
 */
export const sanitizeXss: CustomSanitizer = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  return sanitizeString(value);
};

/**
 * Custom validator: Kiểm tra HTML sạch (chỉ cho phép một số tags an toàn)
 * 
 * @param allowedTags - Mảng các tag được phép
 * @returns Custom validator function
 * 
 * @example
 * body('content').custom(isCleanHtml(['p', 'br', 'strong', 'em']))
 */
export const isCleanHtml = (allowedTags: string[] = []): CustomValidator => {
  return (value) => {
    if (typeof value !== 'string') {
      return true;
    }

    // Sanitize HTML
    const sanitized = sanitizeHtml(value, allowedTags);

    // Nếu sau khi sanitize mà khác với original, có nghĩa là có XSS
    if (sanitized !== value) {
      throw new Error('HTML contains potentially dangerous content');
    }

    return true;
  };
};

/**
 * Custom sanitizer: Sanitize HTML với các tag được phép
 * 
 * @param allowedTags - Mảng các tag được phép
 * @returns Custom sanitizer function
 * 
 * @example
 * body('blogContent').customSanitizer(sanitizeHtmlWithTags(['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li']))
 */
export const sanitizeHtmlWithTags = (allowedTags: string[]): CustomSanitizer => {
  return (value) => {
    if (typeof value !== 'string') {
      return value;
    }
    return sanitizeHtml(value, allowedTags);
  };
};

/**
 * Validator chain helper: Kiểm tra và sanitize string field
 * 
 * @example
 * import { body } from 'express-validator';
 * import { validateAndSanitizeString } from './validators/xss.validators';
 * 
 * router.post('/api/user/profile',
 *   body('name').custom(isNotXss).customSanitizer(sanitizeXss),
 *   body('bio').custom(isNotXss).customSanitizer(sanitizeXss),
 *   controller.updateProfile
 * );
 */
