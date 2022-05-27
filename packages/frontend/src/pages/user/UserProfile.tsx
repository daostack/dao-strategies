import { Button, Col, Input, Row } from 'antd';
import { FC, useState } from 'react';
import { useSignMessage } from 'wagmi';

import { ORACLE_NODE_URL } from '../../config/appConfig';
import { useLoggedUser } from '../../hooks/useLoggedUser';

export interface IUserProfileProps {
  dum?: string;
}

const getMessage = (github_username: string) => {
  return `Associate the github account "${github_username}" with this ethereum address`;
};

export const UserProfile: FC<IUserProfileProps> = () => {
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
            <Row gutter={16}>
              <Col className="gutter-row" span={14}>
                {!handleWasSet ? (
                  <Input value={handle} onChange={(e) => handleChanged(e)} placeholder="github handle"></Input>
                ) : (
                  <>{handle}</>
                )}
              </Col>
              <Col className="gutter-row" span={2}>
                {!handleWasSet ? (
                  <Button onClick={handleSet}>Set</Button>
                ) : (
                  <Button onClick={handleClear}>Clear</Button>
                )}
              </Col>
            </Row>
            <br></br>
            <Row gutter={16}>
              <Col className="gutter-row" span={14}>
                <>{user?.address}</>
              </Col>
              <Col className="gutter-row" span={2}>
                {!verifiedSig ? (
                  <Button onClick={sign}>{!verifyingSig ? <>Sign</> : <>Signing...</>}</Button>
                ) : (
                  <>verified</>
                )}
              </Col>
            </Row>
            <br></br>
            <Row gutter={16}>
              <Col className="gutter-row" span={14}>
                Please create a <b>public</b> gist on github pasting your Ethereum address in it's body.
              </Col>
              <Col className="gutter-row" span={2}>
                <Button onClick={goToGithub}>Open Github</Button>
              </Col>
            </Row>
            <br></br>
            <Row gutter={16}>
              <Col className="gutter-row" span={14}>
                Once you have created the gist, click below to verify it.
              </Col>
              <Col className="gutter-row" span={2}>
                <Button onClick={verifyAddressOfGithub}>{!verifying ? <>Verify</> : <>Verifying...</>}</Button>
              </Col>
            </Row>

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
