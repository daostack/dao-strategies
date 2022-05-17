import { EthComponentsSettingsContext, IEthComponentsSettings } from 'eth-components/models';
import { EthersAppContext } from 'eth-hooks/context';
import { lazier } from 'eth-hooks/helpers';
import { FC, Suspense } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';

import { ErrorBoundary, ErrorFallback } from '~~/components/common/ErrorFallback';
import { LoggedUserContext } from '~~/components/common/hooks/useLoggedUser';
import { ContractsAppContext } from '~~/config/contractContext';

import '~~/styles/css/tailwind-base.pcss';
import '~~/styles/css/tailwind-components.pcss';
import '~~/styles/css/tailwind-utilities.pcss';
import '~~/styles/css/app.css';

console.log('init app...');

const BLOCKNATIVE_DAPPID = import.meta.env.VITE_KEY_BLOCKNATIVE_DAPPID;

const savedTheme = window.localStorage.getItem('theme');

const themes = {
  dark: './dark-theme.css',
  light: './light-theme.css',
};

const ethComponentsSettings: IEthComponentsSettings = {
  apiKeys: {
    BlocknativeDappId: BLOCKNATIVE_DAPPID,
  },
};

const MainPage = lazier(() => import('./MainPage'), 'Main');

const App: FC = () => {
  console.log('loading app...');
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <EthComponentsSettingsContext.Provider value={ethComponentsSettings}>
        <ContractsAppContext>
          <EthersAppContext>
            <LoggedUserContext>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <ThemeSwitcherProvider themeMap={themes} defaultTheme={savedTheme || 'dark'}>
                  <Suspense fallback={<div />}>
                    <MainPage />
                  </Suspense>
                </ThemeSwitcherProvider>
              </ErrorBoundary>
            </LoggedUserContext>
          </EthersAppContext>
        </ContractsAppContext>
      </EthComponentsSettingsContext.Provider>
    </ErrorBoundary>
  );
};

export default App;
