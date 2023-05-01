import express from 'express';
import {
  getPin,
  getPins,
  getComments,
  toggleSavePin,
  addComment,
  deletePin,
  deleteComment,
} from '../controllers/pinsController.js';

const pinsRouter = express.Router();

pinsRouter.get('/', getPins);
pinsRouter.get('/:id', getPin);
pinsRouter.get('/:id/get-comment', getComments);

pinsRouter.patch('/:id/toggle-save-pin', toggleSavePin);
pinsRouter.patch('/:id/add-comment', addComment);

pinsRouter.delete('/:id', deletePin);
pinsRouter.patch('/:id/delete-comment', deleteComment);

export default pinsRouter;
