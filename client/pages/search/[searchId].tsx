import { GetServerSideProps } from 'next';
import axios from 'axios';

import { SectionWrapper } from '../../HoC';
import { PinItem } from '../../types/types';
import MasonryLayout from '../../components/MasonryLayout';
import { BASE_URL } from '../../utils/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

interface ServerSideProps {
  props: {
    pins: PinItem[] | null;
    session: any;
  };
}

interface Props {
  pins: PinItem[] | null;
  session: any;
}

export const getServerSideProps: GetServerSideProps = async (
  context,
): Promise<ServerSideProps> => {
  const searchId = context.query.searchId as string;
  const session = await getServerSession(context.req, context.res, authOptions);
  try {
    const response = await axios
      .get(`${BASE_URL}/api/search/${searchId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data);

    return {
      props: { pins: response.pins, session },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { pins: null, session },
    };
  }
};

const Search = ({ pins, session }: Props) => {
  return (
    <>
      {pins === null ? null : <MasonryLayout pins={pins} session={session} />}
    </>
  );
};

export default SectionWrapper(Search, 'search');
