import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ShExForm from '../ShExForm'
import QueryForm from '../QueryForm'
import Form from "react-bootstrap/Form";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import qs from "query-string";
import {dataParamsFromQueryParams, shapeMapParamsFromQueryParams, shExParamsFromQueryParams} from "../Utils";
import {params2Form} from "../Permalink";

function TestYashe(props)  {
    const [shEx,setShEx] = useState('');
    const [sparql,setSparql] = useState('');
    const [msg,setMsg] = useState('');
    const [activeTab, setActiveTab] = useState('ShEx');
    const [yashe, setYashe] = useState(null);
    const [fromParams, setFromParams] = useState(false);

    useEffect( () => {
            console.log(`TestYashe... `)
            if (props.location.search) {
                console.log(`TestYashe with location.search `)
                const queryParams = qs.parse(props.location.search);
                console.log("Parameters: " + JSON.stringify(queryParams));
                if (queryParams['shex']) {
                    setShEx(queryParams['shex']);
                    setFromParams(true);
                    console.log(`Setting parameter shex=${shEx}`);
                }
            }
        },
        [props.location.search]
    );


    function handleTabChange(e) {
        setActiveTab(e)
    }


    return (
     <div>
       <h1>Yashe example</h1>
{/*
       <QueryForm id="sparqlArea1"
                      value={sparql} 
                      onChange={(value) => setSparql(value)}
                  />
*/}
       <Form.Group>
           <Form.Label>Select input</Form.Label>
            <Tabs activeKey={activeTab}
                  id="testYasheTabs"
                  onSelect={k => setActiveTab(k)}
            >
                <Tab eventKey="ShEx" title="ShEx">
                <Form.Group>
                 <Form.Label>ShEx</Form.Label>
                 <ShExForm // id="shExArea" 
                      value={shEx} 
                      onChange={(value) => {
                          setShEx(value);
//                          if (yashe) {
//                              yashe.setValue(value);
//                              yashe.refresh();
//                          }
                      }}
                      setCodeMirror={(cm) => setYashe(cm)}
                      fromParams={fromParams}
                      resetFromParams={() => setFromParams(false) }
                 />
                </Form.Group>
                </Tab>
                <Tab eventKey="Sparql" title="SPARQL">
                 <Form.Group>
                  <Form.Label>SPARQL</Form.Label>
                  <QueryForm id="sparqlArea" 
                      value={sparql} 
                      onChange={(value) => setSparql(value)}
                  />
                </Form.Group>
                </Tab>
            </Tabs>    
            <br/>
            <p>ActiveTab: {activeTab}</p>
            <pre>ShEx: {shEx}</pre>
            <pre>Yashe: {typeof yashe}</pre>
           <Button variant="primary"
                    onClick={() => {
                        setMsg(`TextArea value: \nShEx: ${shEx}\nSPARQL: ${sparql}`)
                    }}
                    type="submit">See Value</Button>
           <Button variant="primary"
                   onClick={() => {
                       setShEx(`prefix : <http://example.org/>\n<S> { \n  :p . \n}`)
                       setFromParams(true);
                   }}
                   type="submit">Reset ShEx</Button>
            <Alert variant="primary"><pre>{msg}</pre></Alert>
        </Form.Group>

        </div>
    );
}

export default TestYashe;

