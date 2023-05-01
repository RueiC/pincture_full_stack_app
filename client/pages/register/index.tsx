import React from 'react';

import { SectionWrapper } from '../../HoC';
import { SignUp, SignIn } from '../../components/index';
// import { Lamp } from '../../components/canvas/index';
import images from '../../assets/index';
import { useStateContext } from '../../store/stateContext';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};

const Register = () => {
  const { inSignInForm } = useStateContext();

  return (
    <div className='flex items-center justify-center overflow-hidden lg:shadow-xl rounded-[20px]'>
      <div className='relative lg:flex-row flex-col-reverse flex items-center justify-center lg:py-[52px] w-full bg-white overflow-hidden'>
        <div
          className={`lg:flex hidden absolute w-[50%] top-0 left-0 flex-col items-center justify-center gap-[30px] transition-all px-[60px] h-full duration-500 ease-in-out pointer-events-none ${
            inSignInForm ? 'translate-x-[100%]' : 'translate-x-0'
          }`}
        >
          <img className='object-cover' src={images.people} alt='image' />
          {/* <Lamp/> */}

          {/* <div className='flex items-center justify-center'>
            <p className='text-[25px]'>收藏你的靈感！</p>
          </div> */}
        </div>

        <SignIn />
        <SignUp />
      </div>
    </div>
  );
};

export default SectionWrapper(Register, 'register');
