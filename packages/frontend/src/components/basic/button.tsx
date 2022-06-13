import { FC } from 'react';

export interface IAppButton {
  type?: 'primary' | 'normal';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const AppButtonCore: FC<IAppButton> = (props: IAppButton) => {
  return (
    <button className={props.className} style={props.style}>
      {props.children}
    </button>
  );
};
