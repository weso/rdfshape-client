import API from "../../API";
import axios from "../networking/axiosConfig";
import { getFileContents } from "../Utils";

// Some validations (shunlex, shapeforms) are done in the client, so the client must parse the input,
// whether if it's plain text, a URL to be fetched or a file to be parsed.

// isShEx2Uml: specifies the direction of the conversion
// params: object with the data managed by the user
export async function getConverterInput(params, isShEx2Uml = true) {
  const userData =
    params[API.queryParameters.content] ||
    (isShEx2Uml
      ? params[API.queryParameters.schema.schema]
      : params[API.queryParameters.uml.uml]);

  const userDataSource =
    params[API.queryParameters.source] ||
    (isShEx2Uml
      ? params[API.queryParameters.schema.source]
      : params[API.queryParameters.uml.source]);

  switch (userDataSource) {
    // Plain text, do nothing
    case API.sources.byText:
      return userData.trim();

    // URL, ask the RDFShape server to fetch the contents for us (prevent CORS)
    case API.sources.byUrl:
      const { data: urlContent } = await axios.get(API.routes.server.fetchUrl, {
        params: { url: userData },
      });
      return urlContent;

    // File upload, read the file and return the raw text
    case API.sources.byFile:
      return getFileContents(userData);
  }
}
