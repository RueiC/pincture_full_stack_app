import { useState } from 'react';
import { useRouter } from 'next/router';

import { SectionWrapper } from '../HoC';
import { MobileNav, DesktopNav } from './index';
import { useSession, signOut } from 'next-auth/react';
import { useStateContext } from '../store/stateContext';

const NavBar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { setInSignInForm } = useStateContext();

  const handleRegister = (toggle: string): void => {
    if (toggle === 'signin') {
      setInSignInForm(true);
    }
    if (toggle === 'signup') {
      setInSignInForm(false);
    }

    router.push('/register');
  };

  const handleSignout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement>,
    search: string,
  ): void => {
    e.preventDefault();
    if (search !== '') {
      router.push(`/search/${search}`);
      setSearchTerm('');
    }
  };

  return (
    <header className='relative w-full h-full flex lg:items-center justify-between gap-[24px]'>
      <DesktopNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleRegister={handleRegister}
        handleSignout={handleSignout}
        session={session}
      />
      <MobileNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleRegister={handleRegister}
        handleSignout={handleSignout}
        session={session}
      />
    </header>
  );
};

export default SectionWrapper(NavBar, 'navBar');
