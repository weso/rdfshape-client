import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import qs from "query-string";
import React, { useEffect, useRef, useState } from "react";
import API from "../API";
import Cyto from "../components/Cyto";
import {
  InitialData,
  paramsFromStateData,
  updateStateData,
} from "../data/Data";
import { params2Form } from "../Permalink";
import { dataParamsFromQueryParams } from "../utils/Utils";
import VisualizationLinks from "../visualization/VisualizationLinks";
import { generateDownloadLink } from "./CytoVisualize";

// Requests to this endpoint will redirect to the raw visualization of the data requested

function CytoVisualizeRaw(props) {
  const url = API.dataConvert;
  const cose = "cose";
  const circle = "circle";
  const layouts = [cose, circle];

  const refCyto = useRef(null);
  const [data, setData] = useState(InitialData);
  const [params, setParams] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [elements, setElements] = useState(null);
  const [layout, setLayout] = useState(cose);
  const [message] = useState("Processing...");

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      if (queryParams.data || queryParams.dataUrl || queryParams.dataFile) {
        const dataParams = dataParamsFromQueryParams(queryParams);
        const paramsData = updateStateData(dataParams, data) || data;
        setData(paramsData);

        if (queryParams.layout && layouts.includes(queryParams.layout)) {
          setLayout(queryParams.layout);
        }

        const params = {
          ...paramsFromStateData(paramsData),
          targetDataFormat: "JSON",
          layout: queryParams.layout || layout,
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
        params.dataUrl ||
        (params.dataFile && params.dataFile.name)
      ) {
        postConvert();
      } else {
        setError("No RDF data provided");
      }
    }
  }, [params]);

  function postConvert(cb) {
    setLoading(true);
    const formData = params2Form(params);
    formData.append("targetDataFormat", "JSON"); // Converts to JSON elements which are visualized by Cytoscape
    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        const rdfAsJson = data.result.data; // Raw data converted to JSON, as received from server
        processData(rdfAsJson);
        if (cb) cb();
      })
      .catch((error) => {
        const errorCause = error.response?.data?.error || error;
        setError(`Error response from ${url}: ${errorCause}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function processData(data) {
    const elements = JSON.parse(data);
    setElements(elements);
  }

  return (
    <>
      {loading || error || elements ? (
        <>
          {loading ? (
            <p>{message}</p>
          ) : error ? (
            <p>{error}</p>
          ) : elements ? (
            <div style={{ width: "100vw", height: "100vh" }}>
              <div style={{ position: "relative" }} className="cyto-container">
                <VisualizationLinks
                  tooltips={false}
                  styles={{ position: "fixed" }}
                  generateDownloadLink={generateDownloadLink(refCyto)}
                />

                <Cyto layout={layout} elements={elements} refCyto={refCyto} />
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

export default CytoVisualizeRaw;
