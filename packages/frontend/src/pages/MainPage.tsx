import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CampaignPage } from './campaign/CampaignPage';
import { CampaignCreate } from './create/CampaignCreate';
import { CampaignsList } from './list/CampaignsList';
import { MainPageFooter } from './MainPageFooter';

import { MainPageHeader } from './MainPageHeader';

const queryClient = new QueryClient();

export const MainPage: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MainPageHeader></MainPageHeader>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CampaignsList />}></Route>
          <Route path="/create" element={<CampaignCreate />}></Route>
          <Route path="/campaign/:campaignAddress" element={<CampaignPage />}></Route>
        </Routes>
      </BrowserRouter>
      <MainPageFooter></MainPageFooter>
    </QueryClientProvider>
  );
};
