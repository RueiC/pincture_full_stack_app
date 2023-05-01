import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import {
  userIdQuery,
  userSavedPins,
  userPostedPins,
} from '../queries/userQueries.js';
import { client } from '../../sanity.config.js';
import { UserData } from '../../types.js';

dotenv.config();

export const getUserInfo = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  let postedPins = null;
  let savedPins = null;

  try {
    const query = userIdQuery(userId);

    const user = await client
      .fetch(query)
      .then((res) => (res.length === 0 ? null : res[0]));

    if (user) {
      postedPins = await client
        .fetch(userPostedPins(userId))
        .then((res) => (res.length === 0 ? null : res));
      savedPins = await client
        .fetch(userSavedPins(userId))
        .then((res) => (res.length === 0 ? null : res));
    } else {
    }

    return res.status(200).json({ user, postedPins, savedPins });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNewPin = async (req: Request, res: Response) => {
  const { doc } = req.body;
  try {
    const response = await client.create(doc);

    return res.status(200).json({ message: 'success', pin: response });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500);
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    return res.status(200);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500);
  }
};
