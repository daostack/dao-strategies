import { Box, BoxExtendedProps } from 'grommet';
import { Inspect, Next } from 'grommet-icons';
import { FC, useState } from 'react';
import { AdvancedCampaignStatus } from '../../components/AdvancedCampaignStatus';

import { AppCard, AppModal, CircleIcon } from '../../components/styles/BasicElements';
import { styleConstants } from '../../components/styles/themes';

export interface IFixedAdmin extends BoxExtendedProps {
  address: string;
  btnWidth: number;
}

export const FixedAdmin: FC<IFixedAdmin> = (props: IFixedAdmin) => {
  const [showGuardianControl, setShowGuardianControl] = useState<boolean>(false);

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
        width: `${props.btnWidth}px`,
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
