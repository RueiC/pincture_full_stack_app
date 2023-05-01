import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { AiFillDelete } from 'react-icons/ai';
import moment from 'moment';

import image from '../assets/index';
import { CommentType, DeletedItem } from '../types/types';
import { Session } from 'next-auth/core/types';

interface CommentProps {
  pinId: string;
  comment: CommentType;
  session: Session | null;
  setDeletedItem: Dispatch<SetStateAction<DeletedItem | null>>;
}

const Comment = ({ pinId, comment, setDeletedItem, session }: CommentProps) => {
  return (
    <div
      className='flex items-center justify-between gap-[1rem] bg-white rounded-[0.5rem]'
      key={comment._key}
    >
      <div className='flex items-center gap-[14px]'>
        <Image
          src={
            comment?.postedBy?.image ? comment.postedBy.image : image.userImage
          }
          className='rounded-full cursor-pointer'
          alt='user image'
          width={34}
          height={34}
        />
        <div className='flex flex-col gap-[4px]'>
          <div className='flex items-end justify-start gap-[8px]'>
            <p className='font-medium cursor-pointer text-[14px] text-text-2'>
              {comment.postedBy.name}
            </p>
            <span className='text-[10px] opacity-50'>
              {moment(comment.createdAt).format('YY-MM-DD')}
            </span>
          </div>
          <p className='text-[14px] text-text-2'>{comment.comment}</p>
        </div>
      </div>

      {session?.user?.id === comment.postedBy._id ? (
        <div
          className='flex items-center justify-center bg-red-500 p-[0.5rem] opacity-80 rounded-full hover:scale-105 hover:opacity-100 duration-200 ease-linear cursor-pointer'
          onClick={() =>
            setDeletedItem({ type: 'comment', pinId, commentKey: comment._key })
          }
        >
          <AiFillDelete className='text-white' />
        </div>
      ) : null}
    </div>
  );
};

export default Comment;
