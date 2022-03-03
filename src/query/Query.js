import React from "react";
import API from "../API";
import { getItemRaw } from "../utils/Utils";
import QueryTabs from "./QueryTabs";

export const InitialQuery = {
  activeSource: API.defaultTab,
  textArea: "",
  url: "",
  file: null,
  format: API.formats.defaultQuery,
  fromParams: false,
  codeMirror: null,
};

export function updateStateQuery(params, query) {
  // Only update state if there is query
  if (params[API.queryParameters.query.query]) {
    // Get the raw data string introduced by the user
    const userData = params[API.queryParameters.query.query];
    // Get the query source to be used: take it from params or resort to default
    const querySource =
      params[API.queryParameters.query.source] || API.sources.default;

    return {
      ...query,
      activeSource: querySource,
      textArea: querySource == API.sources.byText ? userData : query.textArea, // Fill in the data containers with the user data if necessary. Else leave them as they were.
      url: querySource == API.sources.byUrl ? userData : query.url,
      file: querySource == API.sources.byFile ? userData : query.file,
      fromParams: true,
    };
  }
  return query;
}

export function paramsFromStateQuery(query) {
  let params = {};
  params[API.queryParameters.query.source] = query.activeSource;
  switch (query.activeSource) {
    case API.sources.byText:
      params[API.queryParameters.query.query] = query.textArea.trim();
      break;
    case API.sources.byUrl:
      params[API.queryParameters.query.query] = query.url.trim();
      break;
    case API.sources.byFile:
      params[API.queryParameters.query.query] = query.file;
      break;
    default:
  }
  return params;
}

export function mkQueryTabs(query, setQuery, name, subname) {
  function handleQueryTabChange(value) {
    setQuery({ ...query, activeSource: value });
  }
  function handleQueryByTextChange(value) {
    setQuery({ ...query, textArea: value });
  }
  function handleQueryUrlChange(value) {
    setQuery({ ...query, url: value });
  }
  function handleQueryFileUpload(value) {
    setQuery({ ...query, file: value });
  }
  const resetParams = () => setQuery({ ...query, fromParams: false });

  return (
    <QueryTabs
      query={query}
      name={name}
      subname={subname}
      activeSource={query.activeSource}
      handleTabChange={handleQueryTabChange}
      textAreaValue={query.textArea}
      handleByTextChange={handleQueryByTextChange}
      urlValue={query.url}
      handleUrlChange={handleQueryUrlChange}
      handleFileUpload={handleQueryFileUpload}
      setCodeMirror={(cm) => setQuery({ ...query, codeMirror: cm })}
      fromParams={query.fromParams}
      resetFromParams={resetParams}
    />
  );
}

// Prepare basic server params for when shex is sent to server
export async function mkQueryServerParams(query) {
  return {
    // If by file, parse contents in client before sending
    [API.queryParameters.content]:
      query.activeSource === API.sources.byFile
        ? await getItemRaw(query)
        : query.activeSource === API.sources.byUrl
        ? query.url
        : query.textArea,
    [API.queryParameters.source]: query.activeSource,
  };
}

// Get the text input by the user that forms the query
export function getQueryText(query) {
  if (query.activeSource === API.sources.byText) {
    return encodeURI(query.textArea.trim());
  } else if (query.activeSource === API.sources.byUrl) {
    return encodeURI(query.textArea.trim());
  }
  return "";
}
