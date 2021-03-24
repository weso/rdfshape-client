import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import { params2Form } from "../Permalink";
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
  const [targetGraphFormat, setTargetGraphFormat] = useState("SVG");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visualization, setVisualization] = useState(null);
  const [message] = useState("Processing...");

  const url = API.dataConvert;

  const minSvgZoom = minZoom;
  const maxSvgZoom = maxZoom;
  const svgZoomStep = stepZoom;

  function handleTargetGraphFormatChange(value) {
    setTargetGraphFormat(value);
  }

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.compoundData) {
        try {
          const contents = JSON.parse(queryParams.compoundData);

          const newData1 = updateStateData(contents[0], data1) || data1;
          const newData2 = updateStateData(contents[1], data2) || data2;

          if (queryParams.targetGraphFormat) {
            setTargetGraphFormat(queryParams.targetGraphFormat);
          }

          setData1(newData1);
          setData2(newData2);

          setParams({
            ...queryParams,
            targetGraphFormat:
              queryParams.targetGraphFormat || targetGraphFormat,
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
          (p) => p.data || p.dataURL || (p.dataFile && p.dataFile.name)
        )
      ) {
        postVisualize();
      } else {
        setError("No RDF data provided");
      }
      window.scrollTo(0, 0);
    }
  }, [params]);

  function mergeParams(params1, params2) {
    return { compoundData: JSON.stringify([params1, params2]) };
  }

  function processData(d, targetFormat) {
    convertDot(d.result, "dot", targetFormat, setError, setVisualization);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let params1 = paramsFromStateData(data1);
    let params2 = paramsFromStateData(data2);
    setParams({
      ...mergeParams(params1, params2),
      targetDataFormat,
      targetGraphFormat,
    }); // It converts to dot in the server
  }

  function postVisualize(cb) {
    setLoading(true);
    const formData = params2Form(params);
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        processData(data, targetGraphFormat);
        if (cb) cb();
      })
      .catch(function(error) {
        setError(`Error doing request to ${url}: ${error.message}`);
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
