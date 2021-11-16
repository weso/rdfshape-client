import axios from "axios";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import { params2Form } from "../Permalink";
import ResultShExVisualize from "../results/ResultShExVisualize";
import { mkError } from "../utils/ResponseError";
import VisualizationLinks from "../visualization/VisualizationLinks";
import {
  InitialShEx,
  paramsFromStateShEx,
  shExParamsFromQueryParams,
  updateStateShEx
} from "./ShEx";
import { generateDownloadLink } from "./ShExVisualize";

function ShExVisualizeRaw(props) {
  const [shex, setShex] = useState(InitialShEx);
  const [result, setResult] = useState("");
  const [params, setParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message] = useState("Processing...");

  const url = API.routes.server.schemaVisualize;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);
      let paramsShEx = {};

      if (
        queryParams.schema ||
        queryParams.schemaUrl ||
        queryParams.schemaFile
      ) {
        const schemaParams = shExParamsFromQueryParams(queryParams);
        const finalSchema = updateStateShEx(schemaParams, shex) || shex;
        setShex(finalSchema);
        paramsShEx = finalSchema;
      }

      let params = {
        ...paramsFromStateShEx(paramsShEx),
        schemaEngine: "ShEx",
      };
      setParams(params);
    }
  }, [props.location?.search]);

  useEffect(() => {
    if (params && !loading) {
      if (
        params.schema ||
        params.schemaUrl ||
        (params.schemaFile && params.schemaFile.name)
      ) {
        postVisualize();
      } else {
        setError("No ShEx schema provided");
      }
    }
  }, [params]);

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
          ) : error || result?.error ? (
            <p>{error || result?.error}</p>
          ) : result && !result.error ? (
            <div style={{ width: "100vw", height: "100vh" }}>
              <div
                style={{ position: "relative" }}
                className="width-100 height-100"
              >
                <VisualizationLinks
                  tooltips={false}
                  styles={{ position: "fixed" }}
                  generateDownloadLink={generateDownloadLink(result)}
                />

                <ResultShExVisualize result={result} showDetails={false} />
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

export default ShExVisualizeRaw;
