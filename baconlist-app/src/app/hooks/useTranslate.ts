import { useIntl } from "react-intl"

export const useTranslate = () => {
  const { formatMessage, messages } = useIntl()

  const translate = (id: string, values?: {}): string =>
    formatMessage({ id }, values)

  const hasTranslations = (id: string) => messages[id]

  return { translate, hasTranslations }
}
