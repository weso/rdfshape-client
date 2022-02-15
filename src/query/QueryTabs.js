import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import API from "../API";
import InputTabs from "../components/InputTabs";
import { ApplicationContext } from "../context/ApplicationContext";
import QueryForm from "./QueryForm";

function QueryTabs(props) {
  // Get query and its setter from context
  const { sparqlQuery, setSparqlQuery } = useContext(ApplicationContext);

  // Change context when the contained query changes
  useEffect(() => {
    setSparqlQuery(props.query);
  }, [props.query]);

  const queryForm = (
    <QueryForm
      onChange={props.handleByTextChange}
      value={props.textAreaValue}
      setCodeMirror={props.setCodeMirror}
      fromParams={props.fromParams}
      resetFromParams={props.resetFromParams}
      value={props.textAreaValue}
    />
  );

  return (
    <div>
      <InputTabs
        name={props.name}
        activeSource={props.activeSource || sparqlQuery.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue || sparqlQuery.textArea}
        handleByTextChange={props.handleByTextChange}
        byTextPlaceholder={API.texts.placeholders.sparqlQuery}
        inputForm={queryForm}
        urlValue={props.urlValue || sparqlQuery.url}
        handleUrlChange={props.handleUrlChange}
        byUrlPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        fromParams={props.fromParams || sparqlQuery.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

QueryTabs.propTypes = {
  activeSource: PropTypes.string,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  urlValue: PropTypes.string,
  handleUrlChange: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,

  setCodeMirror: PropTypes.func.isRequired,

  /** Flag to signal if values come from Params */
  fromParams: PropTypes.bool.isRequired,

  /** Function to reset value of fromParams */
  resetFromParams: PropTypes.func.isRequired,
};

QueryTabs.defaultProps = {
  name: API.texts.dataTabs.queryHeader,
  subname: "",
  activeSource: API.sources.default,
};

export default QueryTabs;
