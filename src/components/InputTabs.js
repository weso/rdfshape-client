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
  const [activeTab, setActiveTab] = useState(props.activeTab);

  useEffect(() => {
    handleTabChange(props.activeTab);
  }, [props.activeTab]);

  function handleTabChange(e) {
    setActiveTab(e);
    props.handleTabChange(e);
  }

  return (
    <Form.Group>
      <Form.Label style={{ fontWeight: "bold" }}>{props.name}</Form.Label>
      <Tabs
        activeKey={activeTab}
        transition={false}
        id="dataTabs"
        onSelect={handleTabChange}
      >
        <Tab eventKey={API.byTextTab} title="by Input">
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
        <Tab eventKey={API.byUrlTab} title="By URL">
          <ByURL
            name={props.byURLName}
            urlValue={props.urlValue}
            handleUrlChange={props.handleUrlChange}
            placeholder={props.byURLPlaceholder}
          />
        </Tab>
        <Tab eventKey={API.byFileTab} title="By File">
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

  activeTab: PropTypes.string,
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
  activeTab: API.defaultTab,
  byTextName: "",
  byTextPlaceholder: "",
  byUrlName: "",
  byURLPlaceholder: "http://...",
  byFileName: "",
};

export default InputTabs;
