import express, { Request, Response } from 'express';
import { handleAsync } from '../../middlewares/handle_async';
import {
  generateCsrfToken,
  setCsrfCookie,
  setCsrfHeader,
} from '../../utils/csrf.utils';

const csrfRouter = express.Router();

/**
 * GET /api/pub/csrf-token
 * 
 * Endpoint để client lấy CSRF token
 * Token được gửi qua 2 kênh:
 * 1. Cookie (XSRF-TOKEN) - browser tự động gửi trong requests
 * 2. Response body + header - client lưu vào memory/localStorage
 */
csrfRouter.get(
  '/',
  handleAsync(async (req: Request, res: Response) => {
    // Generate new CSRF token
    const csrfToken = generateCsrfToken();

    // Set token as cookie (browser sẽ tự động gửi trong requests)
    setCsrfCookie(res, csrfToken);

    // Set token as response header (optional, để client dễ đọc)
    setCsrfHeader(res, csrfToken);

    // Return token trong response body
    res.status(200).json({
      csrfToken,
      message: 'CSRF token generated successfully',
    });
  })
);

export default csrfRouter;
