import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import qs from "query-string";
import React, { useEffect, useRef, useState } from "react";
import API from "../API";
import {
  InitialData,
  paramsFromStateData,
  updateStateData
} from "../data/Data";
import { params2Form } from "../Permalink";
import ResultDataVisualize from "../results/ResultDataVisualize";
import { mkError } from "../utils/ResponseError";
import { visualizationTypes } from "../visualization/ShowVisualization";
import { breadthfirst, getLayoutByUIName } from "./DataVisualizeCytoscape";

// Requests to this endpoint will redirect to the raw visualization of the data requested

function DataVisualizeCytoscapeRaw(props) {
  const url = API.routes.server.dataConvert;

  const [data, setData] = useState(InitialData);
  const [result, setResult] = useState({});
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message] = useState("Processing...");

  // Data passed down to the visualization components
  const [visualizationData, setVisualizationData] = useState({});
  const [elements, setElements] = useState(null);
  const [layout, setLayout] = useState(breadthfirst);
  const refCyto = useRef(null);

  // Update the data passed down to visualizations whenever needed
  useEffect(() => {
    setVisualizationData({
      layout,
      elements,
      refCyto,
    });
  }, [layout, elements, refCyto]);

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.data.data]) {
        const finalData = updateStateData(queryParams, data) || data;
        setData(finalData);

        if (queryParams[API.queryParameters.data.layout]) {
          const userLayout = getLayoutByUIName(
            queryParams[API.queryParameters.data.layout]
          );
          userLayout && setLayout(userLayout);
        }

        const params = {
          ...paramsFromStateData(finalData),
          [API.queryParameters.data.layout]:
            queryParams[API.queryParameters.data.layout] || layout.uiName,
        };

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
        postConvert();
      } else {
        setError(API.texts.noProvidedRdf);
      }
    }
  }, [params]);

  function postConvert(cb) {
    setLoading(true);
    const formData = params2Form(params);
    formData.append(API.queryParameters.data.targetFormat, API.formats.json); // Converts to JSON elements which are visualized by Cytoscape
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        setElements(JSON.parse(data.result.data));
        if (cb) cb();
      })
      .catch((error) => {
        setError(mkError(error, url));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Update the data passed down to visualizations whenever needed
  useEffect(() => {
    setVisualizationData({
      layout,
      elements,
      refCyto,
    });
  }, [layout, elements, refCyto]);

  return (
    <>
      {loading || elements || error ? (
        <>
          {loading ? (
            <p>{message}</p>
          ) : error ? (
            <p>{error}</p>
          ) : elements ? (
            <ResultDataVisualize
              result={result}
              data={visualizationData}
              type={visualizationTypes.cytoscape}
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

export default DataVisualizeCytoscapeRaw;
