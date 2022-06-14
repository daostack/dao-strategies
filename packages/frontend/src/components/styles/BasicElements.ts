import { Button, Form, Input } from 'antd';
import Select from 'rc-select';
import styled from 'styled-components';
import { styleConstants } from './themes';

export const AppButton = styled(Button)`
  background-color: ${(props) => (props['type'] === 'primary' ? props.theme.colors.primary : 'transparent')};
  font-size: ${styleConstants.fontSize};
  height: 68px;
  border-radius: 48px;
  padding: 24px 32px;
  border-style: ${(props) => (props['type'] === 'primary' ? 'none' : 'solid')};
  border-width: 2px;
  border-color: ${(props) => props.theme.colors.secondary_border};
  color: ${(props) =>
    props['type'] === 'primary' ? props.theme.colors.primary_color : props.theme.colors.secondary_color};
  font-weight: 700;
  letter-spacing: 0.254653px;
  &:hover {
    cursor: pointer;
  }
`;

export const AppForm = styled(Form)`
  .ant-input {
    border-radius: 15px;
  }
`;

export const AppInput = styled(Input)`
  .ant-input {
    height: 43px;
  }
`;

export const AppTextArea = styled(Input.TextArea)`
  .ant-input {
    border-radius: 15px;
  }
`;

export const AppSelect = styled(Select)`
  input {
    opacity: 1 !important;
    border-radius: 15px;
  }
`;
