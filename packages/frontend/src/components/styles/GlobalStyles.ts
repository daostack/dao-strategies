import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
  }
  body {
    font-size: 1.15em;
    margin: 0;
  }
  p {
    }
  img {
    max-width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0px 0px;
  }

`;
