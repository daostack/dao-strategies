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


  @media (min-width: 576px) { 
    .hide-mobile{
     display:none
   }
  

`;
