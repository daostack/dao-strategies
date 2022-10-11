import { GithubProfile, VerificationIntent, getGithubGistContent, Verification } from '@dao-strategies/core';
import { Box, Heading, Spinner, Text, TextArea } from 'grommet';
import { FC, useCallback, useEffect, useState } from 'react';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { useLoggedUser } from '../hooks/useLoggedUser';

import { AppButton, AppCallout, AppInput, HorizontalLine, IElement, NumberedRow } from './styles/BasicElements';
import { useDebounce } from 'use-debounce';
import { GithubProfileCard } from './GithubProfileCard';
import { Clone, Copy, StatusGood } from 'grommet-icons';
import { styleConstants } from './styles/themes';
import { useCopyToClipboard } from '../hooks/useCopyToClipboad';

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
  const [error, setError] = useState<string>();

  const [debouncedHandle] = useDebounce(handle, 1200);
  const [checkingHandle, setCheckingHandle] = useState<boolean>(true);
  const [githubProfile, setGithubProfile] = useState<GithubProfile>();

  const { copied, copy } = useCopyToClipboard();
  const [gistClicked, setGistClicked] = useState<boolean>(false);

  const [readingGists, setReadingGists] = useState<boolean>(false);
  const [verification, setVerification] = useState<Verification>();

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
          const ver = Object.keys(data).length > 0 ? data : undefined;
          if (ver) {
            setVerification(ver);
            refresh();
          } else {
            setError('Gist not found');
            setTimeout(() => {
              setError(undefined);
            }, 2000);
          }
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
                backgroundColor: styleConstants.colors.tagLightGray,
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
              onClick={() => copy(text)}
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
              {copied ? (
                <StatusGood color={styleConstants.colors.links}> </StatusGood>
              ) : (
                <Clone color={styleConstants.colors.links}></Clone>
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
              disabled={verification !== undefined || readingGists || error !== undefined}
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
            {error !== undefined ? (
              <Box style={{ color: styleConstants.colors.alertText }}>
                <Box pad="small" align="center">
                  {error}
                </Box>
              </Box>
            ) : (
              <></>
            )}
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
