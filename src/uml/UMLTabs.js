import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import InputTabs from "../components/InputTabs";

function UMLTabs(props) {
  const umlForm = null;
  return (
    <div>
      <InputTabs
        name={props.name}
        activeSource={props.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue}
        byTextPlaceholder={API.texts.placeholders.xmi}
        handleByTextChange={props.handleByTextChange}
        setCodeMirror={props.setCodeMirror}
        inputForm={umlForm}
        handleUrlChange={props.handleXmiUrlChange}
        urlValue={props.urlValue}
        byURLPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        mode={props.selectedFormat}
        handleFormatChange={props.handleFormatChange}
        urlFormats={API.routes.server.shExFormats}
        fromParams={props.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

UMLTabs.propTypes = {
  activeSource: PropTypes.string,
  handleTabChange: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  setCodeMirror: PropTypes.func.isRequired,

  urlValue: PropTypes.string.isRequired,
  handleXmiUrlChange: PropTypes.func.isRequired,

  handleFileUpload: PropTypes.func.isRequired,
  selectedFormat: PropTypes.string.isRequired,
  //   handleShExFormatChange: PropTypes.func.isRequired,

  /** Flag to signal if values come from Params */
  fromParams: PropTypes.bool.isRequired,

  /** Function to reset value of fromParams */
  resetFromParams: PropTypes.func.isRequired,
};

UMLTabs.defaultProps = {
  name: API.texts.dataTabs.umlHeader,
  subname: "",
  activeSource: API.sources.default,
};

export default UMLTabs;
