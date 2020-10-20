import React, {Fragment, useState} from 'react'
import PropTypes from "prop-types"
import PrintJson from "../utils/PrintJson"
import Code from "../components/Code"
import {Permalink} from "../Permalink"
import Alert from "react-bootstrap/Alert";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import API from '../API'

function ResultShEx2XMI(props) {
  const result = props.result
  let msg
  
  const [activeTab, setActiveTab] = useState(props.activeTab)

    function handleTabChange(e) {
        setActiveTab(e)
    }

  if (result === "") {
    msg = null
  }
  else if (result.error || result.msg.toLowerCase().includes("error")) {
    msg =
      <div>
        <Alert variant="danger">Invalid ShEx schema</Alert>
        <ul>
          <li className="word-break">{result.error || result.msg}</li>
        </ul>
      </div>
  }
  else {
    msg =
    <div>
	  <Tabs activeKey={activeTab}
                  transition={false}
                  id="dataTabs"
                  onSelect={handleTabChange}
            >
			<Tab eventKey={API.xmiTab} title="XMI">
                    { result.result && <Code value={result.result} mode={props.mode}/> }
					<details><PrintJson json={result} /></details>
                </Tab>
                <Tab eventKey={API.umlTab} title="UML Diagram">
                    <a href={result.grafico}><img src={result.grafico} alt="UML Class Diagram" width="100%" style={{cursor: "zoom-in"}}/> </a>
                </Tab>
      
	   </Tabs>
      { props.permalink &&
      <Fragment>
        <hr/>
        <Permalink url={props.permalink}/>
      </Fragment>
      }
	  <Alert variant="success">Conversion successful</Alert>
    </div>
  }

  return (
    <div>{msg}</div>
  )
}

ResultShEx2XMI.propTypes = {
  result: PropTypes.object,
  mode: PropTypes.string
}

export default ResultShEx2XMI
