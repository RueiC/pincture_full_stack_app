import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { Session } from 'next-auth/core/types';
import image from '../../../assets/index';
import type { User, PinItem } from '../../../types/types';
import MasonryLayout from '../../../components/MasonryLayout';
import { BASE_URL } from '../../../utils/data';
import { SectionWrapper } from '../../../HoC';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';

interface Props {
  user: User;
  postedPins: PinItem[] | null;
  savedPins: PinItem[] | null;
  session: Session | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.query.userId as string;
  const session = await getServerSession(context.req, context.res, authOptions);

  const response: Props = await axios
    .get(`${BASE_URL}/api/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      return res.data;
    });

  if (response.user) {
    return {
      props: {
        user: response.user,
        postedPins: response.postedPins,
        savedPins: response.savedPins,
        session,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

const activeBtnStyles: string =
  'bg-red-500 text-white font-medium py-[12px] rounded-[10px] outline-none px-[28px] text-[16px]';
const notActiveBtnStyles: string =
  'bg-primary text-black font-medium py-[12px] rounded-[10px] outline-none px-[28px] text-[16px] text-text-2 opacity-90';

const UserProfile = ({ user, postedPins, savedPins, session }: Props) => {
  const [activeBtn, setActiveBtn] = useState<string>('created');
  const [currentPins, setCurrentPins] = useState<PinItem[] | null>(postedPins);

  useEffect(() => {
    if (activeBtn === 'created') setCurrentPins(postedPins);
    if (activeBtn === 'saved') setCurrentPins(savedPins);
  }, [activeBtn]);

  return (
    <div className='flex flex-col items-center justify-start gap-[24px]'>
      <div className='flex flex-col items-center gap-[12px]'>
        <Image
          className='rounded-full'
          src={user?.image ? user.image : image.userImage}
          alt='user image'
          width={120}
          height={120}
        />

        <h1 className='font-bold text-[24px] text-center text-text-1'>
          {user?.name}
        </h1>

        <span className='text-[14px]'>
          @{user.email.substr(0, user.email.indexOf('@'))}
        </span>
      </div>

      <div className='flex items-center gap-[12px]'>
        <button
          className={`${
            activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
          } font-bold hover:scale-105 transition-all duration-300 ease-in-out`}
          type='button'
          onClick={() => setActiveBtn('created')}
        >
          已創建
        </button>
        <button
          className={`${
            activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
          } font-bold hover:scale-105 transition-all duration-300 ease-in-out`}
          type='button'
          onClick={() => setActiveBtn('saved')}
        >
          已儲存
        </button>
      </div>

      {currentPins ? (
        <MasonryLayout pins={currentPins} session={session} />
      ) : null}
    </div>
  );
};

export default SectionWrapper(UserProfile, 'userProfile');
