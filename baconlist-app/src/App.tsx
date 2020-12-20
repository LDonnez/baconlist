import React from "react"
import { ThemeProvider } from "styled-components"
import { theme, GlobalStyle } from "components/theme"
import { Provider } from "react-redux"
import store from "./store"
import { Router } from "app/routes/router"
import { IntlProvider } from "react-intl"
import { Locales, translations } from "app/i18n/config"

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Provider store={store}>
        <IntlProvider messages={translations[Locales.EN]} locale={Locales.EN}>
          <Router />
        </IntlProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default App
