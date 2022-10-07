import { GithubProfile, VerificationIntent, getGithubGistContent, Verification } from '@dao-strategies/core';
import { Box, Heading, Spinner, Text, TextArea } from 'grommet';
import { FC, useCallback, useEffect, useState } from 'react';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { useLoggedUser } from '../hooks/useLoggedUser';

import { AppButton, AppCallout, AppInput, HorizontalLine, IElement, NumberedRow } from './styles/BasicElements';
import { useDebounce } from 'use-debounce';
import { GithubProfileCard } from './GithubProfileCard';
import { Copy } from 'grommet-icons';
import { styleConstants } from './styles/themes';

export interface IVerificationProps extends IElement {
  onClose: () => void;
}

enum VerificationStatus {
  empty = 0,
  handleFound = 1,
  gistSearching = 2,
}

export const GithubVerification: FC<IVerificationProps> = (props: IVerificationProps) => {
  const { user, refresh } = useLoggedUser();
  const [handle, setHandle] = useState<string>('');

  const [debouncedHandle] = useDebounce(handle, 1200);
  const [checkingHandle, setCheckingHandle] = useState<boolean>(true);
  const [githubProfile, setGithubProfile] = useState<GithubProfile>();

  const [copied, setCopied] = useState<boolean>(false);
  const [gistClicked, setGistClicked] = useState<boolean>(false);

  const [readingGists, setReadingGists] = useState<boolean>(false);
  const [verification, setVerification] = useState<Verification>();

  const verified = verification !== undefined;

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
    if (githubProfile) {
      setReadingGists(true);
      fetch(ORACLE_NODE_URL + `/user/checkVerification`, {
        method: 'post',
        body: JSON.stringify({ handle: githubProfile.handle }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).then((response) => {
        response.json().then((data) => {
          setReadingGists(false);
          setVerification(data);
          refresh();
        });
      });
    }
  }, [githubProfile]);

  useEffect(() => {
    checkHandle();
  }, [debouncedHandle]);

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

  const close = async () => {
    props.onClose();
  };

  return (
    <Box style={{ marginTop: '40px' }}>
      <Box>This step is done from Github to prove that it's done by the legitimate owner of that Github account.</Box>

      <NumberedRow
        style={{ marginTop: '30px' }}
        disabled={status < 0}
        number={1}
        text={<>Enter the github handle below:</>}>
        <Box>
          <AppInput value={handle} onChange={(e) => handleChanged(e)} placeholder="github handle"></AppInput>
        </Box>
      </NumberedRow>
      <NumberedRow
        disabled={status < 1}
        number={2}
        text={
          <>
            Create a <b>public</b> gist on Github with the following content:
          </>
        }>
        <Box>
          <Box style={{ position: 'relative' }}>
            <textarea
              style={{
                backgroundColor: '#F3F3F3',
                borderRadius: '20px',
                padding: '16px 48px 16px 16px',
                fontSize: '15px',
                fontWeight: '500',
                height: '150px',
                border: 'none',
                resize: 'none',
              }}
              value={text}
              disabled></textarea>
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
                borderRadius: '12px',
                backgroundColor: '#cccccc53',
              }}>
              {!copied ? (
                <Copy color={styleConstants.colors.primary}></Copy>
              ) : (
                <Text style={{ fontSize: '12px' }}>copied!</Text>
              )}
            </Box>
          </Box>
          <AppButton _type="slim" onClick={goToGithub} style={{ marginTop: '10px' }} primary>
            Create Gist
          </AppButton>
        </Box>
      </NumberedRow>

      <NumberedRow disabled={status < 2} number={3} text={<>Confirm the Gist has been created and is public.</>}>
        <GithubProfileCard style={{ marginTop: '16px' }} profile={githubProfile}></GithubProfileCard>
        {status >= 1 ? (
          <Box style={{ margin: '12px 0px' }}>
            <AppButton
              disabled={verification !== undefined || readingGists}
              onClick={() => checkGist()}
              primary
              _type="slim"
              label={
                verification === undefined ? (
                  readingGists ? (
                    <>Looking for the Gist...</>
                  ) : (
                    <>Check Gist</>
                  )
                ) : (
                  <>Gist verified!</>
                )
              }
            />
          </Box>
        ) : (
          <></>
        )}
      </NumberedRow>

      <Box style={{ width: '100%', margin: '20px 0px 80px 0px' }} justify="center">
        {verification !== undefined ? (
          <Box>
            <AppCallout _type="success" style={{ fontSize: styleConstants.textFontSizes.normal, marginBottom: '20px' }}>
              <Box>
                <span>
                  Gist found! All rewards received by <b>@{verification.from}</b> will be sent to:
                </span>

                <Box style={{ margin: '12px 0px 0px 0px' }} align="center">
                  <b>{verification.to.split(':')[1]}</b>
                </Box>
              </Box>
            </AppCallout>

            <AppButton onClick={() => close()} primary>
              Close
            </AppButton>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
