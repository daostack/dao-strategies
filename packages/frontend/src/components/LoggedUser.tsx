import { Box, Layer, Select } from 'grommet';
import { FC, useState } from 'react';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { GithubVerification } from './GithubVerification';
import { AppButton } from './styles/BasicElements';

const imageAndText = (url: string, text: string) => {
  return (
    <Box direction="row" align="center">
      <img style={{ height: '30px', width: '30px' }} src={url}></img>
      <Box style={{ padding: '0px 15px' }}>{text}</Box>
    </Box>
  );
};

export const LoggedUser: FC = () => {
  const { account, connect, startLogout, user } = useLoggedUser();
  const [showLinkGithub, setShowLinkGithub] = useState<boolean>(false);

  if (account === undefined) {
    return (
      <AppButton primary onClick={connect}>
        Connect
      </AppButton>
    );
  }

  const option = (key: number) => {
    switch (key) {
      case 0:
        return user && user.verified.github != null ? (
          <Box pad="small">{imageAndText('/images/Github.png', 'Verified')}</Box>
        ) : (
          <Box onClick={() => setShowLinkGithub(true)} pad="small">
            {imageAndText('/images/Github.png', 'Link Github Account')}
          </Box>
        );
      case 1:
        return (
          <Box onClick={() => startLogout()} pad="small">
            disconnect
          </Box>
        );
    }
  };

  return (
    <>
      {showLinkGithub ? (
        <Layer onEsc={() => setShowLinkGithub(false)} onClickOutside={() => setShowLinkGithub(false)}>
          <GithubVerification></GithubVerification>
        </Layer>
      ) : (
        <></>
      )}
      <Select
        name="asset"
        style={{ border: '0px none' }}
        options={[0, 1]}
        value={<Box pad="small">{imageAndText('/images/MetaMask_Fox.png', account)}</Box>}>
        {option}
      </Select>
    </>
  );
};
