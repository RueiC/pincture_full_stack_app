import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiLogoutCircleRFill } from 'react-icons/ri';
import { AiFillPlusCircle } from 'react-icons/ai';
import images from '../assets';
import { Session } from 'next-auth/core/types';

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  // eslint-disable-next-line no-unused-vars
  handleSearch: (e: React.FormEvent<HTMLFormElement>, search: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleRegister: (toggle: string) => void;
  handleSignout: () => void;
  session: Session | null;
}

const DesktopNav = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleRegister,
  handleSignout,
  session,
}: Props) => {
  return (
    <>
      <div className='hidden md:flex items-center justify-start gap-[24px] flex-1'>
        <Link href='/'>
          <Image src={images.pin} alt='Logo' width={115} height={53} />
        </Link>
        <form className='w-full' onSubmit={(e) => handleSearch(e, searchTerm)}>
          <input
            className='w-full h-full text-[14px] bg-gray-100 rounded-[10px] px-[24px] py-[12px] outline-none'
            type='text'
            placeholder='搜尋'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <nav className='hidden md:flex items-center justify-end gap-[24px]'>
        {session?.user ? (
          <>
            <Link href={`/user/${session.user.id}`}>
              <img
                className='w-[40px] h-[40px] drop-shadow-xl rounded-full hover:scale-110 duration-200 ease-linear cursor-pointer'
                src={
                  (session?.user?.image as string)
                    ? (session?.user?.image as string)
                    : images.userImage
                }
                alt=''
              />
            </Link>

            <Link href={`/user/${session.user.id}/create-new-pin`} className=''>
              <AiFillPlusCircle className='w-[40px] h-[40px] text-red-500 drop-shadow-xl rounded-full hover:scale-110 duration-200 ease-linear cursor-pointer' />
            </Link>

            <RiLogoutCircleRFill
              className='w-[40px] h-[40px] text-red-500 drop-shadow-xl rounded-full hover:scale-110 duration-200 ease-linear cursor-pointer'
              onClick={handleSignout}
            />
          </>
        ) : (
          <>
            <div
              className='px-[14px] text-red-500 py-[8px] cursor-pointer hover:scale-105 duration-200 ease-linear'
              onClick={() => handleRegister('signin')}
            >
              登入
            </div>
            <div
              className='px-[14px] bg-red-500 text-white py-[8px] rounded-[10px] cursor-pointer hover:scale-105 duration-200 ease-linear'
              onClick={() => handleRegister('signup')}
            >
              註冊
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default DesktopNav;
