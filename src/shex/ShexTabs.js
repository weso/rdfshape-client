import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";
import { ApplicationContext } from "../context/ApplicationContext";

function ShexTabs(props) {
  // Get schema and its setter from context
  const { shexSchema: ctxShex, setShexSchema: setCtxShex } = useContext(
    ApplicationContext
  );

  // Change context when the contained schema changes
  useEffect(() => {
    setCtxShex(props.shex);
  }, [props.shex]);

  return (
    <div>
      <InputTabsWithFormat
        nameInputTab={props.name}
        activeSource={props.activeSource || ctxShex.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue || ctxShex.textArea}
        byTextPlaceholder={API.texts.placeholders.shex}
        handleByTextChange={props.handleByTextChange}
        setCodeMirror={props.setCodeMirror}
        handleUrlChange={props.handleShExUrlChange}
        urlValue={props.urlValue || ctxShex.url}
        byURLPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        selectedFormat={props.selectedFormat || ctxShex.format}
        handleFormatChange={props.handleShExFormatChange}
        urlFormats={API.routes.server.shExFormats}
        fromParams={props.fromParams || ctxShex.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

ShexTabs.propTypes = {
  shex: PropTypes.object.isRequired,
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
