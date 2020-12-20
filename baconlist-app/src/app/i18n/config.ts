import enTranslations from "./en.translations.json"
import { createIntl, createIntlCache } from "react-intl"

export enum Locales {
  EN = "en"
}

const locales = [Locales.EN]

const translations = {
  [Locales.EN]: {
    ...enTranslations
  }
}

const cache = createIntlCache()

const intl = createIntl(
  {
    locale: Locales.EN,
    messages: translations[Locales.EN]
  },
  cache
)

const formats = {}

export { locales, translations, formats, intl }
