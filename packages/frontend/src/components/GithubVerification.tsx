import { Box, Heading, Text } from 'grommet';
import { FC, useEffect, useState } from 'react';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { useLoggedUser } from '../hooks/useLoggedUser';

import { AppButton, AppInput, NumberedRow } from './styles/BasicElements';
import { useDebounce } from 'use-debounce';
import { GithubProfileCard } from './GithubProfileCard';
import { GithubProfile } from '@dao-strategies/core';

export interface IUserProfileProps {
  dum?: string;
}

enum VerificationStatus {
  empty = 0,
  handleFound = 1,
  gistFound = 2,
  signatureVerified = 3,
}

export const GithubVerification: FC<IUserProfileProps> = () => {
  const { user, refresh } = useLoggedUser();
  const [handle, setHandle] = useState<string>('');

  const [debouncedHandle] = useDebounce(handle, 1200);
  const [checkingHandle, setCheckingHandle] = useState<boolean>(true);
  const [githubProfile, setGithubProfile] = useState<GithubProfile>();

  useEffect(() => {
    setCheckingHandle(true);
    if (debouncedHandle !== '') {
      fetch(ORACLE_NODE_URL + `/social/github/profile/${debouncedHandle}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }).then((response) => {
        response.json().then((data) => {
          setCheckingHandle(false);
          setGithubProfile(data);
        });
      });
    } else {
      // setCheckingHandle(false);
      setGithubProfile(undefined);
    }
  }, [debouncedHandle]);

  const verified = user?.verified.github !== undefined;

  const status: VerificationStatus = githubProfile === undefined ? 0 : 1;

  const goToGithub = async () => {
    window.open('https://gist.github.com/', '_blank');
  };

  const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
  };

  return (
    <>
      <Box pad="large">
        <Box style={{ paddingBottom: '40px' }}>
          <Heading size="small">Set the target address for your github rewards</Heading>
          <Text style={{ padding: '0px 12px' }}>This must be done from github to prove you control that account</Text>
        </Box>
        <NumberedRow disabled={status < 0} number={1} text={<>Enter your github handle below.</>}>
          <Box>
            <AppInput value={handle} onChange={(e) => handleChanged(e)} placeholder="github handle"></AppInput>
            <GithubProfileCard></GithubProfileCard>
          </Box>
        </NumberedRow>
        <NumberedRow
          disabled={status < 1}
          number={2}
          text={
            <>
              Create a <b>public</b> gist on github pasting your etheruem address in it’s body.
            </>
          }>
          <Box>
            <AppInput value={user?.address}></AppInput>
            <AppButton onClick={goToGithub} style={{ marginTop: '10px' }} primary>
              Create gist
            </AppButton>
          </Box>
        </NumberedRow>

        {verified ? <>Verified</> : <></>}

        <br></br>
      </Box>
    </>
  );
};
