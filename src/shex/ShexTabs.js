import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";

function ShexTabs(props) {
  return (
    <div>
      <InputTabsWithFormat
        nameInputTab={props.name}
        activeSource={props.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue}
        byTextPlaceholder={API.texts.placeholders.shex}
        handleByTextChange={props.handleByTextChange}
        setCodeMirror={props.setCodeMirror}
        handleUrlChange={props.handleShExUrlChange}
        urlValue={props.urlValue}
        byURLPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        selectedFormat={props.selectedFormat}
        handleFormatChange={props.handleShExFormatChange}
        urlFormats={API.routes.server.shExFormats}
        fromParams={props.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

ShexTabs.propTypes = {
  activeSource: PropTypes.string,
  handleTabChange: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  setCodeMirror: PropTypes.func.isRequired,

  urlValue: PropTypes.string.isRequired,
  handleShExUrlChange: PropTypes.func.isRequired,

  handleFileUpload: PropTypes.func.isRequired,
  selectedFormat: PropTypes.string.isRequired,
  handleShExFormatChange: PropTypes.func.isRequired,

  /** Flag to signal if values come from Params */
  fromParams: PropTypes.bool.isRequired,

  /** Function to reset value of fromParams */
  resetFromParams: PropTypes.func.isRequired,
};

ShexTabs.defaultProps = {
  name: API.texts.dataTabs.shexHeader,
  subname: "",
  selectedFormat: API.formats.defaultShex,
  activeSource: API.sources.default,
};

export default ShexTabs;
