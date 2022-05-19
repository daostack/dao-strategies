import { Provider, createClient } from 'wagmi';

import './App.css';
import { LoggedUserContext } from './hooks/useLoggedUser';
import { MainPage } from './pages/MainPage';


const client = createClient()

function App() {
  return (
    <div className="App">
      <Provider client={client}>
        <LoggedUserContext>
          <MainPage></MainPage>
        </LoggedUserContext>
      </Provider>
    </div>
  );
}

export default App;
