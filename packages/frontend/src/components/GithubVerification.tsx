import { GithubProfile, VerificationIntent, getGithubGistContent } from '@dao-strategies/core';
import { Box, Heading, Spinner, Text, TextArea } from 'grommet';
import { FC, useCallback, useEffect, useState } from 'react';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { useLoggedUser } from '../hooks/useLoggedUser';

import { AppButton, AppInput, NumberedRow } from './styles/BasicElements';
import { useDebounce } from 'use-debounce';
import { GithubProfileCard } from './GithubProfileCard';
import { Copy } from 'grommet-icons';

export interface IUserProfileProps {
  dum?: string;
}

enum VerificationStatus {
  empty = 0,
  handleFound = 1,
  gistSearching = 2,
}

export const GithubVerification: FC<IUserProfileProps> = () => {
  const { user } = useLoggedUser();
  const [handle, setHandle] = useState<string>('');

  const [debouncedHandle] = useDebounce(handle, 1200);
  const [checkingHandle, setCheckingHandle] = useState<boolean>(true);
  const [githubProfile, setGithubProfile] = useState<GithubProfile>();

  const [copied, setCopied] = useState<boolean>(false);
  const [gistClicked, setGistClicked] = useState<boolean>(false);

  const [searchGist, setSearchGist] = useState<boolean>(false);

  const checkHandle = () => {
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
  };

  const checkGist = useCallback(() => {
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
  }, []);

  useEffect(() => {
    checkHandle();
  }, [debouncedHandle]);

  useEffect(() => {
    setInterval(() => {
      if (searchGist) checkGist();
    }, 5000);
  }, []);

  const verification = user
    ? user.verifications.find((v) => v.intent === VerificationIntent.SEND_REWARDS || v.to.endsWith(user.address))
    : undefined;

  const verified = verification !== undefined;

  const status: VerificationStatus =
    githubProfile === undefined
      ? VerificationStatus.empty
      : !gistClicked
      ? VerificationStatus.handleFound
      : VerificationStatus.gistSearching;

  const goToGithub = async () => {
    setGistClicked(true);
    window.open('https://gist.github.com/', '_blank');
  };

  const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
  };

  const text = getGithubGistContent('all', user ? user.address : '', VerificationIntent.SEND_REWARDS);

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box pad="large">
        <Box style={{ paddingBottom: '40px' }}>
          <Heading size="small">Set the payment address for a Github account</Heading>
          <Text style={{ padding: '0px 12px' }}>
            This step is done from Github to prove that it's done by the legitimate owner of that Github account.
          </Text>
        </Box>
        <NumberedRow disabled={status < 0} number={1} text={<>Enter the github handle below.</>}>
          <Box>
            <AppInput value={handle} onChange={(e) => handleChanged(e)} placeholder="github handle"></AppInput>
            <GithubProfileCard style={{ marginTop: '16px' }} profile={githubProfile}></GithubProfileCard>
          </Box>
        </NumberedRow>
        <NumberedRow
          disabled={status < 1}
          number={2}
          text={
            <>
              Create a <b>public</b> gist on Github with the following content.
            </>
          }>
          <Box>
            <Box style={{ position: 'relative' }}>
              <TextArea disabled resize={false} style={{ height: '120px', fontSize: '14px', fontFamily: 'monospace' }}>
                {text}
              </TextArea>
              <Box
                onClick={() => copyText()}
                justify="center"
                align="center"
                style={{
                  width: '60px',
                  height: '36px',
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: '#cccccc53',
                }}>
                {!copied ? <Copy></Copy> : <Text style={{ fontSize: '12px' }}>copied!</Text>}
              </Box>
            </Box>
            <AppButton onClick={goToGithub} style={{ marginTop: '10px' }} primary>
              Create gist
            </AppButton>
          </Box>
        </NumberedRow>

        <NumberedRow disabled={status < 2} number={3} text={<>Wait for the gist to be found.</>}>
          <Box justify="center" align="center">
            {status >= VerificationStatus.gistSearching ? <Spinner></Spinner> : <></>}
          </Box>
        </NumberedRow>

        {verified ? <>Verified</> : <></>}

        <br></br>
      </Box>
    </>
  );
};
