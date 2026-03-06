import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendError } from '../lib/response.js';

const router = Router();

// Products
router.get('/products', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/products/:id', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

// Cart
router.get('/cart', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.post('/cart', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.put('/cart/:itemId', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.delete('/cart/:itemId', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

// Orders
router.get('/orders', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

router.get('/orders/:id', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

// Reviews
router.post('/products/:id/reviews', (_req: Request, res: Response) => {
  sendError(res, 501, 'SRV_005', 'Not implemented');
});

export default router;
