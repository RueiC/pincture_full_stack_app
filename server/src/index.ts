import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import crypto from 'crypto';

import { getCurrentUser } from './controllers/userController.js';
import pinsRoutes from './routes/pinsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import registerRoutes from './routes/registerRoutes.js';

const PORT = 3002;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      SANITY_TOKEN: string;
    }
  }
}

const HEX_SECRET = crypto.randomBytes(128).toString('hex');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/get-current-user', getCurrentUser);

app.use('/api/register', registerRoutes);
app.use('/api/pins', pinsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/search', searchRoutes);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
