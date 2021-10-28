import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";

function DataTabs(props) {

  return (
    <div>
      <InputTabsWithFormat
        nameInputTab={props.name}
        activeSource={props.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname || ""}
        textAreaValue={props.textAreaValue}
        byTextPlaceholder="RDF data..."
        handleByTextChange={props.handleByTextChange}
        byUrlName="URL data"
        handleUrlChange={props.handleDataUrlChange}
        urlValue={props.urlValue}
        byURLPlaceholder="http://..."
        byFileName="RDF File"
        handleFileUpload={props.handleFileUpload}
        nameFormat="Data format"
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

DataTabs.propTypes = {
  activeSource: PropTypes.string,
  handleTabChange: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  urlValue: PropTypes.string.isRequired,
  handleDataUrlChange: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,

  selectedFormat: PropTypes.string.isRequired,
  handleDataFormatChange: PropTypes.func.isRequired,

  resetFromParams: PropTypes.func,
  fromParams: PropTypes.bool,
};

DataTabs.defaultProps = {
  name: "",
  activeSource: API.defaultSource,
};

export default DataTabs;
