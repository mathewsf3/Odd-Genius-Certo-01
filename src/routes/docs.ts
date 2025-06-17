/**
 * 📚 Documentation Routes
 * API documentation endpoints
 */

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Football Data API Documentation',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      docs: '/docs'
    }
  });
});

export default router;
