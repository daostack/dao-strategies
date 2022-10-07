import { createGlobalStyle } from 'styled-components';
import { styleConstants } from './themes';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
    scrollbar-color: transparent;
  }
  *::-webkit-scrollbar {
    width: 5px; /* Mostly for vertical scrollbars */
    height: 5px; /* Mostly for horizontal scrollbars */
  }
  *::-webkit-scrollbar-thumb { /* Foreground */
    border-radius: 10px;  
    background: ${styleConstants.colors.scrollbar};
  }
  *::-webkit-scrollbar-track { /* Background */
    background: #ffffff00;
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

  .cropper-view-box {
      box-shadow: 0 0 0 1px #39f;
      border-radius: 50%;
      outline: 0;
  }
  .cropper-face {
      background-color: inherit !important;
  }

  .cropper-view-box {
      outline: inherit !important;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    display: none;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }
`;
