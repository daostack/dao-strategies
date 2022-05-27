import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useSigner } from 'wagmi';

import { useCampaigns } from '../../hooks/campaigns.queries';

export interface ICampaignListProps {
  dum?: any;
}

export const CampaignsList: FC<ICampaignListProps> = (props: ICampaignListProps) => {
  const { data: signer } = useSigner();
  const { isLoading, campaigns } = useCampaigns();

  // console.log({ isLoading, campaigns });

  return (
    <>
      {signer ? (
        <>
          <Link to="./create">Create</Link>
        </>
      ) : (
        <></>
      )}
      <h1>Campaigns:</h1>
      {campaigns ? (
        campaigns.map((campaign: any) => {
          return (
            <div key={campaign.id}>
              <Link to={`/campaign/${campaign.address}`}>{campaign.address}</Link>
            </div>
          );
        })
      ) : (
        <></>
      )}
      <br></br>
      <br></br>
    </>
  );
};
