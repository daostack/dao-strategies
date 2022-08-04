import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ChainsDetails } from '@dao-strategies/core';

import { LoggedUserContext } from './hooks/useLoggedUser';
import { GlobalStyles } from './components/styles/GlobalStyles';
import { ErrorContext } from './hooks/useErrorContext';
import { ThemedApp } from './ThemedApp';

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
            <ThemedApp></ThemedApp>
          </LoggedUserContext>
        </WagmiConfig>
      </ErrorContext>
    </div>
  );
}

export default App;
