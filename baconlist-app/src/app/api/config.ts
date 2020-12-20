function getEnvVariable(name: string) {
  return process.env[name] || ""
}

const EXAMPLE_URL = getEnvVariable("REACT_APP_EXAMPLE_URL")

export const API_URLS = {
  example: EXAMPLE_URL
}
