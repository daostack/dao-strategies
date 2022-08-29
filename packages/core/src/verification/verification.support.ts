export enum VerificationIntent {
  SEND_REWARDS = 'SEND_REWARDS',
  SEND_CAMPAIGN_REWARDS = 'SEND_CAMPAIGN_REWARDS',
}

const rewardIntro =
  'I would like my CommonValue rewards to be sent to the following address:';

export const getGithubGistContent = (
  chain: string,
  address: string,
  intent: VerificationIntent
): string => {
  switch (intent) {
    case VerificationIntent.SEND_REWARDS:
      return `${rewardIntro}
      chain: ${chain}
      address: ${address}`;
    default:
      throw new Error('intent not detected');
  }
};

export const isSendRewards = (
  content: string
): { intent: VerificationIntent; params: any } | undefined => {
  const regex = new RegExp(
    `${rewardIntro}[\n][\\s]*chain:[\\s]*([a-zA-Z]*)[\n][\\s]*address:[\\s]*(0x[a-fA-F0-9]{40})`
  );

  const found = regex.exec(content);

  if (found !== null && found.length === 3) {
    return {
      intent: VerificationIntent.SEND_REWARDS,
      params: {
        chain: found[1],
        address: found[2],
      },
    };
  }

  return undefined;
};
