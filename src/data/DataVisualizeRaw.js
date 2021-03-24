import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import { params2Form } from "../Permalink";
import { dataParamsFromQueryParams } from "../utils/Utils";
import ShowVisualization from "../visualization/ShowVisualization";
import VisualizationLinks from "../visualization/VisualizationLinks";
import { InitialData, paramsFromStateData, updateStateData } from "./Data";
import { generateDownloadLink } from "./DataVisualize";
import { convertDot } from "./dotUtils";

// Requests to this endpoint will redirect to the raw visualization of the data requested

function DataVisualizeRaw(props) {
  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetGraphFormat, setTargetGraphFormat] = useState("SVG");
  const [visualization, setVisualization] = useState(null);
  const [message] = useState("Processing...");

  const url = API.dataConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.data || queryParams.dataURL || queryParams.dataFile) {
        const dataParams = dataParamsFromQueryParams(queryParams);
        const paramsData = updateStateData(dataParams, data) || data;
        setData(paramsData);

        if (queryParams.targetDataFormat) {
          setTargetGraphFormat(queryParams.targetDataFormat);
        }

        const params = {
          ...paramsFromStateData(paramsData),
          targetGraphFormat: queryParams.targetDataFormat || undefined,
          targetDataFormat: queryParams.targetDataFormat || undefined,
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
        params.data ||
        params.dataURL ||
        (params.dataFile && params.dataFile.name)
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
    formData.append("targetDataFormat", "dot"); // It converts to dot in the server
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        processData(data, targetGraphFormat);
        if (cb) cb();
      })
      .catch(function(error) {
        setError(`Error response from ${url}: ${error.message.toString()}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function processData(d, targetFormat) {
    convertDot(d.result, "dot", targetFormat, setError, setVisualization);
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
