import React from "react";
import API from "../API";
import QueryTabs from "./QueryTabs";
// import ShExTabs from "../shex/ShExTabs";

export const InitialQuery = {
  activeSource: API.defaultTab,
  textArea: "",
  url: "",
  file: null,
  fromParams: false,
  codeMirror: null,
};

export function updateStateQuery(params, query) {
  // Only update state if there is query
  if (params["query"]) {
    // Get the raw data string introduced by the user
    const userData = params["query"];
    // Get the query source to be used: take it from params or resort to default
    const querySource = params["querySource"] || API.defaultSource;

    return {
      ...query,
      activeSource: querySource,
      textArea: querySource == API.byTextSource ? userData : query.textArea, // Fill in the data containers with the user data if necessary. Else leave them as they were.
      url: querySource == API.byUrlSource ? userData : query.url,
      file: querySource == API.byFileSource ? userData : query.file,
      fromParams: true,
    };
  }
  return query;
}

export function queryParamsFromQueryParams(params) {
  // if (params["queryUrl"]) params["url"] = params["queryUrl"];
  // return params;

  let newParams = {};
  if (params.query) newParams["query"] = params.query;
  if (params.querySource) newParams["querySource"] = params.querySource;

  return newParams;
}

export function paramsFromStateQuery(query) {
  let params = {};
  params["querySource"] = query.activeSource;
  switch (query.activeSource) {
    case API.byTextSource:
      params["query"] = query.textArea.trim();
      break;
    case API.byUrlSource:
      params["query"] = query.url.trim();
      break;
    case API.byFileSource:
      params["query"] = query.file;
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

export function getQueryText(query) {
  if (query.activeSource === API.byTextSource) {
    return encodeURI(query.textArea.trim());
  } else if (query.activeSource === API.byUrlSource) {
    return encodeURI(query.textArea.trim());
  }
  return "";
}
