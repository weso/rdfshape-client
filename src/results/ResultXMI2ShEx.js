import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import API from "../API";
import Code from "../components/Code";
import { Permalink } from "../Permalink";
import PrintJson from "../utils/PrintJson";

function ResultXMI2ShEx(props) {
  const result = props.result;
  let msg;

  const [activeTab, setActiveTab] = useState(props.activeTab);

  function handleTabChange(e) {
    setActiveTab(e);
  }

  if (result === "") {
    msg = null;
  } else if (result.error || result.msg.toLowerCase().includes("error")) {
    msg = (
      <div>
        <Alert variant="danger">Invalid XMI schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
    );
  } else {
    console.log(result);
    msg = (
      <div>
        <Alert variant="success">Conversion successful</Alert>

        <Tabs
          activeKey={activeTab}
          transition={false}
          id="dataTabs"
          onSelect={handleTabChange}
        >
          <Tab eventKey={API.xmiTab} title="ShEx">
            {result.result && (
              <Code
                value={result.result}
                mode={props.mode}
                onChange={function(val) {
                  return val;
                }}
              />
            )}
            <details>
              <PrintJson json={result} />
            </details>
          </Tab>
          <Tab eventKey={API.umlTab} title="ShEx Graph">
            <div
              id="grafoshex"
              style={{
                width: "100%",
                height: "650px",
                border: "double black",
                marginTop: "1em",
              }}
            ></div>
            <details id="jsongrafo">
              <PrintJson json={result.grafico} />
            </details>
          </Tab>
        </Tabs>
        {props.permalink && (
          <Fragment>
            <hr />
            <Permalink url={props.permalink} disabled={props.disabled} />
          </Fragment>
        )}
      </div>
    );
  }

  return <div>{msg}</div>;
}

ResultXMI2ShEx.propTypes = {
  result: PropTypes.object,
  mode: PropTypes.string,
};

export default ResultXMI2ShEx;
