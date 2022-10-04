import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { GITHUB_DOMAINS, ORACLE_NODE_URL } from '../config/appConfig';

const DEBUG = true;

export const useGithubSearch = (): {
  loading: boolean;
  repos: string[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  checking: boolean;
  checkExist: (name: string) => void;
  validRepo: string;
  isValid: boolean;
  getValidName: (name: string) => string | undefined;
} => {
  const [repos, setRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 1200);

  useEffect(() => {
    setLoading(true);
    if (debouncedQuery !== '') {
      fetch(ORACLE_NODE_URL + `/social/github/searchRepo`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: debouncedQuery,
          page: 0,
          per_page: 10,
        }),
        credentials: 'include',
      }).then((response) => {
        response.json().then((data) => {
          setLoading(false);
          setRepos(data);
        });
      });
    } else {
      setLoading(false);
      setRepos([]);
    }
  }, [debouncedQuery]);

  const [checking, setChecking] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [debouncedName] = useDebounce(fullName, 1200, { leading: false });

  const checkExist = (name: string) => {
    if (DEBUG) console.log('checkExist', name);
    setChecking(false);
    setFullName(name);
  };

  const getValidName = (name: string): string | undefined => {
    let orgAndName = name;

    const startsWith = GITHUB_DOMAINS.find((github_domain) => name.startsWith(github_domain));
    if (startsWith !== undefined) {
      orgAndName = name.slice(startsWith.length);
    }
    return orgAndName.split('/').length === 2 ? orgAndName : undefined;
  };

  useEffect(() => {
    if (DEBUG) console.log('debouncedName', debouncedName);

    const validName = getValidName(debouncedName);
    if (validName !== undefined) {
      setChecking(true);
      if (DEBUG) console.log('isValidName. Fetching', validName);

      fetch(ORACLE_NODE_URL + `/social/github/repo/${validName}`, {
        method: 'get',
        credentials: 'include',
      })
        .then((response) => {
          response.json().then((data) => {
            if (DEBUG) console.log('github/exist. response', response);
            setChecking(false);
            setIsValid(data);
          });
        })
        .catch((e) => {
          setChecking(false);
          setIsValid(false);
          console.error(e);
        });
    } else {
      setChecking(false);
      setIsValid(false);
    }
  }, [debouncedName]);

  return {
    loading,
    repos,
    query: debouncedQuery,
    setQuery,
    checking,
    checkExist,
    validRepo: debouncedName,
    isValid,
    getValidName,
  };
};
