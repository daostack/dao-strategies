import { createGlobalStyle } from 'styled-components';

export interface ThemeType {
  colors: {
    body: string;
  };
}

export const GlobalStyles = createGlobalStyle<{ theme: ThemeType }>`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans&display=swap');
  * {
    box-sizing: border-box;
  }
  body {
    background-color: ${({ theme }) => theme.colors.body};
    color: hsl(192, 100%, 9%);
    font-family: 'DM Sans', sans-serif;
    font-size: 1.15em;
    margin: 0;
  }
  p {
    opacity: 0.6;
    line-height: 1.5;
  }
  img {
    max-width: 100%;
}
`;
