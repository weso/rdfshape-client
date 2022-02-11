import axios from "axios";
import React from "react";
import API from "../API";
import { getFileContents } from "../utils/Utils";
import QueryTabs from "./QueryTabs";
// import ShExTabs from "../shex/ShExTabs";

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

// Get the text input by the user that forms the query
export function getQueryText(query) {
  if (query.activeSource === API.sources.byText) {
    return encodeURI(query.textArea.trim());
  } else if (query.activeSource === API.sources.byUrl) {
    return encodeURI(query.textArea.trim());
  }
  return "";
}

// Given the query in state, extract the text contained in it
// (manual input => return text)
// (url => fetch url and return result)
// (file => read file and return its contents)
export async function getQueryRaw(query) {
  if (query.activeSource === API.sources.byText) {
    return query.textArea.trim();
  } else if (query.activeSource === API.sources.byUrl) {
    return (await axios.get(query.url.trim())).data;
  } else if (query.activeSource === API.sources.byFile) {
    return await getFileContents(query.file);
  }
  return "";
}
