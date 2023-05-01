import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import { useStateContext } from '../store/stateContext';
import images from '../assets/index';
import { BASE_URL } from '../utils/data';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [name, setName] = useState('');
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

      if (!name || !email || !password) {
        throw new Error('請填入完整資料');
      }
    } catch (error: any) {
      console.error(error.message);
      toast(error.message, { type: 'error' });
    }
  };

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      validateForm();
      const user = { name, email, password };

      const response = await axios.post(
        `${BASE_URL}/api/register/signup`,
        user,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        setInSignInForm(true);
      } else {
        toast(response.data.message, { type: 'error' });
      }
    } catch (error: any) {
      console.error(error.message);
      toast('此帳號已被註冊', { type: 'error' });
    }
  };

  return (
    <form
      className={`flex flex-col w-full h-full gap-[48px] transition-all duration-300 ease-in-out lg:pl-[50px] lg:pr-[100px] ${
        inSignInForm
          ? 'lg:-translate-x-[100%] lg:translate-y-0 translate-y-[100%] opacity-0 pointer-events-none'
          : 'opacity-100'
      }`}
      noValidate
      onSubmit={registerUser}
    >
      <img className='w-[115px] h-[53px]' src={images.pin} alt='logo' />

      <div>
        <p className='text-[30px] font-bold mb-[14px] font-sans'>歡迎加入！</p>
        <div className='text-[10px]'>
          <span className='font-sans opacity-50 font-regular'>
            已經註冊了嗎？{' '}
          </span>
          <span
            className='font-sans font-bold cursor-pointer'
            onClick={() => setInSignInForm(true)}
          >
            登入
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-[36px]'>
        <div>
          <input
            className='appearance-none bg-transparent w-full py-[12px] leading-tight focus:outline-none border-b-[0.5px] text-[14px] font-medium font-sans'
            value={name}
            onChange={(e) => setName(e.target.value)}
            type='text'
            placeholder='暱稱'
          />
          <p className='text-red-400'>
            {/* {errors.name && touched?.name ? errors.name : ''} */}
          </p>
        </div>
        <div>
          <input
            className='appearance-none bg-transparent w-full py-[12px] leading-tight focus:outline-none border-b-[0.5px] text-[14px] font-medium font-sans'
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
            className='appearance-none bg-transparent w-full py-[12px] leading-tight focus:outline-none border-b-[0.5px] text-[14px] font-medium font-sans'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='密碼'
          />
          <p className='text-red-400'>
            {/* {errors.password && touched?.password ? errors.password : ''} */}
          </p>
        </div>
        <button className='bg-blue-gradient w-full rounded-[10px] py-[18px] bg-red-500 text-white hover:scale-105 transition-all duration-300 ease-in-out text-[14px] font-medium font-sans'>
          註冊
        </button>

        <div className='text-[10px]'>
          <span className='font-sans opacity-50 font-regular'>
            如果你註冊帳號，表示你同意我們的{' '}
          </span>
          <span className='font-sans font-bold cursor-pointer'>服務條款</span>
          <span className='font-sans opacity-50 font-regular'> 及 </span>
          <span className='font-sans font-bold cursor-pointer'>隱私政策</span>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
