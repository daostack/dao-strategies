import { Box, Layer } from 'grommet';
import { ReactNode, createContext, useContext, FC, useState } from 'react';

export type LoggedUserContextType = {
  showError: (message: string, stack?: any) => void;
};

const ErrorContextValue = createContext<LoggedUserContextType | undefined>(undefined);

export interface ErrorContextProps {
  children: ReactNode;
}

export const ErrorContext: FC<ErrorContextProps> = (props) => {
  const [error, setError] = useState<{ message: string; forceReload: boolean } | undefined>(undefined);

  const hasError = error !== undefined;

  const showError = async (message: string, forceReload: boolean = false) => {
    setError({ message, forceReload });
  };

  const errorWindow = hasError ? (
    <Layer onClickOutside={() => setError(undefined)}>
      <Box pad="medium">
        {error.message}
        {error.forceReload ? <a href="/">reload</a> : <></>}
      </Box>
    </Layer>
  ) : (
    <></>
  );
  return (
    <ErrorContextValue.Provider value={{ showError }}>
      {errorWindow}
      {props.children}
    </ErrorContextValue.Provider>
  );
};

export function useUserError(): LoggedUserContextType {
  const context = useContext(ErrorContextValue);
  if (!context) throw Error('ErrorContextValue');
  return context;
}
