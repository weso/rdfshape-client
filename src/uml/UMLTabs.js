import PropTypes from "prop-types";
import React from "react";
import API from "../API";
import InputTabs from "../components/InputTabs";

function UMLTabs(props) {
  const umlForm = null; /**<UMLForm // id="textAreaShEx"
                               onChange={props.handleByTextChange}
                               setCodeMirror={props.setCodeMirror}
                               fromParams={props.fromParams}
                               resetFromParams={props.resetFromParams}
                               value={props.textAreaValue} />;**/

  return (
    <div>
      <InputTabs
        name={"UML Input (XMI)"}
        activeSource={props.activeSource}
        handleTabChange={props.handleTabChange}
        byTextName={props.subname || ""}
        textAreaValue={props.textAreaValue}
        byTextPlaceholder="XMI..."
        handleByTextChange={props.handleByTextChange}
        setCodeMirror={props.setCodeMirror}
        inputForm={umlForm}
        byUrlName="XMI URL"
        handleUrlChange={props.handleXmiUrlChange}
        urlValue={props.urlValue}
        byURLPlaceholder="http://..."
        byFileName="XMI File"
        handleFileUpload={props.handleFileUpload}
        nameFormat="XMI format"
        mode={props.selectedFormat}
        handleFormatChange={props.handleFormatChange}
        urlFormats={API.shExFormats}
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
  activeSource: API.defaultSource,
};

export default UMLTabs;
