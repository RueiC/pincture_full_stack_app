import { Request, Response, NextFunction } from 'express';

export const registerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const user = req.session?.user;

  // try {
  //   if (user) {
  //     return res.status(403).json({ message: '請先登出後再進行' });
  //   } else {
  //     next();
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({ message: '發生未知錯誤' });
  // }

  next();
};

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const user = req.session?.user;

  // try {
  //   if (user) {
  //     next();
  //   } else {
  //     return res.status(401).json({ message: '請先登入' });
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({ message: '發生未知錯誤' });
  // }
  next();
};
