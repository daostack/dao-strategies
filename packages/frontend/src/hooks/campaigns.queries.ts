// graphql-request is incompatible with the current vite app as it uses dynamic loading
// and errors to: "Dynamic require of "graphql/language/parser" is not supported"
// import { request, gql } from 'graphql-request';

import { useQuery } from 'react-query';

import { SUBGRAPH_URI } from '../config/appConfig';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useCampaigns() {
  const { data, isLoading, error } = useQuery('campaigns', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const query = `query { 
      campaigns { 
        id 
        creator
        address
        sharesRoot
      }
    }`;

    const response = await fetch(SUBGRAPH_URI, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return response.json() as Record<string, any>;
  });

  return {
    campaigns: data ? data.data.campaigns : undefined,
    isLoading,
    error,
  };
}
