import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { SanityImageAssetDocument } from '@sanity/client';
import { FileUploadMessage, SubmitState } from '../../../../types/types';
import { schema } from '../../../../utils/schema';
import { client } from '../../../../utils/sanityClient';
import images from '../../../../assets/index';
import useObjectURL from '../../../../hooks/useObjectURL';

import { SectionWrapper } from '../../../../HoC';
import { BASE_URL, categories } from '../../../../utils/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]';
import { Session } from 'next-auth/core/types';

type FormValues = {
  title: string;
  about: string;
  destination: string;
  category: string;
};

interface Props {
  session: Session;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session?.user) {
    return { props: { session } };
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

const CreateNewPin = ({ session }: Props) => {
  const router = useRouter();
  const [sanityImage, setSanityImage] =
    useState<SanityImageAssetDocument | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileUploadMessage, setFileUploadMessage] = useState<FileUploadMessage>(
    { style: 'text-black', message: '點擊上傳' },
  );
  const [submitState, setSubmitState] = useState<SubmitState>({
    style: 'bg-red-500',
    text: '儲存',
    state: 'none',
  });
  const imagePreview = useObjectURL({ sanityImage, imageFile });

  const handleUploadingMsg = (state: string, payload: string): void => {
    if (state === 'uploading') {
      setFileUploadMessage((prevVal) => {
        return {
          style: prevVal.style,
          message: payload,
        };
      });
    }

    if (state === 'success') {
      setFileUploadMessage({
        style: 'text-green-500 text-medium',
        message: payload,
      });
    }
  };

  const handleImageUploaded = async (file: File): Promise<void> => {
    const uploadedFile = file;

    setImageFile(uploadedFile);
    // uploading asset to sanity
    if (
      file.type === 'image/png' ||
      file.type === 'image/svg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/gif' ||
      file.type === 'image/tiff'
    ) {
      const document = await client.assets.upload('image', uploadedFile, {
        contentType: uploadedFile.type,
        filename: uploadedFile.name,
      });

      handleUploadingMsg('success', document.originalFilename as string);
      setSanityImage(document);
    } else {
      toast('圖片格式錯誤', { type: 'error' });
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    handleUploadingMsg('uploading', '上傳中...');
    const selectedFile: File = e.target.files[0];
    handleImageUploaded(selectedFile);
  };

  const checkSubmit = (values: FormValues): boolean => {
    if (!sanityImage) {
      toast('未上傳圖片', { type: 'error' });
      setFileUploadMessage({
        style: 'text-red-400 text-medium',
        message: '未上傳圖片',
      });
      return false;
    }

    if (
      !values.title ||
      !values.about ||
      !values.destination ||
      !values.category
    ) {
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (
    values: FormValues,
    actions: { resetForm: () => void },
  ): Promise<void> => {
    const isSuccess = checkSubmit(values);

    if (!isSuccess) return;

    setSubmitState({
      style: 'bg-gray-300',
      text: '上傳中',
      state: 'uploading',
    });

    const doc = {
      _type: 'pin',
      title: values.title,
      about: values.about,
      destination: values.destination,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: sanityImage?._id,
        },
      },
      userId: session.user.id,
      postedBy: {
        _type: 'postedBy',
        _ref: session.user.id,
      },
      category: values.category,
    };

    try {
      await axios
        .post(
          `${BASE_URL}/api/user/${session.user.id}/create-new-pin`,
          {
            doc,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((res) => res.data);

      toast('上傳成功!', { type: 'success' });

      setImageFile(null);
      actions.resetForm();

      router.push('/');
    } catch (err) {
      console.log(err);
      toast('上傳失敗', { type: 'error' });
    }

    setSubmitState({
      style: 'bg-red-500',
      text: '儲存',
      state: 'success',
    });
  };

  const formikConfig = {
    initialValues: {
      title: '',
      about: '',
      destination: '',
      category: '',
    },
    validationSchema: schema,
    onSubmit,
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik(formikConfig);

  return (
    <form
      className='flex items-stretch justify-between gap-[36px] w-full h-full flex-col lg:flex-row'
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div
        className={`relative flex justify-center w-full lg:h-auto h-[300px] ${
          sanityImage ? 'items-start' : 'bg-gray-100 items-center'
        } rounded-[10px] hover:scale-105 duration-200 ease-linear`}
      >
        {sanityImage ? (
          <img
            className='w-full rounded-[10px] shadow-lg'
            src={imagePreview}
            alt='uploaded image'
          />
        ) : (
          <div className='flex flex-col items-center'>
            <FaCloudUploadAlt className='text-[24px]' />

            <p className={`text-[18px] ${fileUploadMessage.style}`}>
              {fileUploadMessage.message}
            </p>
          </div>
        )}
        <input
          className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
          type='file'
          name='upload-image'
          autoComplete='off'
          onChange={uploadImage}
        />
      </div>

      <div className='flex flex-col items-start justify-start w-full h-full gap-[48px]'>
        <div className='w-full'>
          <input
            className='outline-none text-[30px] border-gray-200 py-[0.5rem] border-b-2 w-full font-bold font-sans'
            id='title'
            type='text'
            placeholder='新增標題'
            autoComplete='off'
            value={values.title}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p className='text-red-400 text-[0.5rem] font-medium'>
            {errors.title && touched?.title ? errors.title : ''}
          </p>
        </div>

        <div className='w-full'>
          <input
            className='outline-none text-[14px] font-medium font-sans border-gray-200 py-[0.5rem] border-b-2 w-full'
            id='about'
            type='text'
            placeholder='讓所有人知道你的釘圖內容'
            autoComplete='off'
            value={values.about}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p className='text-red-400 text-[0.5rem] font-medium'>
            {errors.about && touched?.about ? errors.about : ''}
          </p>
        </div>

        <div className='flex items-center gap-[14px]'>
          <Image
            className='rounded-full'
            src={
              (session.user.image as string)
                ? (session.user.image as string)
                : images.userImage
            }
            alt='user image'
            width={35}
            height={35}
          />
          <p className='font-medium font-bold text-text-1'>
            {session?.user.name}
          </p>
        </div>

        <div className='w-full'>
          <input
            className='outline-none text-[14px] font-medium border-gray-200 py-[0.5rem] border-b-2 w-full font-sans'
            id='destination'
            type='text'
            placeholder='新增目的地連結'
            autoComplete='off'
            value={values.destination}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <p className='text-red-400 text-[0.5rem] font-medium'>
            {errors.destination && touched?.destination
              ? errors.destination
              : ''}
          </p>
        </div>

        <div className='flex flex-col gap-[12px]'>
          <label className='text-[14px] font-medium font-sans'>選擇標籤</label>
          <select
            className='outline-none w-[10rem] text-base border-gray-200 px-[1rem] py-[0.5rem] rounded-[0.5rem] text-[14px] cursor-pointer shadow-md text-text-1 font-medium font-sans'
            id='category'
            value={values.category}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option className='bg-white' value=''>
              無
            </option>
            {categories.map((item) => (
              <option
                className='text-base text-black capitalize bg-white border-0 outline-none'
                value={item.name}
                key={item.name}
              >
                {item.name}
              </option>
            ))}
          </select>
          <p className='text-red-400 text-[0.5rem] font-medium mt-[1rem]'>
            {errors.category && touched?.category ? errors.category : ''}
          </p>
        </div>

        <button
          className={`w-full ${submitState.style} px-[28px] py-[18px] rounded-[10px] text-white hover:scale-105 duration-200 ease-linear font-medium font-sans`}
          type='submit'
          disabled={submitState.state === 'uploading' ? true : false}
        >
          {submitState.text}
        </button>
      </div>
    </form>
  );
};

export default SectionWrapper(CreateNewPin, 'createNewPin');
