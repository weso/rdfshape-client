import PropTypes from "prop-types";
import React, { useContext, useEffect } from "react";
import API from "../API";
import InputTabs from "../components/InputTabs";
import { ApplicationContext } from "../context/ApplicationContext";

function UMLTabs(props) {
  // Get UML and its setter from context
  const { umlData: ctxUml, setUmlData: setCtxUml } = useContext(
    ApplicationContext
  );

  // Change context when the contained UML changes
  useEffect(() => {
    setCtxUml(props.uml);
  }, [props.uml]);

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
  uml: PropTypes.object.isRequired,
  activeSource: PropTypes.string,
  handleTabChange: PropTypes.func.isRequired,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  setCodeMirror: PropTypes.func.isRequired,

  urlValue: PropTypes.string.isRequired,
  handleXmiUrlChange: PropTypes.func.isRequired,

  handleFileUpload: PropTypes.func.isRequired,
  selectedFormat: PropTypes.string.isRequired,

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
