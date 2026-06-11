import { Router } from 'express';
import { eventRoutes } from './event.routes';
import { generalRoutes } from './general.routes';

export const router = Router();

router.use('/events', eventRoutes);
router.use('', generalRoutes);