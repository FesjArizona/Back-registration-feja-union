import { Router } from 'express';
import * as generalController from './../controllers/general.controller'

export const generalRoutes = Router();

generalRoutes.get('/conference/states', generalController.getStates);
generalRoutes.get('/state/:id/conferences', generalController.getConferences);
generalRoutes.get('/shirt-sizes', generalController.getShirtSizes);
