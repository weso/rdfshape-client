import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import { params2Form } from "../Permalink";
import { processDotData } from "../utils/dot/dotUtils";
import { mkError } from "../utils/ResponseError";
import ShowVisualization from "../visualization/ShowVisualization";
import VisualizationLinks from "../visualization/VisualizationLinks";
import { InitialData, updateStateData } from "./Data";

function DataMergeVisualizeRaw(props) {
  const [data1, setData1] = useState(InitialData);
  const [data2, setData2] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visualization, setVisualization] = useState(null);
  const [message] = useState("Processing...");

  const url = API.routes.server.dataConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams[API.queryParameters.data.compound]) {
        try {
          const contents = JSON.parse(
            queryParams[API.queryParameters.data.compound]
          );
          setData1(updateStateData(contents[0], data1) || data1);
          setData2(updateStateData(contents[1], data2) || data2);

          setParams(queryParams);
        } catch {
          setError(API.texts.errorParsingUrl);
        }
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && params[API.queryParameters.data.compound]) {
      const parameters = JSON.parse(params[API.queryParameters.data.compound]);
      if (
        parameters.some(
          (p) => p[API.queryParameters.data.source] == API.sources.byFile
        )
      ) {
        setError("Not implemented Merge from files.");
      } else if (
        parameters.some(
          (p) =>
            p[API.queryParameters.data.data] &&
            (p[API.queryParameters.data.source] == API.sources.byFile
              ? params[API.queryParameters.data.data].name
              : true) // Extra check for files
        )
      ) {
        postVisualize();
      } else {
        setError(API.texts.noProvidedRdf);
      }
      window.scrollTo(0, 0);
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
            <div style={{ width: "100vw", height: "100vh" }}>
              <div
                style={{ position: "relative" }}
                className="width-100 height-100"
              >
                <VisualizationLinks
                  styles={{ position: "fixed" }}
                  generateDownloadLink={() => {}} // generateDownloadLink(visualization)}
                />

                <ShowVisualization data={visualization.data} />
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p>{message}</p>
      )}
    </>
  );
}

export default DataMergeVisualizeRaw;
