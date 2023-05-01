import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import validator from 'validator';
import { signIn } from 'next-auth/react';
import { useStateContext } from '../store/stateContext';
import images from '../assets/index';
import { toast } from 'react-toastify';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { inSignInForm, setInSignInForm } = useStateContext();

  const validateForm = () => {
    try {
      if (!validator.isEmail(email)) {
        throw new Error('請輸入有效的電子郵件地址');
      }

      if (password.length < 8) {
        throw new Error('密碼必須至少包含8個字符');
      }

      if (!email || !password) {
        throw new Error('請填入完整資料');
      }
    } catch (error: any) {
      console.error(error.message);
      toast(error.message, { type: 'error' });
    }
  };

  async function loginUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      validateForm();

      const credentialsConfig = {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      };

      const response = await signIn('credentials', credentialsConfig);

      if (response!.ok) router.push('/');
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <form
      className={`flex flex-col w-full h-full gap-[48px] transition-all duration-500 ease-in-out lg:pl-[100px] lg:pr-[50px] ${
        inSignInForm
          ? 'lg:translate-x-0 lg:translate-y-0 -translate-y-[100%] opacity-100'
          : 'lg:translate-x-[100%] translate-y-0 opacity-0 pointer-events-none'
      }`}
      noValidate
      onSubmit={loginUser}
    >
      <img className='w-[115px] h-[53px]' src={images.pin} alt='logo' />

      <div>
        <p className='text-[30px] font-bold mb-[14px]'>歡迎回來！</p>
        <div className='text-[10px]'>
          <span className='opacity-50'>還沒註冊嗎？ </span>
          <span
            className='cursor-pointer'
            onClick={() => setInSignInForm(false)}
          >
            註冊
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-[36px]'>
        <div>
          <input
            className='appearance-none bg-transparent w-full py-[12px] leading-tight focus:outline-none border-b-[0.5px] text-[14px]'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Email'
          />
          <p className='text-red-400'>
            {/* {errors.email && touched?.email ? errors.email : ''} */}
          </p>
        </div>
        <div>
          <input
            className='appearance-none bg-transparent w-full py-[12px] leading-tight focus:outline-none border-b-[0.5px] text-[14px]'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='Password'
          />
          <p className='text-red-400'>
            {/* {errors.password && touched?.password ? errors.password : ''} */}
          </p>
        </div>
        <button
          className='bg-blue-gradient w-full rounded-[10px] py-[18px] bg-red-500 text-white hover:scale-105 transition-all duration-300 ease-in-out text-[14px]'
          type='submit'
        >
          登入
        </button>

        <div className='text-[10px]'>
          <span className='opacity-50'>忘記你的帳號密碼嗎？ </span>
          <span className='cursor-pointer'>取得協助</span>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
