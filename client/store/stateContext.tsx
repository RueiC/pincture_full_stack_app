/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from 'react';
import type { DeletedItem } from '../types/types';

interface pinsDataHook {
  isLoading: boolean;
  setIsLoading: Dispatch<React.SetStateAction<boolean>>;
  inSignInForm: boolean;
  deletedItem: DeletedItem | null;
  toggleDeleteWindow: boolean;
  askFetchData: { type: string | null; state: boolean };
  setAskFetchData: Dispatch<
    React.SetStateAction<{
      type: any;
      state: boolean;
    }>
  >;
  setInSignInForm: Dispatch<SetStateAction<boolean>>;
  setDeletedItem: Dispatch<SetStateAction<DeletedItem | null>>;
  setToggleDeleteWindow: Dispatch<SetStateAction<boolean>>;
}

const Context = createContext({} as pinsDataHook);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inSignInForm, setInSignInForm] = useState<boolean>(false);
  const [deletedItem, setDeletedItem] = useState<DeletedItem | null>(null);
  const [toggleDeleteWindow, setToggleDeleteWindow] = useState<boolean>(false);
  const [askFetchData, setAskFetchData] = useState({
    type: null,
    state: false,
  });

  useEffect(() => {
    if (deletedItem) setToggleDeleteWindow(true);
    if (!deletedItem) setToggleDeleteWindow(false);
  }, [deletedItem]);

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        inSignInForm,
        setInSignInForm,
        deletedItem,
        setDeletedItem,
        toggleDeleteWindow,
        setToggleDeleteWindow,
        askFetchData,
        setAskFetchData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
