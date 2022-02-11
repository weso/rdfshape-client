import "bootstrap/dist/css/bootstrap.min.css";
import qs from "query-string";
import React, { useEffect, useState } from "react";
import API from "../API";
import {
  mkDataVisualization,
  paramsFromStateData,
  updateStateData
} from "../data/Data";
import {
  mkShaclVisualization,
  paramsFromStateShacl,
  updateStateShacl
} from "../shacl/Shacl";
import {
  mkShexVisualization,
  paramsFromStateShex,
  updateStateShex
} from "../shex/Shex";
import {
  mkUmlVisualization,
  paramsFromStateUML,
  updateStateUml
} from "../uml/UML";

// Given some data and a target visualization type, fullscreen visualizations
// meant to be embedded in iframes, etc. will be computed by the component
function VisualizeRaw(props) {
  const [userInput, setUserInput] = useState(null);
  const [visualization, setVisualization] = useState(null);

  // Monitor the type of data to be visualized and the target visualization type
  const [visualizationType, setVisualizationType] = useState(null);
  const [visualizationTarget, setVisualizationTarget] = useState(null);

  const [params, setParams] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message] = useState("Processing...");

  const url = API.routes.server.dataConvert;

  useEffect(() => {
    if (props.location?.search) {
      const queryParams = qs.parse(props.location.search);

      // Check for necessary parameters
      if (
        queryParams[API.queryParameters.visualization.type] &&
        queryParams[API.queryParameters.visualization.target]
      ) {
        const type = queryParams[API.queryParameters.visualization.type];
        const target = queryParams[API.queryParameters.visualization.target];
        // Set visualization type and target
        setVisualizationType(type);
        setVisualizationTarget(target);

        // Set the user input to whatever is necessary (data, schema, uml...)
        const finalInput =
          type == API.queryParameters.visualization.types.data
            ? updateStateData(queryParams, userInput)
            : type == API.queryParameters.visualization.types.shex
            ? updateStateShex(queryParams, userInput)
            : type == API.queryParameters.visualization.types.shacl
            ? updateStateShacl(queryParams, userInput)
            : type == API.queryParameters.visualization.types.uml
            ? updateStateUml(queryParams, userInput)
            : null;

        // No input parsed: error
        if (!finalInput) {
          setError(API.texts.errorParsingUrl);
          return;
        }
        // Input was byFile: error
        if (finalInput?.activeSource === API.sources.byFile) {
          setError(API.texts.noEmbeddedFile);
          return;
        } else {
          setUserInput(finalInput);

          const params = mkParams(finalInput, type, target);
          setParams(params);
        }
      } else {
        setError(API.texts.errorParsingUrl);
      }
    } else setError(API.texts.emptyDataUrl);
  }, [props.location?.search]);

  useEffect(() => {
    if (!params) return;
    // Take for granted the data exists
    // Invoke the function that will evaluate the input, vType and vTarget and invoke the logic needed
    // (as in ShEx convert)
    const setUpVisual = async () => {
      try {
        const visual = await createVisualization();
        setVisualization(visual);
      } catch (err) {
        setError(err.toString());
      }
    };
    setUpVisual();
  }, [params]);

  // Create the params needed to compute the visualization for the type and target provided
  function mkParams(
    pInput = userInput,
    pType = visualizationType,
    pTarget = visualizationTarget
  ) {
    // Base params
    const baseParams =
      pType === API.queryParameters.visualization.types.data
        ? paramsFromStateData(pInput)
        : pType === API.queryParameters.visualization.types.shex
        ? paramsFromStateShex(pInput)
        : pType === API.queryParameters.visualization.types.shacl
        ? paramsFromStateShacl(pInput)
        : pType === API.queryParameters.visualization.types.uml
        ? paramsFromStateUML(pInput)
        : null;

    if (!baseParams) {
      setError(API.texts.invalidVisualizationType);
      return;
    }
    // Switch types
    switch (pType) {
      case API.queryParameters.visualization.types.data:
        // Switch targets
        if (pTarget === API.queryParameters.visualization.targets.svg)
          return {
            ...baseParams,
            [API.queryParameters.data.targetFormat]: API.formats.dot,
          };
        else if (pTarget === API.queryParameters.visualization.targets.cyto)
          return {
            ...baseParams,
            [API.queryParameters.data.targetFormat]: API.formats.json,
          };
        else setError(API.texts.invalidVisualizationTarget);

      case API.queryParameters.visualization.types.shex:
        if (pTarget === API.queryParameters.visualization.targets.svg)
          return {
            ...baseParams,
            [API.queryParameters.schema.targetFormat]: API.formats.svg,
          };
        else if (pTarget === API.queryParameters.visualization.targets.cyto)
          return {
            ...baseParams,
            [API.queryParameters.schema.targetFormat]: API.formats.json,
          };
        else setError(API.texts.invalidVisualizationTarget);

      case API.queryParameters.visualization.types.shacl:
        if (pTarget === API.queryParameters.visualization.targets.svg)
          return {
            ...baseParams,
            [API.queryParameters.schema.targetFormat]: API.formats.svg,
          };
        else setError(API.texts.invalidVisualizationTarget);

      case API.queryParameters.visualization.types.uml:
        if (pTarget === API.queryParameters.visualization.targets.svg)
          return {
            ...baseParams,
            [API.queryParameters.uml.targetFormat]: API.formats.svg,
          };
        else setError(API.texts.invalidVisualizationTarget);

      default:
        return;
    }
  }

  async function createVisualization() {
    const visualizationOptions = {
      raw: true,
      embedLink: false,
    };
    switch (visualizationType) {
      case API.queryParameters.visualization.types.data:
        return await mkDataVisualization(
          params,
          visualizationTarget,
          visualizationOptions
        );

      case API.queryParameters.visualization.types.shex:
        return await mkShexVisualization(
          params,
          visualizationTarget,
          visualizationOptions
        );
      case API.queryParameters.visualization.types.shacl:
        return await mkShaclVisualization(
          params,
          visualizationTarget,
          visualizationOptions
        );
      case API.queryParameters.visualization.types.uml:
        return await mkUmlVisualization(
          params,
          visualizationTarget,
          visualizationOptions
        );
    }
  }

  return (
    <>
      {loading || error || visualization ? (
        <>
          {loading ? <p>{message}</p> : error ? <p>{error}</p> : visualization}
        </>
      ) : (
        <p>{message}</p>
      )}
    </>
  );
}

export default VisualizeRaw;
