import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";

function SHACLTabs(props) {

  return (
    <div>
      <InputTabsWithFormat
        nameInputTab={props.name || ""}
        activeSource={props.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname || ""}
        textAreaValue={props.textAreaValue}
        byTextPlaceholder="SHACL data..."
        handleByTextChange={props.handleByTextChange}
        byUrlName="URL data"
        handleUrlChange={props.handleDataUrlChange}
        urlValue={props.urlValue}
        byURLPlaceholder="http://..."
        byFileName="RDF File"
        handleFileUpload={props.handleFileUpload}
        nameFormat="SHACL format"
        selectedFormat={props.selectedFormat}
        handleFormatChange={props.handleDataFormatChange}
        urlFormats={API.dataFormatsInput}
        setCodeMirror={props.setCodeMirror}
        fromParams={props.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

SHACLTabs.propTypes = {
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

SHACLTabs.defaultProps = {
  name: "SHACL Shapes",
  actiactiveSourceveTab: API.defaultSource,
  // dataFormat: 'TURTLE'
};

export default SHACLTabs;
