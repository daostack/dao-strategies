import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CampaignPage } from './campaign/CampaignPage';
import { CampaignCreate } from './create/CampaignCreate';
import { LandingPage } from './landing/LandingPage';
import { MainPageFooter } from './MainPageFooter';

import { UserProfile } from './user/UserProfile';

const queryClient = new QueryClient();

export const RouteNames = {
  Base: `/`,
  Create: `/create`,
  CampaignBase: `/campaign`,
  Campaign: (address: string) => `/campaign/${address}`,
  Profile: `/profile`,
};

export const MainPage: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={RouteNames.Base} element={<LandingPage />}></Route>
          <Route path={RouteNames.Create} element={<CampaignCreate />}></Route>
          <Route path={`${RouteNames.Base}/:campaignAddress`} element={<CampaignPage />}></Route>
          <Route path={RouteNames.Profile} element={<UserProfile />}></Route>
        </Routes>
        <MainPageFooter></MainPageFooter>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
