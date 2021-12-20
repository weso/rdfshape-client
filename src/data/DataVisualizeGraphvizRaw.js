import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import { params2Form } from "../Permalink";
import ResultDataVisualize from "../results/ResultDataVisualize";
import { mkError } from "../utils/ResponseError";
import { visualizationTypes } from "../visualization/ShowVisualization";
import { InitialData, paramsFromStateData, updateStateData } from "./Data";
import { processDotData } from "./DataVisualizeGraphviz";

// Requests to this endpoint will redirect to the raw visualization of the data requested

function DataVisualizeGraphvizRaw(props) {
  const [data, setData] = useState(InitialData);
  const [result, setResult] = useState({});
  const [visualization, setVisualization] = useState(null);

  const [params, setParams] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message] = useState("Processing...");

  const url = API.routes.server.dataConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.data.data]) {
        const paramsData = updateStateData(queryParams, data) || data;
        setData(paramsData);

        const params = paramsFromStateData(paramsData);

        setParams(params);
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      if (
        params[API.queryParameters.data.data] &&
        (params[API.queryParameters.data.source] == API.sources.byFile
          ? params[API.queryParameters.data.data].name
          : true) // Extra check for files
      ) {
        postVisualize();
      } else {
        setError(API.texts.noProvidedRdf);
      }
    }
  }, [params]);

  function postVisualize(cb) {
    setLoading(true);
    const formData = params2Form(params);
    formData.append(API.queryParameters.data.targetFormat, API.formats.dot);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        const dot = data.result.data; // Get the DOT string from the axios data object
        processDotData(dot, setError, setVisualization);
        if (cb) cb();
      })
      .catch(function(error) {
        setError(mkError(error, url));
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <>
      {loading || error || visualization ? (
        <>
          {loading ? (
            <p>{message}</p>
          ) : error ? (
            <p>{error}</p>
          ) : visualization && visualization.data ? (
            <ResultDataVisualize
              result={result}
              data={visualization.data}
              type={visualizationTypes.svgObject}
              raw={true}
            />
          ) : null}
        </>
      ) : (
        <p>{message}</p>
      )}
    </>
  );
}

export default DataVisualizeGraphvizRaw;
