import { Router } from 'express';
import * as generalController from './../controllers/general.controller'

export const generalRoutes = Router();

generalRoutes.get('/conferences', generalController.getConferences);
generalRoutes.get('/conference/:id/states', generalController.getStates);
generalRoutes.get('/shirt-sizes', generalController.getShirtSizes);
