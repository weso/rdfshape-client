import React, {useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ShExForm from '../ShExForm'
import QueryForm from '../QueryForm'
import Form from "react-bootstrap/Form";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function TestYashe(props)  {
    const [shEx,setShEx] = useState('');
    const [sparql,setSparql] = useState('');
    const [msg,setMsg] = useState('');
    const [activeTab, setActiveTab] = useState('ShEx')

    function handleTabChange(e) {
        setActiveTab(e)
    }


    return (
     <div>
       <h1>Yashe example</h1>
       <QueryForm id="sparqlArea1" 
                      value={sparql} 
                      onChange={(value) => setSparql(value)}
                  />
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
                      onChange={(value) => setShEx(value)}
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
            <Button variant="primary"
                    onClick={() => {
                        setMsg(`TextArea value: \nShEx: ${shEx}\nSPARQL: ${sparql}`)
                    }}
                    type="submit">See Value</Button>
            <Alert variant="primary"><pre>{msg}</pre></Alert>
        </Form.Group>

        </div>
    );
}

export default TestYashe;

