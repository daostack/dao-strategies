import { ResponsiveContext } from 'grommet';
import { createContext, CSSProperties, FC, useCallback, useContext } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { parseCssUnits } from '../utils/general';
import { AppHeader } from './AppHeader';
import { CampaignContextW } from './campaign/CampaignContext';
import { CampaignCreate } from './create/CampaignCreate';
import { CampaignsExplorer } from './landing/CampaignsExplorer';
import { LandingPage } from './landing/LandingPage';

export type MainPageContextType = {
  mobile: boolean;
  scaleText: (textSize: string) => string;
  responsiveStyle: (config: ResponsiveStyleConfig) => CSSProperties;
};

export type ResponsiveStylePoint = string[] | string;
export type ResponsiveStyleValue = [ResponsiveStylePoint, CSSProperties];
export type ResponsiveStyleConfig = ResponsiveStyleValue[] | CSSProperties;

const MainContext = createContext<MainPageContextType | undefined>(undefined);

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
  const size = useContext(ResponsiveContext);
  const mobile = size.includes('small');

  const scaleText = useCallback(
    (textSize: string) => {
      const scale = (() => {
        switch (size) {
          case 'xsmall':
            return 0.4;
          case 'small':
            return 0.6;
          case 'medium':
            return 0.8;
          case 'large':
            return 1.0;
          default:
            return 1.0;
        }
      })();

      const [value, units] = parseCssUnits(textSize);
      return `${value * scale}${units}`;
    },
    [size]
  );

  const responsiveStyle = useCallback(
    (config: ResponsiveStyleConfig): CSSProperties => {
      if (config instanceof Array) {
        const found = config.find(([point, _]) => {
          return typeof point === 'string' ? point === size : point.includes(size);
        });
        return found ? found[1] : {};
      } else {
        // default will only return the style on mobile
        return mobile ? config : {};
      }
    },
    [size, mobile]
  );

  return (
    <MainContext.Provider value={{ mobile, scaleText, responsiveStyle }}>
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
    </MainContext.Provider>
  );
};

export function useMainContext(): MainPageContextType {
  const context = useContext(MainContext);
  if (!context) throw Error('useMainContext can only be used within the MainPageProvider component');
  return context;
}
