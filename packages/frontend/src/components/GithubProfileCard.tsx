import { GithubProfile } from '@dao-strategies/core';
import { Box } from 'grommet';
import { FC } from 'react';
import { IElement } from './styles/BasicElements';

interface IGithubProfile extends IElement {
  profile?: GithubProfile;
}

export const GithubProfileCard: FC<IGithubProfile> = (props: IGithubProfile) => {
  return (
    <Box direction="row" style={{ padding: '24px 24px 0px 24px' }}>
      <Box style={{ width: '60px', height: '70px', backgroundColor: '#ccc' }}></Box>
      <Box direction="row" align="center" style={{ marginLeft: '16px' }}>
        user
      </Box>
    </Box>
  );
};
