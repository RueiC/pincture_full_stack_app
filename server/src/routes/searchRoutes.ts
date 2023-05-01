import express from 'express';
import { searchPins } from '../controllers/searchController.js';

const searchRouter = express.Router();

searchRouter.get('/:id', searchPins);

export default searchRouter;
