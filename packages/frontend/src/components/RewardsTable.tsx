import { Page } from '@dao-strategies/core';
import { SharesRead, TokenBalance } from '@dao-strategies/core';
import { ethers } from 'ethers';
import { Box, BoxExtendedProps, Spinner } from 'grommet';
import { FormNext, FormPrevious, StatusGood } from 'grommet-icons';
import { FC } from 'react';
import { valueToString } from '../utils/general';
import { IElement } from './styles/BasicElements';

interface Data {
  id: string;
  user: string;
  badge: boolean;
  info: string;
  reward?: string;
  percentage: string;
}

interface IPageNumber extends BoxExtendedProps {
  number: number;
  selected?: boolean;
}
const PageNumber: FC<IPageNumber> = (props: IPageNumber) => {
  return (
    <Box
      {...props}
      style={{
        ...props.style,
        cursor: 'pointer',
        height: '32px',
        width: '32px',
        backgroundColor: '#D9D9D9',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: props.selected ? 'bold' : 'normal',
        userSelect: 'none',
      }}
      align="center"
      justify="center">
      {props.number}
    </Box>
  );
};

export interface RewardsTableI extends IElement {
  shares: SharesRead;
  showReward?: boolean;
  raised?: TokenBalance[];
  updatePage: (page: Page) => void;
}

export const RewardsTable: FC<RewardsTableI> = (props: RewardsTableI) => {
  const shares = props.shares;
  const showReward = props.showReward !== undefined ? props.showReward : false;

  if (shares === undefined) {
    return (
      <Box fill justify="center" align="center">
        <Spinner></Spinner>
      </Box>
    );
  }

  const hasNext =
    props.shares.page.totalPages !== undefined && props.shares.page.number < props.shares.page.totalPages - 1;

  const hasPrev = props.shares.page.totalPages !== undefined && props.shares.page.number > 0;

  const nextPage = () => {
    if (hasNext) {
      props.updatePage({ ...props.shares.page, number: props.shares.page.number + 1 });
    }
  };

  const prevPage = () => {
    if (hasPrev) {
      props.updatePage({ ...props.shares.page, number: props.shares.page.number - 1 });
    }
  };

  const setPage = (number: number) => {
    if (props.shares.page.totalPages !== undefined && number <= props.shares.page.totalPages) {
      props.updatePage({ ...props.shares.page, number });
    }
  };

  const data: Data[] = Object.entries(shares.shares).map(([address, share]) => {
    const ratio = +ethers.utils.formatEther(share);

    let reward: string | undefined;

    if (showReward && props.raised) {
      const raisedWithPrice = props.raised.filter((token) => token.price !== undefined);
      const rewardUSD = raisedWithPrice
        .map((token) => {
          const raised = +ethers.utils.formatUnits(token.balance, token.decimals) * (token.price as number);
          return raised * ratio;
        })
        .reduce((total, reward) => total + reward, 0);

      const raisedCustom = props.raised.filter((token) => token.price === undefined);

      let hasCustom = false;

      const customStr = raisedCustom
        .map((token) => {
          const raised = +ethers.utils.formatUnits(token.balance, token.decimals);
          if (raised > 0) {
            hasCustom = true;
          }
          return `${valueToString(raised * ratio)} ${token.name}`;
        })
        .reduce((total, reward) => total.concat(' ' + reward));

      reward = `${rewardUSD > 0 ? `~$${valueToString(rewardUSD)}` : '-'}${hasCustom ? ` + ${customStr}` : '-'}`;
    }

    return {
      id: address,
      user: address,
      percentage: valueToString(ratio * 100),
      reward,
      badge: true,
      info: '',
    };
  });

  const widths = showReward ? ['40%', '20%', '40%'] : ['60%', '40%'];

  return (
    <Box style={{ width: '100%', userSelect: 'none', ...props.style }}>
      <Box
        direction="row"
        style={{
          width: '100%',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '26px',
          padding: '10px 36px',
        }}>
        <Box style={{ width: widths[0] }}>user handle</Box>
        <Box direction="row" justify="center" style={{ width: widths[1] }}>
          score (%)
        </Box>
        {showReward ? (
          <Box direction="row" justify="center" style={{ width: widths[2] }}>
            reward
          </Box>
        ) : (
          <></>
        )}
      </Box>
      <Box direction="column" style={{ width: '100%' }}>
        {data.map((datum) => (
          <Box
            fill
            direction="row"
            align="center"
            key={datum.id}
            style={{
              border: '1px solid',
              borderColor: '#F0EDED',
              borderRadius: '20px',
              height: '40px',
              marginBottom: '16px',
              padding: '10px 36px',
              backgroundImage: 'white',
            }}>
            <Box direction="row" align="center" style={{ width: widths[0], userSelect: 'text' }}>
              @{datum.user}
              {datum.badge ? <StatusGood style={{ marginLeft: '6px' }} color="#5762D5"></StatusGood> : <></>}
            </Box>
            <Box direction="row" justify="center" style={{ width: widths[1], userSelect: 'text' }}>
              {datum.percentage}
            </Box>
            {showReward ? (
              <Box direction="row" justify="center" style={{ width: widths[2], userSelect: 'text' }}>
                {datum.reward}
              </Box>
            ) : (
              <></>
            )}
          </Box>
        ))}
      </Box>
      <Box direction="row" justify="center" align="center" style={{ height: '60px' }}>
        <Box style={{ marginRight: '12px', cursor: 'pointer' }} onClick={() => prevPage()}>
          <FormPrevious></FormPrevious>
        </Box>

        {Array.from(Array(shares.page.totalPages).keys()).map((ix) => {
          return (
            <PageNumber
              onClick={() => setPage(ix)}
              style={{ marginRight: '8px' }}
              key={ix}
              number={ix + 1}
              selected={shares.page.number === ix}></PageNumber>
          );
        })}
        <Box style={{ marginLeft: '12px', cursor: 'pointer' }} onClick={() => nextPage()}>
          <FormNext></FormNext>
        </Box>
      </Box>
    </Box>
  );
};
