import { Router } from 'express';
import * as eventsController from './../controllers/event.controller'
import { requireAuth } from '../middlewares/auth.middleware';

export const eventRoutes = Router();

eventRoutes.get('/', eventsController.getEvents);
eventRoutes.get('/:id', eventsController.getEventById);
eventRoutes.post('/:id/register', eventsController.saveUserRegister);

eventRoutes.get('/registration/:id', requireAuth, eventsController.getRegistration);
eventRoutes.get('/:id/registrations', requireAuth, eventsController.getEventRegistrations);
eventRoutes.get('/register/:id/checkin', requireAuth, eventsController.checkIn);
eventRoutes.post('/register/:id/updatePayment', requireAuth, eventsController.updatePaymentRegister);