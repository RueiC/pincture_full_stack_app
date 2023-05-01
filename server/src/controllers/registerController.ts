import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { UserData, CreateUser } from '../../types.js';
import { userQuery } from '../queries/userQueries.js';
import { client } from '../../sanity.config.js';

dotenv.config();

export const signin = async (req: Request, res: Response) => {
  const user = req.body;

  try {
    // 驗證輸入的資料
    if (!user.email || !user.password) {
      return res.status(400).json({ message: '請輸入完整資料' });
    }

    // 檢查Email、密碼是否正確
    const query = userQuery(user.email);
    const oldUser = await client
      .fetch(query)
      .then((res) => (res.length === 0 ? false : res[0]));

    if (!oldUser) {
      return res.status(400).json({ message: '使用者不存在' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      user.password,
      oldUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ currentUser: null, message: '密碼錯誤' });
    } else {
      const currentUser: UserData = {
        _id: oldUser._id,
        name: oldUser.name,
        image: oldUser.image,
        email: oldUser.email,
      };

      // 回傳使用者資料
      return res.status(200).json({ message: '登入成功', user: currentUser });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: '發生錯誤', user: null });
  }
};

export const signup = async (req: Request, res: Response) => {
  const user = req.body;

  try {
    // 驗證輸入的資料
    if (!user.name || !user.email || !user.password) {
      return res.status(400).json({ message: '請輸入完整資料' });
    }

    // 檢查Email是否已經存在
    const query = userQuery(user.email);
    const isUserExist = await client
      .fetch(query)
      .then((res) => (res.length === 0 ? false : true));

    if (isUserExist) {
      return res.status(500).json({ message: '使用者已存在' });
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    const newUser: CreateUser = {
      _id: uuidv4(),
      _type: 'user',
      name: user.name,
      email: user.email,
      password: hashedPassword,
      image: '',
    };

    // 創建使用者
    await client.createIfNotExists(newUser).then(() => {
      return res.status(200).json({ message: '註冊成功' });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: '發生未知錯誤' });
  }
};
