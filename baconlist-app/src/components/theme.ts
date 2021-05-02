import { createGlobalStyle } from "styled-components"
import spaceMonoRegular from "assets/fonts/SpaceMono-Regular.ttf"

export const theme = {
  colors: {
    primary: {
      black: "#000000"
    },
    secondary: {
      white: "#ffffff"
    }
  },
  fontSize: {
    label: "18px"
  }
}

export const GlobalStyle = createGlobalStyle`
 @font-face {
    font-family: space-mono;
    src: url(${spaceMonoRegular}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  html {
    font-size: 10px;
    font-family: space-mono;
    heigth: 100%;
  }
  body {
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box;
    height: 100%;
  }
`
