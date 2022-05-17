import { useEthersContext } from 'eth-hooks/context';
import { asEthersAdaptor } from 'eth-hooks/functions';
import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { useLoggedUser } from './components/common/hooks/useLoggedUser';
import { MainPageFooter, MainPageHeader } from './components/main';

import '~~/styles/main-page.css';
import { useScaffoldProviders as useScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';
import { CampaignCreate, CampaignPage, CampaignsList } from '~~/components/pages';
import { useConnectAppContracts, useLoadAppContracts } from '~~/config/contractContext';

/**
 * The main component
 * @returns
 */
export const Main: FC = () => {
  useScaffoldAppProviders();

  const ethersContext = useEthersContext();

  ethersContext.connector?.on('accontsChanged', () => {
    console.log('omg');
  });

  useLoadAppContracts();
  useConnectAppContracts(asEthersAdaptor(ethersContext));

  const loggedUser = useLoggedUser();
  console.log({ loggedUser });

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <MainPageHeader />

        {/* Routes should be added between the <Switch> </Switch> as seen below */}
        <BrowserRouter>
          <Switch>
            <Route path="/campaign/:campaignAddress">
              <CampaignPage />
            </Route>
            <Route exact path="/create">
              <CampaignCreate />
            </Route>
            <Route path="/">
              <CampaignsList />
            </Route>
          </Switch>
        </BrowserRouter>

        <MainPageFooter />
      </div>
    </QueryClientProvider>
  );
};
