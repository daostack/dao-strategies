import { Button, Col, Input, Row } from 'antd';
import { FC, useState } from 'react';
import { ORACLE_NODE_URL } from '../../config/appConfig';
import { useLoggedUser } from '../../hooks/useLoggedUser';

export interface IUserProfileProps {
  dum?: string;
}

export const UserProfile: FC<IUserProfileProps> = () => {
  const { user } = useLoggedUser();
  const [handle, setHandle] = useState<string>('pepoospina');
  const [handleWasSet, setHandleWasSet] = useState<boolean>(false);
  const [addressCopied, setAddressCopied] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyingError, setVerifyingError] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  const isVerified = () => {
    return user !== undefined && user.verified.github !== '';
  };

  const isLogged = () => {
    return user !== undefined;
  };

  const copyAddress = async () => {
    if (user === undefined) throw new Error();
    await navigator.clipboard.writeText(user.address);
    setAddressCopied(true);
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

  const verify = () => {
    setVerifying(true);
    fetch(ORACLE_NODE_URL + '/user/verifyGithub', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle }),
      credentials: 'include',
    }).then((response) => {
      response.json().then((res: { valid: boolean }) => {
        if (res.valid) {
          setVerifying(false);
          setVerified(true);
        } else {
          setVerifyingError(true);
        }
      });
    });
  };

  return (
    <>
      {isLogged() && !isVerified() ? (
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
              {!handleWasSet ? <Button onClick={handleSet}>Set</Button> : <Button onClick={handleClear}>Clear</Button>}
            </Col>
          </Row>
          <br></br>
          <Row gutter={16}>
            <Col className="gutter-row" span={14}>
              <>{user?.address}</>
            </Col>
            <Col className="gutter-row" span={2}>
              {!addressCopied ? <Button onClick={copyAddress}>Copy</Button> : <>Copied</>}
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
              <Button onClick={verify}>{!verifying ? <>Verify</> : <>Verifying...</>}</Button>
            </Col>
          </Row>

          <br></br>
          {verifyingError ? <>Error verifying</> : <></>}
          {verified ? <>Verified</> : <></>}

          <br></br>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
