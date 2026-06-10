import { Router } from 'express';
import { eventRoutes } from './event.routes';

export const router = Router();

router.use('/event', eventRoutes);