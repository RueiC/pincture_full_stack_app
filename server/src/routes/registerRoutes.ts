import express from 'express';
import { registerAuth } from '../middleware/auth.js';
const registerRoutes = express.Router();

import { signup, signin } from '../controllers/registerController.js';

registerRoutes.post('/signin', signin);
registerRoutes.post('/signup', signup);

export default registerRoutes;
