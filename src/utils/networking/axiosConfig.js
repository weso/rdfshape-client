import axios from "axios";
import environmentConfiguration from "../../EnvironmentConfig";

export const rootApi = environmentConfiguration.apiHost + "/api/";

// Global axios instance with default settings for API connections
export default axios.create({
  baseURL: rootApi,
});
