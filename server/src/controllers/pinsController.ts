import express, { type Request, type Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  pinQuery,
  pinsQuery,
  pinCommentsQuery,
  savePinQuery,
} from '../queries/pinsQueries.js';
import { client } from '../../sanity.config.js';
import { UserData } from '../../types.js';

const router = express.Router();

const savePin = async (pinId: string, userId: string) => {
  const response = await client
    .patch(pinId)
    .setIfMissing({ save: [] })
    .append('save', [
      {
        _key: uuidv4(),
        userId,
      },
    ])
    .commit();

  return response;
};

const unsavePin = async (pinId: string, userId: string) => {
  const query = [`save[userId=="${userId}"]`];
  const response = await client.patch(pinId).unset(query).commit();

  return response;
};

export const getPin = async (req: Request, res: Response) => {
  const { id: pinId } = req.params;

  try {
    const pinQueryStr = pinQuery(pinId);
    const pinCommentsQueryStr = pinCommentsQuery(pinId);

    const pin = await client
      .fetch(pinQueryStr)
      .then((res) => (res.length === 0 ? null : res[0]));
    const comments = await client
      .fetch(pinCommentsQueryStr)
      .then((res) => (res.length === 0 ? null : res[0].comments));

    return res.status(200).json({ pin, comments, message: '成功' });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const getPins = async (req: Request, res: Response) => {
  try {
    const pins = await client
      .fetch(pinsQuery)
      .then((res) => (res.length === 0 ? null : res));

    return res.status(200).json({ pins, message: '成功' });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const toggleSavePin = async (req: Request, res: Response) => {
  const { id: pinId } = req.params;
  const { userId } = req.body;

  try {
    // 1) check if exists
    const query = savePinQuery(pinId);

    const savedPin: any = await client
      .fetch(query)
      .then((res) =>
        res[0].save?.length === 0 || res[0].save === null ? null : res[0].save,
      );

    const isExist: boolean =
      savedPin === null
        ? null
        : savedPin.some((saved: any) => saved.userId === userId);

    // 2) action
    if (!isExist) {
      const response = await savePin(pinId, userId);
      return res
        .status(200)
        .json({ message: '儲存成功', pin: response, isSaved: true });
    }

    if (isExist) {
      const response = await unsavePin(pinId, userId);
      return res
        .status(200)
        .json({ message: '取消儲存成功', pin: response, isSaved: false });
    }

    // "patch": {
    //   "query": "*[_type == 'person' && points >= $treshold]",
    //   "params": {
    //     "threshold": 100
    //   },
    //   "dec": {
    //     "points": 100
    //   },
    //   "inc": {
    //     "bonuses": 1
    //   }
    // }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { id: pinId } = req.params;

  try {
    const pinCommentsQueryStr = pinCommentsQuery(pinId);

    const comments = await client
      .fetch(pinCommentsQueryStr)
      .then((res) => (res.length === 0 ? null : res[0].comments));

    return res.status(200).json({ comments, message: '成功' });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { id: pinId } = req.params;
  const { commentData } = req.body;

  try {
    const response = await client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .append('comments', [commentData])
      .commit();

    return res.status(200).json({ message: '儲存成功', pin: response });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deletePin = async (req: Request, res: Response) => {
  const { id: pinId } = req.params;

  try {
    await client.delete(pinId);

    return res.status(200).json({ message: '刪除成功' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id: pinId } = req.params;
  const { commentKey } = req.body;

  try {
    await client
      .patch(pinId)
      .unset([`comments[_key == "${commentKey}"]`])
      .commit();

    return res.status(200).json({ message: '刪除成功' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export default router;
