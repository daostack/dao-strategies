import { Box, BoxExtendedProps } from 'grommet';
import { Inspect, Next } from 'grommet-icons';
import { FC, useState } from 'react';
import { AdvancedCampaignStatus } from '../../components/AdvancedCampaignStatus';

import { AppCard, AppModal, CircleIcon } from '../../components/styles/BasicElements';
import { styleConstants } from '../../components/styles/themes';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { CAMPAIGN_MAX_WIDTH } from './CampaignPage';

export interface IFixedAdmin extends BoxExtendedProps {
  address: string;
}

export const FixedAdmin: FC<IFixedAdmin> = (props: IFixedAdmin) => {
  const [showGuardianControl, setShowGuardianControl] = useState<boolean>(false);
  const { width } = useWindowDimensions();

  const buttonWidth = width > CAMPAIGN_MAX_WIDTH ? (1200 * 2) / 5 : (width * 2) / 5;

  return showGuardianControl ? (
    <AppModal heading="Advanced Status" onClosed={() => setShowGuardianControl(false)}>
      <AdvancedCampaignStatus campaignAddress={props.address}></AdvancedCampaignStatus>
    </AppModal>
  ) : (
    <AppCard
      direction="row"
      align="center"
      onClick={() => setShowGuardianControl(true)}
      style={{
        fontSize: styleConstants.textFontSizes.small,
        minHeight: 'auto',
        width: `${buttonWidth}px`,
        position: 'fixed',
        bottom: '36px',
      }}>
      <CircleIcon
        icon={<Inspect></Inspect>}
        color={styleConstants.colors.primary}
        style={{ marginRight: '12px', flexGrow: 0 }}
      />
      <Box style={{ flexGrow: 1 }}>
        <Box
          direction="row"
          style={{
            width: 'fit-content',
            borderBottom: '2px dashed',
            borderColor: styleConstants.colors.ligthGrayText,
          }}>
          Admin Control Center
        </Box>
      </Box>

      <Next color={styleConstants.colors.text} style={{ marginRight: '12px', flexGrow: 0, height: '12px' }}></Next>
    </AppCard>
  );
};
