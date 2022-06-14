import { FC } from 'react';
import styled from 'styled-components';

export const ViewportContainer = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const VerticalFlex = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const HorizontalFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ColumnsCore: FC<any> = (props: any) => {
  const padding = props.padding || 0;
  const paddingCol = props.paddingCol || 0;
  const n = props.children.length;
  return (
    <div className={props.className}>
      <div style={{ width: padding + 'px', height: '100%' }}></div>
      {props.children.map((child: any, ix: number) => {
        return (
          <div key={ix} style={{ width: `calc(${100 / n}%`, height: '100%' }}>
            <div style={{ width: `calc(100% - ${paddingCol}px)`, height: '100%' }}>{child}</div>
            <div style={{ width: (ix < n - 1 ? paddingCol : padding) + 'px', height: '100%' }}></div>
          </div>
        );
      })}
    </div>
  );
};

export const Columns = styled(ColumnsCore)`
  & {
    display: flex;
    background-color: 'red';
    width: 100%;
  }

  .ant-row {
    margin-bottom: 24px;
  }

  .ant-form-item-label {
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 16px;
  }

  .ant-form-item-control-input input {
    height: 34px;
  }

  .ant-form-item-control-input input,
  .ant-form-item-control-input textarea {
    color: #989ba0;
    padding: 13px 24px;
    width: 100%;
    background-color: transparent;
    border-width: 1px;
    border-color: #e0e0e0;
    border-style: solid;
  }

  .ant-form-item-control-input textarea {
    resize: vertical;
  }
`;
