import axios from "axios";
import environmentConfiguration from "../../EnvironmentConfig";

export const rootApi = environmentConfiguration.apiHost + "/api/";
export const rootWsApi = environmentConfiguration.wsApiHost + "/api/";

// Global axios instance with default settings for API connections
export default axios.create({
  baseURL: rootApi,
});
