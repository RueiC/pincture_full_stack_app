import express from 'express';
import { getUserInfo, createNewPin } from '../controllers/userController.js';
import { userAuth } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.get('/:id', getUserInfo);

userRouter.post('/:id/create-new-pin', createNewPin);

export default userRouter;
