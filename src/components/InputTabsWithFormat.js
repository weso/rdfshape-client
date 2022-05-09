import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import InputTabs from "./InputTabs";
import SelectFormat from "./SelectFormat";

function InputTabsWithFormat(props) {
  return (
    <div>
      <InputTabs
        name={props.nameInputTab}
        activeSource={props.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.byTextName}
        textAreaValue={props.textAreaValue}
        textFormat={props.selectedFormat}
        textEngine={props.selectedEngine}
        handleByTextChange={props.handleByTextChange}
        byTextPlaceholder={props.byTextPlaceholder}
        setCodeMirror={props.setCodeMirror}
        byUrlName={props.byUrlName}
        urlValue={props.urlValue}
        handleUrlChange={props.handleUrlChange}
        byURLPlaceholder={props.byURLPlaceholder}
        byFileName={props.byFileName}
        handleFileUpload={props.handleFileUpload}
        fromParams={props.fromParams}
        resetFromParams={props.resetFromParams}

        allowStream={props.allowStream}
        streamValue={props.streamValue}
        handleStreamChange={props.handleStreamChange}
      />
      <SelectFormat
        name={props.nameFormat}
        selectedFormat={props.selectedFormat}
        handleFormatChange={props.handleFormatChange}
        urlFormats={props.urlFormats}
        fromParams={props.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

InputTabsWithFormat.propTypes = {
  /** Name of input tab container */
  nameInputTab: PropTypes.string.isRequired,

  /** Callback to call with the tab changes */
  handleTabChange: PropTypes.func.isRequired,

  /** Selected format */
  selectedFormat: PropTypes.string.isRequired,

  /** Value of textarea */
  textAreaValue: PropTypes.string.isRequired,

  /** Handler for changes in textarea */
  handleByTextChange: PropTypes.func.isRequired,

  /** Callback to obtain a link to the codeMirror */
  setCodeMirror: PropTypes.func.isRequired,

  /** Value of byURL tab */
  urlValue: PropTypes.string.isRequired,

  /** Handler for changes in URL tab */
  handleUrlChange: PropTypes.func.isRequired,

  /** Handler for changes in file upload tab */
  handleFileUpload: PropTypes.func.isRequired,

  /** Name of select format tab */
  nameFormat: PropTypes.string.isRequired,

  /** Handler for changes in format */
  handleFormatChange: PropTypes.func.isRequired,

  /** URL of API call that obtains the list of available formats */
  urlFormats: PropTypes.string.isRequired,

  /** Handler to fill the values with params for the first time */
  resetFromParams: PropTypes.func.isRequired,

  /** Flag to signal if the values are filled from params */
  fromParams: PropTypes.bool.isRequired,

  // Non-required props

  activeSource: PropTypes.string,
  byTextName: PropTypes.string,
  byTextPlaceholder: PropTypes.string,
  byUrlName: PropTypes.string,
  byURLPlaceholder: PropTypes.string,
  byFileName: PropTypes.string,
};

InputTabsWithFormat.defaultProps = {
  activeSource: API.sources.default,
  byTextName: "",
  byTextPlaceholder: "",
  byUrlName: "",
  byUrlPlaceholder: "",
  byFileName: "",
  fromParams: false,
  nameFormat: API.texts.dataTabs.formatHeader,

  textAreaValue: "",
  urlValue: "",
};

export default InputTabsWithFormat;
