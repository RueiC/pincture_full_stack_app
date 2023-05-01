import React from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

import { MasonryLayout } from '../components';
import { SectionWrapper } from '../HoC';
import { BASE_URL } from '../utils/data';
import type { PinItem } from '../types/types';
import { Session } from 'next-auth/core/types';

interface ServerSideProps {
  props: { pins: PinItem[] | null; session: Session | null };
}

interface Props {
  pins: PinItem[] | null;
  session: Session | null;
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}): Promise<ServerSideProps> => {
  const session = await getServerSession(req, res, authOptions);

  try {
    const axiosConfig = {
      method: 'get',
      url: `${BASE_URL}/api/pins`,
      withCredentials: true,
    };

    const response: Props = await axios.request(axiosConfig).then((res) => {
      return res.data;
    });

    return {
      props: {
        pins: response.pins,
        session,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { pins: null, session },
    };
  }
};

const Home = ({ pins, session }: Props) => {
  return (
    <>
      {pins === null ? null : <MasonryLayout pins={pins} session={session} />}
    </>
  );
};

export default SectionWrapper(Home, 'home');
