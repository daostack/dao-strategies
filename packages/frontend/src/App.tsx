import { WagmiConfig, createClient, defaultChains, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { Grommet } from 'grommet';

import { LoggedUserContext } from './hooks/useLoggedUser';
import { MainPage } from './pages/MainPage';
import { GlobalStyles } from './components/styles/GlobalStyles';
import { theme } from './components/styles/themes';

const { provider } = configureChains(defaultChains, [publicProvider()]);
const client = createClient({ provider });

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <LoggedUserContext>
          <GlobalStyles />
          <Grommet theme={theme}>
            <MainPage></MainPage>
          </Grommet>
        </LoggedUserContext>
      </WagmiConfig>
    </div>
  );
}

export default App;
