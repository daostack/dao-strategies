import { Provider, createClient } from 'wagmi';
import { Grommet } from 'grommet';

import { LoggedUserContext } from './hooks/useLoggedUser';
import { MainPage } from './pages/MainPage';
import { GlobalStyles } from './components/styles/GlobalStyles';
import { theme } from './components/styles/themes';

const client = createClient();

function App() {
  return (
    <div className="App">
      <Provider client={client}>
        <LoggedUserContext>
          <GlobalStyles />
          <Grommet theme={theme}>
            <MainPage></MainPage>
          </Grommet>
        </LoggedUserContext>
      </Provider>
    </div>
  );
}

export default App;
