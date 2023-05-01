import { Request, Response } from 'express';
import { searchQuery } from '../queries/searchQueries.js';
import { client } from '../../sanity.config.js';

export const searchPins = async (req: Request, res: Response) => {
  const { id: searchId } = req.params;

  try {
    const query = searchQuery(searchId);
    const pins = await client
      .fetch(query)
      .then((res) => (res.length === 0 ? null : res));

    return res.status(200).json({ pins, message: '成功' });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
