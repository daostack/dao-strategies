import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { IElement } from '../../components/styles/BasicElements';
import { CampaignContext } from '../../hooks/useCampaign';
import { CampaignPage } from './CampaignPage';

type RouteParams = {
  campaignAddress: string;
};

export const CampaignContextW: FC<IElement> = (props: IElement) => {
  const params = useParams<RouteParams>();
  return (
    <CampaignContext address={params.campaignAddress}>
      <CampaignPage></CampaignPage>
    </CampaignContext>
  );
};
