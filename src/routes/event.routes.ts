import { Router } from 'express';
import * as inscription from './../controllers/event.controller'

export const eventRoutes = Router();

eventRoutes.post('/register', inscription.saveUserRegister);
