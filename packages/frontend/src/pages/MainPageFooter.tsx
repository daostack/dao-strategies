import { FC } from 'react';

export interface IMainPageFooterProps {
  dumb?: any;
}

export const MainPageFooter: FC<IMainPageFooterProps> = (_) => {
  const left = <div></div>;

  const right = <div></div>;

  return (
    <>
      {left}
      {right}
    </>
  );
};
