import React from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

import { SectionWrapper } from '../../HoC';
import { BASE_URL } from '../../utils/data';
import type { PinDetail, CommentType } from '../../types/types';
import { CommentField, ConfirmModal, Pin } from '../../components';
import { useStateContext } from '../../store/stateContext';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { Session } from 'next-auth/core/types';

interface Props {
  pinId: string;
  pin: PinDetail;
  comments: CommentType | null;
  session: Session | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pinId = context.query.pinId as string;
  const session = await getServerSession(context.req, context.res, authOptions);

  const response = await axios
    .get(`${BASE_URL}/api/pins/${pinId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.data);

  if (response?.pin) {
    return {
      props: {
        pinId,
        pin: response.pin,
        comments: response.comments,
        session,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

const PinDetailPage = ({ pinId, pin, comments, session }: Props) => {
  const { toggleDeleteWindow } = useStateContext();

  return (
    <>
      {toggleDeleteWindow ? <ConfirmModal /> : null}

      <div className='flex flex-col lg:flex-row items-start justify-between gap-[36px]'>
        <div className='w-full h-full'>
          <Pin pin={pin} session={session} />
        </div>

        <div className='flex flex-col w-full gap-[24px]'>
          <div>
            <h1 className='text-[32px] mb-[12px]'>{pin.title}</h1>
            <p className='text-[14px]'>{pin.about}</p>
          </div>

          <Link
            href={pin.postedBy._id}
            className='flex items-center justify-start gap-[14px] cursor-pointer hover:translate-y-[-2px] duration-200 ease-linear'
          >
            <img
              className='w-[34px] h-[34px] rounded-full'
              src={pin.postedBy.image}
              alt='profile'
            />
            <span className='text-[14px] font-medium'>{pin.postedBy.name}</span>
          </Link>

          <div className='flex flex-col gap-[24px]'>
            <h2 className='text-[20px] flex items-center justify-start gap-[5px] font-medium'>
              回應
            </h2>
            <CommentField pinId={pinId} comments={comments} session={session} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(PinDetailPage, 'pinDetailPage');
