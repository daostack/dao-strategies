import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { ORACLE_NODE_URL } from '../config/appConfig';

export const useGithubSearch = (): {
  loading: boolean;
  repos: string[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  checking: boolean;
  isValid: boolean;
  checkExist: React.Dispatch<React.SetStateAction<string>>;
  isValidName: (name: string) => boolean;
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
  const [debouncedName] = useDebounce(fullName, 1200, { leading: true });

  const isValidName = (name: string) => {
    return name.split('/').length === 2;
  };

  useEffect(() => {
    setChecking(true);
    if (isValidName(debouncedName)) {
      fetch(ORACLE_NODE_URL + `/social/github/exist?fullName=${debouncedName}`, {
        method: 'post',
        credentials: 'include',
      }).then((response) => {
        response.json().then((data) => {
          setChecking(false);
          setIsValid(data);
        });
      });
    } else {
      setChecking(false);
      setRepos([]);
    }
  }, [debouncedName]);

  return {
    loading,
    repos,
    query: debouncedQuery,
    setQuery,
    checking,
    isValid,
    checkExist: setFullName,
    isValidName,
  };
};
