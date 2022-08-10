import { Box, Heading, Spinner } from 'grommet';
import { FC, useEffect, useState } from 'react';
import { useSignMessage } from 'wagmi';
import { getGithubVerificationMessage } from '@dao-strategies/core';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { useLoggedUser } from '../hooks/useLoggedUser';

import { AppButton, AppInput, NumberedRow } from './styles/BasicElements';
import { useDebounce } from 'use-debounce';

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
  const [checkingHandle, setCheckingHandle] = useState<boolean>(false);
  const [githubProfile, setGithubProfile] = useState<any>();

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
      setCheckingHandle(false);
      setGithubProfile(undefined);
    }
  }, [debouncedHandle]);

  const verified = user?.verified.github !== undefined;

  const status: VerificationStatus = githubProfile === undefined ? 0 : 1;

  const { signMessage } = useSignMessage({
    onSuccess(data) {
      // Verify signature when sign message succeeds
      verifyGithubOfAddress(data);
    },
  });

  const isLogged = () => {
    return user !== undefined;
  };

  const sign = async () => {
    signMessage({
      message: getGithubVerificationMessage(handle),
    });
  };

  const goToGithub = async () => {
    window.open('https://gist.github.com/', '_blank');
  };

  const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
  };

  const verifyGithubOfAddress = (data: string) => {
    fetch(ORACLE_NODE_URL + '/user/verifyGithubOfAddress', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signature: data, github_username: handle }),
      credentials: 'include',
    }).then((response) => {
      response.json().then((res: { address: string }) => {});
    });
  };

  const verifyAddressOfGithub = () => {
    fetch(ORACLE_NODE_URL + '/user/verifyAddressOfGithub', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle }),
      credentials: 'include',
    }).then((response) => {
      response.json().then((res: { address: string }) => {
        if (res.address.toLowerCase() === user?.address.toLowerCase()) {
          refresh();
        } else {
        }
      });
    });
  };

  return (
    <>
      {isLogged() ? (
        !verified ? (
          <Box pad="large">
            <Box style={{ paddingBottom: '40px' }}>
              <Heading size="small">Verify your Github account and start getting rewards!</Heading>
            </Box>
            <NumberedRow disabled={status < 0} number={1} text={<>Enter your github handle below.</>}>
              <AppInput value={handle} onChange={(e) => handleChanged(e)} placeholder="github handle"></AppInput>
              {checkingHandle ? <Spinner></Spinner> : <></>}
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
        ) : (
          <>Github Verified</>
        )
      ) : (
        <>User not Logged</>
      )}
    </>
  );
};
