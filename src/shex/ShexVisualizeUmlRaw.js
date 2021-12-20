import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import { params2Form } from "../Permalink";
import ResultShexVisualize from "../results/ResultShexVisualizeUml";
import { mkError } from "../utils/ResponseError";
import { visualizationTypes } from "../visualization/ShowVisualization";
import { InitialShex, paramsFromStateShex, updateStateShex } from "./Shex";

function ShexVisualizeUmlRaw(props) {
  const [shex, setShex] = useState(InitialShex);
  const [result, setResult] = useState("");
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message] = useState("Processing...");

  const url = API.routes.server.schemaConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      if (queryParams[API.queryParameters.schema.schema]) {
        const finalSchema = updateStateShex(queryParams, shex) || shex;
        setShex(finalSchema);

        const params = mkParams(finalSchema);
        setParams(params);
      } else {
        setError(API.texts.errorParsingUrl);
      }
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        params[API.queryParameters.schema.schema] &&
        (params[API.queryParameters.schema.source] == API.sources.byFile
          ? params[API.queryParameters.schema.schema].name
          : true)
      ) {
        postVisualize();
      } else {
        setError(API.texts.noProvidedSchema);
      }
    }
  }, [params]);

  function mkParams(shexParams = shex) {
    return {
      ...paramsFromStateShex(shexParams),
      // The server internally converts to a PlantUML SVG string and the client interprets it
      [API.queryParameters.schema.targetFormat]: API.formats.svg,
    };
  }

  function postVisualize(cb) {
    setLoading(true);
    const formData = params2Form(params);

    axios
      .post(url, formData)
      .then((response) => response.data)
      .then(async (data) => {
        setResult(data);
        if (cb) cb();
      })
      .catch(function(error) {
        setError(mkError(error, url));
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      {loading || error || result ? (
        <>
          {loading ? (
            <p>{message}</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ResultShexVisualize
              result={result}
              type={visualizationTypes.svgRaw}
              raw={true}
            />
          )}
        </>
      ) : (
        <p>{message}</p>
      )}
    </>
  );
}

export default ShexVisualizeUmlRaw;
