import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { CampaignContextW } from './campaign/CampaignContext';
import { CampaignCreate } from './create/CampaignCreate';
import { CampaignsExplorer } from './landing/CampaignsExplorer';
import { LandingPage } from './landing/LandingPage';
import { MainPageFooter } from './MainPageFooter';

const queryClient = new QueryClient();

export const RouteNames = {
  Base: `/`,
  Create: `/create`,
  Campaigns: `/campaigns`,
  CampaignBase: `/campaign`,
  Campaign: (address: string) => `/campaign/${address}`,
  Profile: `/profile`,
};

export const MainPage: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppHeader></AppHeader>
        <Routes>
          <Route path={RouteNames.Base} element={<LandingPage />}></Route>
          <Route path={RouteNames.Campaigns} element={<CampaignsExplorer />}></Route>
          <Route path={RouteNames.Create} element={<CampaignCreate />}></Route>
          <Route path={`${RouteNames.CampaignBase}/:campaignAddress`} element={<CampaignContextW />}></Route>
        </Routes>
        {/* <MainPageFooter></MainPageFooter> */}
      </BrowserRouter>
    </QueryClientProvider>
  );
};
