import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCampaign } from '../../hooks/useCampaign';
import { RouteNames } from '../MainPage';

export interface ICampaignPageProps {
  dum?: any;
}

type RouteParams = {
  campaignAddress: string;
};

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const params = useParams<RouteParams>();
  const { isLoading, campaign } = useCampaign(params.campaignAddress);
  return (
    <>
      <Link to={RouteNames.Base}>Back</Link>
      <h1>Campaign {params.campaignAddress} Home</h1>
      {isLoading ? <>loading...</> : <>{campaign ? JSON.stringify(campaign) : 'undefined'}</>}
    </>
  );
};
