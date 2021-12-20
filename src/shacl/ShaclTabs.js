import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";

function ShaclTabs(props) {
  return (
    <div>
      <InputTabsWithFormat
        nameInputTab={props.name}
        activeSource={props.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue}
        byTextPlaceholder={API.texts.placeholders.shacl}
        handleByTextChange={props.handleByTextChange}
        handleUrlChange={props.handleDataUrlChange}
        urlValue={props.urlValue}
        byURLPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        selectedFormat={props.selectedFormat}
        handleFormatChange={props.handleDataFormatChange}
        urlFormats={API.routes.server.shaclFormats}
        setCodeMirror={props.setCodeMirror}
        fromParams={props.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

ShaclTabs.propTypes = {
  activeSource: PropTypes.string,
  handleTabChange: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  urlValue: PropTypes.string.isRequired,
  handleDataUrlChange: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,

  selectedFormat: PropTypes.string.isRequired,
  handleDataFormatChange: PropTypes.func.isRequired,

  // handleInferenceChange: PropTypes.func.isRequired,
  // selectedInference: PropTypes.string.isRequired,

  resetFromParams: PropTypes.func,
  fromParams: PropTypes.bool,
};

ShaclTabs.defaultProps = {
  name: API.texts.dataTabs.shaclHeader,
  subname: "",
  selectedFormat: API.formats.defaultShacl,
  activeSource: API.sources.default,
};

export default ShaclTabs;
