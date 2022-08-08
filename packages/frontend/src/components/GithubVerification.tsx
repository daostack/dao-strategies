import { TextInput } from 'grommet';
import { FC, useState } from 'react';
import { useSignMessage } from 'wagmi';
import { AppButton } from './styles/BasicElements';

import { ORACLE_NODE_URL } from '../config/appConfig';
import { useLoggedUser } from '../hooks/useLoggedUser';

export interface IUserProfileProps {
  dum?: string;
}

const getMessage = (github_username: string) => {
  return `Associate the github account "${github_username}" with this ethereum address`;
};

export const GithubVerification: FC<IUserProfileProps> = () => {
  const { user, refresh } = useLoggedUser();
  const [handle, setHandle] = useState<string>('pepoospina');
  const [handleWasSet, setHandleWasSet] = useState<boolean>(false);

  const [addressCopied, setAddressCopied] = useState<boolean>(false);

  const [verifyingSig, setVerifyinfSig] = useState<boolean>(false);
  const [verifiedSig, setVerifidSig] = useState<boolean>(false);

  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyingError, setVerifyingError] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  const { signMessage } = useSignMessage({
    onSuccess(data) {
      // Verify signature when sign message succeeds
      verifyGithubOfAddress(data);
    },
  });

  const isVerified = () => {
    return false; //user !== undefined && user.verified.github != null && user.verified.github.trim() !== '';
  };

  const isLogged = () => {
    return user !== undefined;
  };

  const copyAddress = async () => {
    if (user === undefined) throw new Error();
    await navigator.clipboard.writeText(user.address);
    setAddressCopied(true);
  };

  const sign = async () => {
    setVerifyinfSig(true);
    signMessage({
      message: getMessage(handle),
    });
  };

  const goToGithub = async () => {
    window.open('https://gist.github.com/', '_blank');
  };

  const handleSet = () => {
    setHandleWasSet(true);
  };

  const handleClear = () => {
    setHandleWasSet(false);
    setHandle('');
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
      response.json().then((res: { address: string }) => {
        setVerifyinfSig(false);
        setVerifidSig(res.address.toLowerCase() === user?.address.toLowerCase());
      });
    });
  };

  const verifyAddressOfGithub = () => {
    setVerifying(true);
    fetch(ORACLE_NODE_URL + '/user/verifyAddressOfGithub', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle }),
      credentials: 'include',
    }).then((response) => {
      response.json().then((res: { address: string }) => {
        if (res.address.toLowerCase() === user?.address.toLowerCase()) {
          setVerifying(false);
          setVerified(true);
          refresh();
        } else {
          setVerifyingError(true);
        }
      });
    });
  };

  return (
    <>
      {JSON.stringify(user)}
      {isLogged() ? (
        !isVerified() ? (
          <>
            <div>
              <div className="gutter-row">
                {!handleWasSet ? (
                  <TextInput value={handle} onChange={(e) => handleChanged(e)} placeholder="github handle"></TextInput>
                ) : (
                  <>{handle}</>
                )}
              </div>
              <div className="gutter-row">
                {!handleWasSet ? (
                  <AppButton primary onClick={handleSet}>
                    Set
                  </AppButton>
                ) : (
                  <AppButton primary onClick={handleClear}>
                    Clear
                  </AppButton>
                )}
              </div>
            </div>
            <br></br>
            <div>
              <div className="gutter-row">
                <>{user?.address}</>
              </div>
              <div className="gutter-row">
                {!verifiedSig ? (
                  <AppButton primary onClick={sign}>
                    {!verifyingSig ? <>Sign</> : <>Signing...</>}
                  </AppButton>
                ) : (
                  <>verified</>
                )}
              </div>
            </div>
            <br></br>
            <div>
              <div className="gutter-row">
                Please create a <b>public</b> gist on github pasting your Ethereum address in it's body.
              </div>
              <div className="gutter-row">
                <AppButton primary onClick={goToGithub}>
                  Open Github
                </AppButton>
              </div>
            </div>
            <br></br>
            <div>
              <div className="gutter-row">Once you have created the gist, click below to verify it.</div>
              <div className="gutter-row">
                <AppButton primary onClick={verifyAddressOfGithub}>
                  {!verifying ? <>Verify</> : <>Verifying...</>}
                </AppButton>
              </div>
            </div>

            <br></br>
            {verifyingError ? <>Error verifying</> : <></>}
            {verified ? <>Verified</> : <></>}

            <br></br>
          </>
        ) : (
          <>Github Verified</>
        )
      ) : (
        <>User not Logged</>
      )}
    </>
  );
};
