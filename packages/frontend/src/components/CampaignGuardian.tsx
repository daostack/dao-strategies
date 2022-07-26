import { Box, Spinner, Text } from 'grommet';
import { FC, useEffect } from 'react';
import { useCampaignContext } from '../hooks/useCampaign';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { AppButton } from './styles/BasicElements';

interface ICampaignAdmin {
  campaignAddress: string;
}

interface CampaignStatus {
  hasRootProposal: boolean;
  canBlock: boolean;
}

export const CampaignGuardian: FC<ICampaignAdmin> = (props: ICampaignAdmin) => {
  const { campaign, otherDetails, getOtherDetails } = useCampaignContext();
  const { account } = useLoggedUser();

  useEffect(() => {
    getOtherDetails();
  }, []);

  if (!campaign) {
    return (
      <>
        <Spinner></Spinner>
      </>
    );
  }

  const status: CampaignStatus = {
    canBlock: account === campaign.guardian,
    hasRootProposal: true,
  };

  return (
    <Box align="center" justify="center">
      <Box>
        <ul>
          <li>Campaign receivers: 8</li>
          <li>Of which have verified their github: 4</li>
        </ul>
      </Box>
      <Box>Campaign distribution cannot be modified. The next proposal for distribution can only be made in:</Box>
      <Box>
        <Text size="xlarge">3 days, 2 hrs</Text>
      </Box>
      <AppButton primary>Block</AppButton>
    </Box>
  );
};
