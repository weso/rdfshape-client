import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import { params2Form } from "../Permalink";
import { mkError } from "../utils/ResponseError";
import { maxZoom, minZoom, stepZoom } from "../utils/Utils";
import ShowVisualization from "../visualization/ShowVisualization";
import VisualizationLinks from "../visualization/VisualizationLinks";
import { InitialData, paramsFromStateData, updateStateData } from "./Data";
import { generateDownloadLink } from "./DataVisualize";
import { convertDot } from "./dotUtils";

function DataMergeVisualizeRaw(props) {
  const [data1, setData1] = useState(InitialData);
  const [data2, setData2] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [targetDataFormat] = useState("dot");
  const [targetGraphicalFormat] = useState(API.formats.defaultGraphical);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visualization, setVisualization] = useState(null);
  const [message] = useState("Processing...");

  const url = API.routes.server.dataConvert;

  const minSvgZoom = minZoom;
  const maxSvgZoom = maxZoom;
  const svgZoomStep = stepZoom;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.compoundData) {
        try {
          const contents = JSON.parse(queryParams.compoundData);

          const newData1 = updateStateData(contents[0], data1) || data1;
          const newData2 = updateStateData(contents[1], data2) || data2;

          setData1(newData1);
          setData2(newData2);

          setParams({
            ...queryParams,
            targetGraphicalFormat,
          });
        } catch {
          setError("Could not parse URL data");
        }
      } else {
        setError("Could not parse URL data");
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && params.compoundData) {
      const parameters = JSON.parse(params.compoundData);
      if (parameters.some((p) => p.dataFile)) {
        setError("Not implemented Merge from files.");
      } else if (
        parameters.some(
          (p) => p.data || p.dataUrl || (p.dataFile && p.dataFile.name)
        )
      ) {
        postVisualize();
      } else {
        setError("No RDF data provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function processData(dot, targetFormat) {
    convertDot(dot, "dot", targetFormat, setError, setVisualization);
  }

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

export default DataMergeVisualizeRaw;
