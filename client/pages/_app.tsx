import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { NavBar } from '../components/index';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import { StateProvider } from '../store/stateContext';

interface CustomAppProps extends AppProps {
  session: any;
}

const MyApp = ({ Component, pageProps, router, session }: CustomAppProps) => {
  const [isSSR, setIsSSR] = useState<boolean>(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <SessionProvider session={session}>
      <StateProvider>
        <ToastContainer
          position='top-center'
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />

        <div className='relative flex flex-col items-center'>
          {router.pathname !== '/register' ? <NavBar /> : null}
          <Component {...pageProps} />
        </div>
      </StateProvider>
    </SessionProvider>
  );
};
export default MyApp;
