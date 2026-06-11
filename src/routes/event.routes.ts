import { Router } from 'express';
import * as eventsController from './../controllers/event.controller'

export const eventRoutes = Router();

eventRoutes.get('/', eventsController.getEvents);
eventRoutes.get('/:id', eventsController.getEventById);
eventRoutes.post('/:id/register', eventsController.saveUserRegister);
