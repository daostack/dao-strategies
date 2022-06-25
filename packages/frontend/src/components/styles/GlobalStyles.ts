import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans&display=swap');
  * {
    box-sizing: border-box;
  }
  body {
    background-color: white;
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

  h1 {
    margin: 12px;
  }
`;
