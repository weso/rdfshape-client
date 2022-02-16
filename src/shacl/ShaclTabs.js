import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";
import { ApplicationContext } from "../context/ApplicationContext";

function ShaclTabs(props) {
  // Get schema and its setter from context
  const { shaclSchema: ctxShacl, setShaclSchema: setCtxShacl } = useContext(
    ApplicationContext
  );

  // Change context when the contained schema changes
  useEffect(() => {
    setCtxShacl(props.shacl);
  }, [props.shacl]);
  return (
    <div>
      <InputTabsWithFormat
        nameInputTab={props.name}
        activeSource={props.activeSource || ctxShacl.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue || ctxShacl.textArea}
        byTextPlaceholder={API.texts.placeholders.shacl}
        handleByTextChange={props.handleByTextChange}
        handleUrlChange={props.handleDataUrlChange}
        urlValue={props.urlValue || ctxShacl.url}
        byURLPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        selectedFormat={props.selectedFormat || ctxShacl.format}
        selectedEngine={props.selectedEngine || ctxShacl.engine}
        handleFormatChange={props.handleDataFormatChange}
        urlFormats={API.routes.server.shaclFormats}
        setCodeMirror={props.setCodeMirror}
        fromParams={props.fromParams || ctxShacl.fromParams}
        resetFromParams={props.resetFromParams}
      />
    </div>
  );
}

ShaclTabs.propTypes = {
  shacl: PropTypes.object.isRequired,
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

ShaclTabs.defaultProps = {
  name: API.texts.dataTabs.shaclHeader,
  subname: "",
  selectedFormat: API.formats.defaultShacl,
  activeSource: API.sources.default,
};

export default ShaclTabs;
