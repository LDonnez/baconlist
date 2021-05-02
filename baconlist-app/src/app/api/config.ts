function getEnvVariable(name: string) {
  return process.env[name] || ""
}

const BACONLIST_URL = getEnvVariable("REACT_APP_BACONLIST_URL")

export const API_URLS = {
  baconlist: BACONLIST_URL
}
