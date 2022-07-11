import { FC } from 'react';
import { Link } from 'react-router-dom';

import { useCampaigns } from '../../hooks/campaigns.queries';

export interface ICampaignsExplorerProps {
  dum?: any;
}

export const CampaignsExplorer: FC<ICampaignsExplorerProps> = (props: ICampaignsExplorerProps) => {
  const { campaigns } = useCampaigns();

  return (
    <>
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
