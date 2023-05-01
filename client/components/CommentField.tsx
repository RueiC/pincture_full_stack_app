import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';

import { CommentType } from '../types/types';
import images from '../assets/index';
import { Comment } from './index';
import { useStateContext } from '../store/stateContext';
import { BASE_URL, stateMsgTemplate } from '../utils/data';
import axios from 'axios';
import { Session } from 'next-auth/core/types';

interface Props {
  pinId: string;
  session: Session | null;
  comments: CommentType[] | null;
}

const CommentField = ({ pinId, comments, session }: Props) => {
  const { setDeletedItem, askFetchData, setAskFetchData } = useStateContext();
  const [commentInput, setCommentInput] = useState<string>('');
  const [commentsData, setCommentsData] = useState<CommentType[] | null>(
    comments,
  );
  const [submitState, setSubmitState] = useState({
    style: 'bg-red-500',
    text: '確定',
    state: 'default',
  });

  useEffect(() => {
    if (askFetchData.state === true && askFetchData.type === 'comment') {
      fetchComments();

      setAskFetchData({ state: false, type: null });
    }
  }, [askFetchData]);

  const fetchComments = async () => {
    try {
      const response = await axios
        .get(`${BASE_URL}/api/pins/${pinId}/get-comment`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.data);

      setCommentsData(response.comments);
      setAskFetchData({ type: '', state: false });
    } catch (error: any) {
      console.log(error);
    }
  };

  const addComment = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!session?.user) return;

    try {
      if (commentInput === '') {
        toast('請輸入內容', { type: 'error' });
        throw new Error('請輸入內容');
      }

      setSubmitState({
        style: stateMsgTemplate.style.gray,
        text: stateMsgTemplate.text.handling,
        state: stateMsgTemplate.state.handling,
      });

      const commentData = {
        comment: commentInput,
        createdAt: new Date().toISOString(),
        _key: uuid(),
        postedBy: {
          _type: 'postedBy',
          _ref: session.user.id,
        },
      };

      await axios.patch(
        `${BASE_URL}/api/pins/${pinId}/add-comment`,
        {
          commentData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      await fetchComments();
      setCommentInput('');

      setSubmitState({
        style: stateMsgTemplate.style.red,
        text: stateMsgTemplate.text.default,
        state: stateMsgTemplate.state.default,
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      {commentsData !== null
        ? commentsData.map((comment) => (
            <Comment
              key={comment._key}
              pinId={pinId}
              comment={comment}
              setDeletedItem={setDeletedItem}
              session={session}
            />
          ))
        : null}

      {session?.user ? (
        <form
          className='flex items-center gap-[14px] w-full'
          onSubmit={addComment}
        >
          <Image
            className='rounded-full'
            src={images.userImage}
            alt='user image'
            width={40}
            height={40}
          />

          <input
            className='border-2 border-gray-100 rounded-[1rem] px-[18px] py-[12px] w-full flex-1 outline-none'
            value={commentInput}
            type='text'
            placeholder='新增留言'
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            className={`${submitState.style} text-white rounded-[10px] px-[28px] py-[10px] font-semibold text-base outline-none hover:scale-105 transition-all duration-300 ease-in-out text-[14px]`}
            type='submit'
            disabled={submitState.state === 'handling' ? true : false}
          >
            {submitState.text}
          </button>
        </form>
      ) : null}
    </>
  );
};

export default CommentField;
