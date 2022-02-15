import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import API from "../API";
import SelectFormat from "../components/SelectFormat";
import { ApplicationContext } from "../context/ApplicationContext";

function SelectInferenceEngine(props) {
  // We may be selecting the inference for RDF or for SHACL
  const inferenceTargets = Object.freeze({
    rdf: "rdf",
    shacl: "shacl",
  });
  const inferenceTarget = props.shacl
    ? inferenceTargets.shacl
    : inferenceTargets.rdf;

  // Get potentially necessary data from context
  const {
    rdfData: ctxDataSet,
    setRdfData: setCtxDataSet,
    shaclSchema: ctxShacl,
    setShaclSchema: setCtxShacl,
  } = useContext(ApplicationContext);

  useEffect(() => {
    switch (inferenceTarget) {
      case inferenceTargets.rdf:
        setCtxDataSet(props.data);
      // setCtxDataSet(
      //   ctxDataSet.reduce(
      //     (acc, curr, idx) =>
      //       props.data.index === idx ? [...acc, props.data] : [...acc, curr],
      //     []
      //   )
      // );
      case inferenceTargets.shacl:
        setCtxShacl(props.shacl);
      default:
        return;
    }
  }, [props.data, props.shacl]);

  // In case we are manipulating data, the index in the data array that we are manipulating
  const dataIndex = props?.data?.index || 0;

  return (
    <SelectFormat
      handleFormatChange={props.handleInferenceChange}
      selectedFormat={
        props.selectedInference ||
        (inferenceTarget === inferenceTargets.shacl
          ? ctxShacl.inference
          : ctxDataSet.inference)
      }
      urlFormats={API.routes.server.inferenceEngines}
      name={props.name}
    />
  );
}

SelectInferenceEngine.propTypes = {
  data: PropTypes.object,
  shacl: PropTypes.object,

  handleInferenceChange: PropTypes.func.isRequired,
  selectedInference: PropTypes.string.isRequired,
  resetFromParams: PropTypes.func,
  fromParams: PropTypes.bool,
};

SelectInferenceEngine.defaultProps = {
  name: "Inference",
};

export default SelectInferenceEngine;
