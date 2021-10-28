import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import { params2Form } from "../Permalink";
import ResponseError, { mkError } from "../utils/ResponseError";
import ShowVisualization from "../visualization/ShowVisualization";
import VisualizationLinks from "../visualization/VisualizationLinks";
import {
  InitialData,
  paramsFromStateData,
  updateStateData,
  dataParamsFromQueryParams,
} from "./Data";
import { generateDownloadLink } from "./DataVisualize";
import { convertDot } from "./dotUtils";

// Requests to this endpoint will redirect to the raw visualization of the data requested

function DataVisualizeRaw(props) {
  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetGraphicalFormat] = useState(API.defaultGraphicalFormat);
  const [visualization, setVisualization] = useState(null);
  const [message] = useState("Processing...");

  const url = API.dataConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.data) {
        const dataParams = dataParamsFromQueryParams(queryParams);
        const paramsData = updateStateData(dataParams, data) || data;
        setData(paramsData);

        const params = {
          ...paramsFromStateData(paramsData),
          targetGraphicalFormat,
        };

        setParams(params);
      } else {
        setError("Could not parse URL data");
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params) {
      if (
        params.data &&
        (params.dataSource == API.byFileSource ? params.data.name : true) // Extra check for files
      ) {
        postVisualize();
      } else {
        setError("No RDF data provided");
      }
    }
  }, [params]);

  function postVisualize(cb) {
    setLoading(true);
    const formData = params2Form(params);
    formData.append("targetDataFormat", "dot");
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        const dot = data.result.data; // Get the DOT string from the axios data object
        processData(dot, targetGraphicalFormat);
        if (cb) cb();
      })
      .catch(function(error) {
        setError(mkError(error, url));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function processData(dot, targetFormat) {
    convertDot(dot, "dot", targetFormat, setError, setVisualization);
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
                  tooltips={false}
                  styles={{ position: "fixed" }}
                  generateDownloadLink={generateDownloadLink(visualization)}
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

export default DataVisualizeRaw;
