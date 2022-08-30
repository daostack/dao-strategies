import { GithubProfile } from '@dao-strategies/core';
import { Box, BoxExtendedProps, Image, Paragraph } from 'grommet';
import { FC } from 'react';
import { IElement } from './styles/BasicElements';

interface IGithubProfile extends BoxExtendedProps {
  profile?: GithubProfile;
}

export const GithubProfileCard: FC<IGithubProfile> = (props: IGithubProfile) => {
  const profile = props.profile;
  return (
    <Box
      direction="column"
      align="center"
      style={{ padding: '18px 18px 18px 18px', border: 'solid 1px #ccc', borderRadius: '6px', ...props.style }}>
      <Box direction="column" align="center">
        <Box
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#ccc',
            borderRadius: '30px',
            overflow: 'hidden',
          }}>
          {profile ? <Image src={profile.avatar_url} alt={`user ${profile.handle} avatar`} /> : <></>}
        </Box>
        <Box direction="row" align="center" style={{}}>
          {profile ? (
            <a href={profile.url} target="_blank">
              {profile.handle} {profile.name ? `(${profile.name})` : ''}
            </a>
          ) : (
            <></>
          )}
        </Box>
        <Box
          direction="row"
          align="center"
          style={{ fontSize: '14px', lineHeight: '18px', marginTop: '8px', textAlign: 'center' }}>
          {profile && profile.bio ? profile.bio : <></>}
        </Box>
      </Box>
    </Box>
  );
};
