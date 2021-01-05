import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import InputTabsWithFormat from "../components/InputTabsWithFormat";

function ShapeMapTabs(props) {
  return (
    <div>
      <InputTabsWithFormat
        defaultFormat={"Compact"}
        nameInputTab={props.name || ""}
        activeTab={props.activeTab}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname || ""}
        textAreaValue={props.textAreaValue}
        byTextPlaceholder="<node>@<Shape>...>"
        handleByTextChange={props.handleByTextChange}
        byUrlName="URL shapeMap"
        handleUrlChange={props.handleUrlChange}
        urlValue={props.urlValue}
        byURLPlaceholder="http://..."
        byFileName="ShapeMap File"
        handleFileUpload={props.handleFileUpload}
        nameFormat="ShapeMap format"
        selectedFormat={props.selectedFormat}
        handleFormatChange={props.handleFormatChange}
        urlFormats={API.shapeMapFormats}
        fromParams={props.fromParams}
        resetFromParams={props.resetFromParams}
        setCodeMirror={props.setCodeMirror}
      />
    </div>
  );
}

ShapeMapTabs.propTypes = {
  /** Active tab */
  activeTab: PropTypes.string,

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
  activeTab: "ByText",
  shapeMapFormat: "TURTLE",
};

export default ShapeMapTabs;
