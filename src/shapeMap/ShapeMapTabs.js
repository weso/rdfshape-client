import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";
import { ApplicationContext } from "../context/ApplicationContext";

function ShapeMapTabs(props) {
  // Get shapeMap and its setter from context
  const { shapeMap: ctxShapeMap, setShapeMap: setCtxShapeMap } = useContext(
    ApplicationContext
  );

  // Change context when the contained shapeMap changes
  useEffect(() => {
    setCtxShapeMap(props.shapeMap);
  }, [props.shapeMap]);

  return (
    <div>
      <InputTabsWithFormat
        defaultFormat={API.formats.defaultShapeMap}
        nameInputTab={props.name}
        activeSource={props.activeSource || ctxShapeMap.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname}
        textAreaValue={props.textAreaValue || ctxShapeMap.textArea}
        byTextPlaceholder={API.texts.placeholders.shapeMap}
        handleByTextChange={props.handleByTextChange}
        handleUrlChange={props.handleUrlChange}
        urlValue={props.urlValue || ctxShapeMap.url}
        byURLPlaceholder={API.texts.placeholders.url}
        handleFileUpload={props.handleFileUpload}
        selectedFormat={props.selectedFormat || ctxShapeMap.format}
        handleFormatChange={props.handleFormatChange}
        urlFormats={API.routes.server.shapeMapFormats}
        fromParams={props.fromParams || ctxShapeMap.fromParams}
        resetFromParams={props.resetFromParams}
        setCodeMirror={props.setCodeMirror}
      />
    </div>
  );
}

ShapeMapTabs.propTypes = {
  /** Application shapeMap data */
  shapeMap: PropTypes.object.isRequired,

  /** Active source */
  activeSource: PropTypes.string,

  /** Textarea value */
  textAreaValue: PropTypes.string,

  /** Handles changed in textarea */
  handleByTextChange: PropTypes.func.isRequired,

  /** Handles changes in file upload tab */
  handleFileUpload: PropTypes.func.isRequired,

  /** Handles URl changes */
  handleUrlChange: PropTypes.func.isRequired,

  /** Selected format */
  selectedFormat: PropTypes.string.isRequired,

  /** Handles format changes */
  handleFormatChange: PropTypes.func.isRequired,

  /** Handler to reset value from params */
  resetFromParams: PropTypes.func.isRequired,

  /** Flag to signal if the values come from params */
  fromParams: PropTypes.bool.isRequired,
};

ShapeMapTabs.defaultProps = {
  name: API.texts.dataTabs.shapeMapHeader,
  subname: "",
  activeSource: API.sources.default,
  selectedFormat: API.formats.defaultShapeMap,
};

export default ShapeMapTabs;
