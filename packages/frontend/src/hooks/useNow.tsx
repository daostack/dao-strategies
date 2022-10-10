import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

import { DateManager } from '../utils/date.manager';
import { useUserError } from './useErrorContext';

export type NowContextType = {
  now?: DateManager;
  reset: () => Promise<void>;
};

const NowContextValue = createContext<NowContextType | undefined>(undefined);

export interface INowContext {
  children: ReactNode;
}

export const NowContext: FC<INowContext> = (props: INowContext) => {
  const [now, setNow] = useState<DateManager>();
  const { showError } = useUserError();

  /** reset the "now" date to the updated time of the oracle  */
  const reset = async (): Promise<void> => {
    setNow(undefined);
    const _now = new DateManager();
    _now
      .sync()
      .then(() => {
        setNow(_now);
      })
      .catch((e) => {
        showError(`Error connecting to the oracle`);
      });
  };

  /**
   * This means that the execDate, if campaign is retroactive, will be a time lower than the
   * local time on the oracle when registering (and executing) the campaign.
   */
  useEffect(() => {
    reset();
  }, []);

  return <NowContextValue.Provider value={{ now, reset }}>{props.children}</NowContextValue.Provider>;
};

export function useNowContext(): NowContextType {
  const context = useContext(NowContextValue);
  if (!context) throw Error('useNow can only be used within the Web3ReactProvider component');
  return context;
}
