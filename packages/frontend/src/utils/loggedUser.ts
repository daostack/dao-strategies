import { Signer } from 'ethers';
import { SiweMessage } from 'siwe';
import { DOMAIN, ORACLE_NODE_URL, ORIGIN } from '../config/appConfig';
import { UserDetails } from '../hooks/useLoggedUser';

export const checkLoggedUser = async (): Promise<UserDetails | undefined> => {
  const res = await fetch(`${ORACLE_NODE_URL}/user/me`, {
    credentials: 'include',
  });

  if (!res.ok) {
    console.error(`Failed in getInformation: ${res.statusText}`);
    return undefined;
  }

  let result = await res.json();
  return result;
};

const getNonce = async (): Promise<string> => {
  const res = await fetch(`${ORACLE_NODE_URL}/user/nonce`, {
    credentials: 'include',
  });
  const nonce = (await res.json()) as any;
  return nonce.nonce;
};

const createSiweMessage = async (address: string, statement: string, chainId: number) => {
  const nonce = await getNonce();
  const message = new SiweMessage({
    domain: DOMAIN,
    address,
    statement,
    uri: ORIGIN,
    version: '1',
    chainId,
    nonce,
  });
  return message.prepareMessage();
};

export const signInWithEthereum = async (address: string, signer: Signer): Promise<UserDetails | undefined> => {
  const chainId = await signer.getChainId();
  const message = await createSiweMessage(address, 'Login with my Ethereum account', chainId);
  const signature = await signer.signMessage(message);

  const res = await fetch(`${ORACLE_NODE_URL}/user/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature }),
    credentials: 'include',
  });

  if (!res.ok) {
    console.error(`Verification failed: ${res.statusText}`);
    return undefined;
  }

  const result = await res.json();
  if (!result.valid) {
    console.error(`Verification failed: ${res.statusText}`);
    return undefined;
  }

  return result.user;
};
