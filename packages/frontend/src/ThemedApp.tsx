import { ThemeType, Grommet } from 'grommet';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { darkTheme, lightTheme } from './components/styles/themes';
import { MainPage } from './pages/MainPage';

export type ThemeContextType = {
  theme: ThemeType;
  setTheme: (dark: boolean) => void;
};

export interface ThemeContextProps {
  dum?: string;
}

const ThemeContextValue = createContext<ThemeContextType | undefined>(undefined);

export const ThemedApp: FC<ThemeContextProps> = (props: ThemeContextProps) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const theme = isDark ? darkTheme : lightTheme;

  const setTheme = (dark: boolean): void => {
    setIsDark(dark);
  };

  return (
    <ThemeContextValue.Provider value={{ theme, setTheme }}>
      <Grommet style={{ minHeight: '100vh' }} theme={theme}>
        <MainPage></MainPage>
      </Grommet>
    </ThemeContextValue.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContextValue);
  if (!context) throw Error('useThemeContext can only be used within the CampaignContext component');
  return context;
};
