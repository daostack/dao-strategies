import { Provider, createClient } from 'wagmi';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { ThemeProvider } from 'styled-components';

import { LoggedUserContext } from './hooks/useLoggedUser';
import { MainPage } from './pages/MainPage';
import { GlobalStyles } from './components/styles/GlobalStyles';

const theme = {
  colors: {
    body: '#ffffff',
  },
};

const client = createClient();

function App() {
  return (
    <div className="App">
      <Provider client={client}>
        <LoggedUserContext>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <MainPage></MainPage>
          </ThemeProvider>
        </LoggedUserContext>
      </Provider>
    </div>
  );
}

export default App;
