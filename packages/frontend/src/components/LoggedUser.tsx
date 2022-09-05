import { Box, Layer, Select } from 'grommet';
import { Logout } from 'grommet-icons';
import { FC, ReactNode, useState } from 'react';
import { useLoggedUser } from '../hooks/useLoggedUser';
import { GithubVerification } from './GithubVerification';
import { AppButton } from './styles/BasicElements';

const imageAndText = (url: string | ReactNode, text: string) => {
  return (
    <Box direction="row" align="center">
      <Box style={{ width: '40px' }} align="center">
        {typeof url === 'string' ? <img style={{ height: '30px', width: '30px' }} alt="logout" src={url}></img> : url}
      </Box>
      <Box style={{ padding: '0px 15px' }}>{text}</Box>
    </Box>
  );
};

export const LoggedUser: FC = () => {
  const { account, connect, startLogout, githubAccount } = useLoggedUser();
  const [showLinkGithub, setShowLinkGithub] = useState<boolean>(false);

  if (account === undefined) {
    return (
      <AppButton primary onClick={connect}>
        Connect Wallet
      </AppButton>
    );
  }

  const option = (key: number) => {
    switch (key) {
      case 0:
        return githubAccount ? (
          <Box pad="small">{imageAndText('/images/Github.png', `linked from @${githubAccount.split(':')[1]}`)}</Box>
        ) : (
          <Box onClick={() => setShowLinkGithub(true)} pad="small">
            {imageAndText('/images/Github.png', 'link account')}
          </Box>
        );
      case 1:
        return (
          <Box onClick={() => startLogout()} pad="small">
            {imageAndText(<Logout></Logout>, 'disconnect')}
          </Box>
        );
    }
  };

  return (
    <>
      {showLinkGithub ? (
        <Layer onEsc={() => setShowLinkGithub(false)} onClickOutside={() => setShowLinkGithub(false)}>
          <GithubVerification onClose={() => setShowLinkGithub(false)}></GithubVerification>
        </Layer>
      ) : (
        <></>
      )}
      <Select
        name="asset"
        options={[0, 1]}
        value={<Box pad="small">{imageAndText('/images/MetaMask_Fox.png', `${account.slice(0, 10)}...`)}</Box>}>
        {option}
      </Select>
    </>
  );
};
