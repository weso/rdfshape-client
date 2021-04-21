// Pick up configuration injected in window._env_ (if any) and make it available via imports.
// Fallback to .env values
const environmentConfiguration = {
  apiHost: window?._env_?.RDFSHAPE_HOST || process.env.REACT_APP_RDFSHAPE_HOST,
  appVersion: window?._env_?.VERSION || process.env.REACT_APP_VERSION,
};
export default environmentConfiguration;
