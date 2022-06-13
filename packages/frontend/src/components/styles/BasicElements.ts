import styled from 'styled-components';
import { AppButtonCore } from '../basic/button';
import { styleConstants } from './themes';

export const AppButton = styled(AppButtonCore)`
  background-color: ${(props) => (props.type === 'primary' ? props.theme.colors.primary : 'transparent')};
  font-size: ${styleConstants.fontSize};
  height: 68px;
  border-radius: 48px;
  padding: 24px 32px;
  border-style: ${(props) => (props.type === 'primary' ? 'none' : 'solid')};
  border-width: 2px;
  border-color: ${(props) => props.theme.colors.secondary_border};
  color: ${(props) =>
    props.type === 'primary' ? props.theme.colors.primary_color : props.theme.colors.secondary_color};
  font-weight: 700;
  letter-spacing: 0.254653px;
  &:hover {
    cursor: pointer;
  }
`;
