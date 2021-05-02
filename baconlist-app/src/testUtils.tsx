import React from "react"
import { ThemeProvider } from "styled-components"
import { render } from "@testing-library/react"
import { theme, GlobalStyle } from "components/theme"
import { Provider } from "react-redux"
import store from "./store"
import { IntlProvider } from "react-intl"
import { Locales, translations } from "app/i18n/config"
import { Router } from "react-router-dom"
import { history } from "reducers"

type Props = {
  children: React.ReactNode
}

const TestApp: React.FC<any> = ({ children }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Provider store={store}>
        <IntlProvider messages={translations[Locales.EN]} locale={Locales.EN}>
          <Router history={history}>{children}</Router>
        </IntlProvider>
      </Provider>
    </ThemeProvider>
  )
}

const customRender = (ui: React.ReactElement) =>
  render(ui, { wrapper: TestApp })

export * from "@testing-library/react"

export { customRender as render }
