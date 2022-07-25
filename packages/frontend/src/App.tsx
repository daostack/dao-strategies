import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ChainsDetails } from '@dao-strategies/core';

import { Grommet } from 'grommet';

import { LoggedUserContext } from './hooks/useLoggedUser';
import { MainPage } from './pages/MainPage';
import { GlobalStyles } from './components/styles/GlobalStyles';
import { theme } from './components/styles/themes';
import { ErrorContext } from './hooks/useErrorContext';

export const LOCALHOST_CHAIN_ID = 3177;

const { provider } = configureChains(ChainsDetails.chains(), [publicProvider()]);
const client = createClient({ provider });

function App() {
  return (
    <div className="App">
      <ErrorContext>
        <WagmiConfig client={client}>
          <LoggedUserContext>
            <GlobalStyles />
            <Grommet theme={theme}>
              <MainPage></MainPage>
            </Grommet>
          </LoggedUserContext>
        </WagmiConfig>
      </ErrorContext>
    </div>
  );
}

export default App;
