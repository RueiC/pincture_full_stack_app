import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillArrowUpRightCircleFill, BsFillTrashFill } from 'react-icons/bs';
import { IoMdCloudDownload } from 'react-icons/io';
import { useRouter } from 'next/router';
import axios from 'axios';

import image from '../assets/index';
import { urlFor } from '../utils/sanityClient';
import type { PinItem } from '../types/types';
import { useStateContext } from '../store/stateContext';
import { BASE_URL } from '../utils/data';
import { Session } from 'next-auth/core/types';

interface Props {
  pin: PinItem;
  session: Session | null;
}

const Pin = ({ pin, session }: Props) => {
  const router = useRouter();
  const { setDeletedItem } = useStateContext();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [submitState, setSubmitState] = useState({
    style: 'bg-red-500',
    text: '儲存',
    state: 'default',
  });

  useEffect(() => {
    if (pin.save !== null) {
      const checkSaved = pin?.save.some(
        (saved) => saved.userId === session?.user?.id,
      );

      if (checkSaved) {
        setSubmitState({
          style: 'bg-red-500',
          text: '已儲存',
          state: 'default',
        });
      } else {
        setSubmitState({
          style: 'bg-red-500',
          text: '儲存',
          state: 'default',
        });
      }
    } else {
      setSubmitState({
        style: 'bg-red-500',
        text: '儲存',
        state: 'default',
      });
    }
  }, [pin]);

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.stopPropagation();

    if (!session?.user) return;

    setSubmitState({
      style: 'bg-gray-300',
      text: '處理中',
      state: 'handling',
    });

    // fetch
    const response = await axios
      .patch(
        `${BASE_URL}/api/pins/${pin._id}/toggle-save-pin`,
        {
          userId: session.user.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => res.data);

    setSubmitState({
      style: 'bg-red-500',
      text: response.isSaved ? '已儲存' : '儲存',
      state: 'default',
    });
  };

  return (
    <>
      <div className='w-full hover:-translate-y-1 transition-all duration-300 ease-in-out mb-[3rem] sm:mb-[1.8rem]'>
        <div
          className='relative flex items-center justify-center object-contain w-full h-full shadow-md hover:shadow-xl'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(): Promise<boolean> => router.push(`/pins/${pin._id}`)}
        >
          <Image
            className='!relative rounded-lg !w-full '
            src={pin.image.asset.url}
            blurDataURL={urlFor(pin.image).url()}
            alt='picture'
            placeholder='blur'
            fill
          />

          {isHovered ? (
            <div className='absolute flex flex-col justify-between top-0 w-full h-full p-[1rem] transition-all opacity-0 hover:opacity-100 cursor-pointer'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center justify-center bg-white rounded-full text-black text-[18px] p-[8px] opacity-70 hover:opacity-80 shadow-md'>
                  <Link href={`${pin?.image?.asset?.url}?dl=`} legacyBehavior>
                    <a download onClick={(e) => e.stopPropagation()}>
                      <IoMdCloudDownload />
                    </a>
                  </Link>
                </div>

                {session?.user && session?.user.id !== pin.postedBy._id ? (
                  <button
                    className={`${submitState.style} flex items-center justify-center opacity-80 hover:opacity-100 rounded-full text-[14px] h-full text-white py-[8px] px-[18px] font-bold shadow-md`}
                    disabled={submitState.state === 'handling' ? true : false}
                    onClick={handleSave}
                  >
                    {submitState.text}
                  </button>
                ) : null}
              </div>

              <div className='flex justify-between w-full gap-[32px]'>
                <Link
                  href={pin.destination}
                  className='flex items-center justify-start bg-white opacity-70 hover:opacity-80 rounded-full text-[14px] text-black py-[8px] px-[18px] h-full truncate shadow-md'
                >
                  <BsFillArrowUpRightCircleFill className='mr-[0.5rem]' />
                  {pin.destination}
                </Link>

                {session?.user && session?.user?.id === pin.postedBy._id ? (
                  <div
                    className='flex items-center justify-center bg-white opacity-70 hover:opacity-80 rounded-full text-black text-[18px] p-[8px] shadow-md'
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletedItem({
                        type: 'pin',
                        pinId: pin._id,
                        commentKey: null,
                      });
                    }}
                  >
                    <BsFillTrashFill />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {router.pathname.startsWith('/pins') ? null : (
          <Link href={`/user/${pin?.postedBy?._id}`}>
            <div className='flex items-center justify-start gap-[14px] mt-[14px] h-full w-full cursor-pointer'>
              <Image
                className='rounded-full'
                src={
                  pin?.postedBy?.image ? pin?.postedBy?.image : image.userImage
                }
                alt='user image'
                width={32}
                height={32}
              />

              <p className='font-semibold text-[14px]'>{pin?.postedBy?.name}</p>
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default Pin;
