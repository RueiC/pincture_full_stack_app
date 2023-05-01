import { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RiLogoutCircleRFill } from 'react-icons/ri';
import {
  AiFillPlusCircle,
  AiOutlineMenu,
  AiFillCloseCircle,
} from 'react-icons/ai';

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
  session,
  handleSignout,
}: Props) => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <>
      <div className='md:hidden flex items-center justify-between gap-[24px] flex-1'>
        <Link href='/'>
          <Image src={images.pin} alt='Logo' width={115} height={53} />
        </Link>

        <nav className='md:hidden'>
          {toggleMenu ? (
            <div className='fixed top-0 left-0 z-50 flex py-[100px] gap-[24px] flex-col items-center w-screen h-screen bg-white'>
              <Link href='/'>
                <Image src={images.pin} alt='Logo' width={115} height={53} />
              </Link>
              {session?.user ? (
                <>
                  <form
                    className='relative'
                    onSubmit={(e) => handleSearch(e, searchTerm)}
                  >
                    <input
                      className='w-full h-full text-[14px] bg-gray-100 rounded-[10px] px-[24px] py-[12px] outline-none'
                      type='text'
                      placeholder='搜尋'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>

                  <div className='flex flex-col items-start gap-[14px]'>
                    <Link
                      className='flex items-center gap-[14px] hover:scale-110 duration-200 ease-linear cursor-pointer'
                      href={`/user/${session.user.id}`}
                    >
                      <img
                        className='w-[34px] h-[34px] drop-shadow-xl rounded-full'
                        src={
                          (session?.user?.image as string)
                            ? (session?.user?.image as string)
                            : images.userImage
                        }
                        alt=''
                      />
                      <p className='text-[16px]'>{session.user.name}</p>
                    </Link>

                    <Link
                      className='flex items-center gap-[14px] hover:scale-110 duration-200 ease-linear cursor-pointer'
                      href={`/user/${session.user.id}/create-new-pin`}
                    >
                      <AiFillPlusCircle className='w-[34px] h-[34px] text-red-500 drop-shadow-xl rounded-full' />
                      <p className='text-[16px]'>新增 Pin</p>
                    </Link>

                    <div
                      className='flex items-center gap-[14px] hover:scale-110 duration-200 ease-linear cursor-pointer'
                      onClick={handleSignout}
                    >
                      <RiLogoutCircleRFill className='w-[34px] h-[34px] text-red-500 drop-shadow-xl rounded-full' />
                      <p className='text-[16px]'>登出</p>
                    </div>
                  </div>
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

              <AiFillCloseCircle
                className='absolute top-[10px] right-[10px] text-[50px] p-[10px] text-red-500 cursor-pointer hover:scale-105 duration-200 ease-linear'
                onClick={() => setToggleMenu(false)}
              />
            </div>
          ) : (
            <AiOutlineMenu
              className='text-[36px] bg-red-500 text-white p-[10px] rounded-full cursor-pointer hover:scale-110 duration-200 ease-linear'
              onClick={() => setToggleMenu(true)}
            />
          )}
        </nav>
      </div>
    </>
  );
};

export default DesktopNav;
