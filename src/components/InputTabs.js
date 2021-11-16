import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import API from "../API";
import ByFile from "./ByFile";
import ByText from "./ByText";
import ByURL from "./ByURL";

function InputTabs(props) {
  const [activeSource, setActiveSource] = useState(props.activeSource);

  useEffect(() => {
    handleTabChange(props.activeSource);
  }, [props.activeSource]);

  function handleTabChange(e) {
    setActiveSource(e);
    props.handleTabChange(e);
  }

  return (
    <Form.Group>
      <Form.Label style={{ fontWeight: "bold" }}>{props.name}</Form.Label>
      <Tabs
        activeKey={activeSource}
        transition={false}
        id="dataTabs"
        onSelect={handleTabChange}
      >
        <Tab eventKey={API.sources.byText} title="Text">
          <ByText
            name={props.byTextName}
            textAreaValue={props.textAreaValue}
            placeholder={props.byTextPlaceholder}
            handleByTextChange={props.handleByTextChange}
            textFormat={props.textFormat}
            setCodeMirror={props.setCodeMirror}
            fromParams={props.fromParams}
            resetFromParams={props.resetFromParams}
          />
        </Tab>
        <Tab eventKey={API.sources.byUrl} title="URL">
          <ByURL
            name={props.byURLName}
            urlValue={props.urlValue}
            handleUrlChange={props.handleUrlChange}
            placeholder={props.byURLPlaceholder}
          />
        </Tab>
        <Tab eventKey={API.sources.byFile} title="File">
          <ByFile
            name={props.byFileName}
            handleFileUpload={props.handleFileUpload}
          />
        </Tab>
      </Tabs>
    </Form.Group>
  );
}

InputTabs.propTypes = {
  name: PropTypes.string.isRequired,

  /** Specific text input form that can be provided to replace the default one */
  inputForm: PropTypes.node,

  /** Callback to get a handler of the codeMirror instance */
  setCodeMirror: PropTypes.func,

  activeSource: PropTypes.string,
  handleTabChange: PropTypes.func.isRequired,
  byTextName: PropTypes.string,
  textFormat: PropTypes.string,
  textAreaValue: PropTypes.string,
  handleByTextChange: PropTypes.func.isRequired,
  byTextPlaceholder: PropTypes.string,
  byUrlName: PropTypes.string.isRequired,
  urlValue: PropTypes.string.isRequired,
  handleUrlChange: PropTypes.func.isRequired,
  byURLPlaceholder: PropTypes.string,
  byFileName: PropTypes.string,
  handleFileUpload: PropTypes.func.isRequired,

  resetFromParams: PropTypes.func.isRequired,
  fromParams: PropTypes.bool.isRequired,
};

InputTabs.defaultProps = {
  activeSource: API.sources.default,
  byTextName: "",
  byTextPlaceholder: "",
  byUrlName: "",
  byURLPlaceholder: "http://...",
  byFileName: "",
};

export default InputTabs;
