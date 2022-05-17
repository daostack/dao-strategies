import { ORACLE_NODE_URL } from '../config/appConfig';

export const getInformation = async (): Promise<string | undefined> => {
  const res = await fetch(`${ORACLE_NODE_URL}/me`, {
    credentials: 'include',
  });

  if (!res.ok) {
    console.error(`Failed in getInformation: ${res.statusText}`);
    return undefined;
  }

  let result = await res.text();
  console.log(result);
  return result.split(' ')[result.split(' ').length - 1];
};
