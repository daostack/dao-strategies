import { Provider, createClient } from 'wagmi';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';

import './App.css';
import { LoggedUserContext } from './hooks/useLoggedUser';
import { MainPage } from './pages/MainPage';

const themes = {
  dark: './dark-theme.css',
  light: './light-theme.css',
};

const client = createClient();

function App() {
  return (
    <div className="App">
      <Provider client={client}>
        <LoggedUserContext>
          <ThemeSwitcherProvider themeMap={themes} defaultTheme={'dark'}>
            <MainPage></MainPage>
          </ThemeSwitcherProvider>
        </LoggedUserContext>
      </Provider>
    </div>
  );
}

export default App;
