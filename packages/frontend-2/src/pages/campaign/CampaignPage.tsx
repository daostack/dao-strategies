import { FC } from 'react';
import { Link, useParams } from 'react-router-dom';

export interface ICampaignPageProps {
  dum?: any;
}

type RouteParams = {
  campaignAddress: string;
};

export const CampaignPage: FC<ICampaignPageProps> = () => {
  const params = useParams<RouteParams>();
  return (
    <>
      <Link to="/">Back</Link>
      <h1>Campaign {params.campaignAddress} Home</h1>
      <br></br>
      <br></br>
    </>
  );
};
