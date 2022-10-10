import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ChainsDetails } from '@dao-strategies/core';

import { LoggedUserContext } from './hooks/useLoggedUser';
import { GlobalStyles } from './components/styles/GlobalStyles';
import { ErrorContext } from './hooks/useErrorContext';
import { ThemedApp } from './ThemedApp';
import { ALCHEMY_GOERLI_KEY } from './config/appConfig';
import { NowContext } from './hooks/useNow';

export const LOCALHOST_CHAIN_ID = 3177;

const { provider } = configureChains(ChainsDetails.chains(), [
  publicProvider(),
  alchemyProvider({ apiKey: ALCHEMY_GOERLI_KEY }),
]);

const client = createClient({ provider });

function App() {
  return (
    <div className="App">
      <ErrorContext>
        <WagmiConfig client={client}>
          <NowContext>
            <LoggedUserContext>
              <GlobalStyles />
              <ThemedApp></ThemedApp>
            </LoggedUserContext>
          </NowContext>
        </WagmiConfig>
      </ErrorContext>
    </div>
  );
}

export default App;
