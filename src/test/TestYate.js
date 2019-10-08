import React, {useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import TurtleForm from '../TurtleForm'
import Form from "react-bootstrap/Form";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function TestYate(props)  {
    const [turtle,setTurtle] = useState('');
    const [msg,setMsg] = useState('');

    return (
     <div>
       <h1>YATE example</h1>
       <TurtleForm id="turtleArea1"
                      value={turtle}
                      onChange={(value) => setTurtle(value)}
                  />
       <br/>
       <Button variant="primary"
                onClick={() => {
                setMsg(`TextArea value: \nShEx: ${turtle}\n`)
               }}
               type="submit">See Value</Button>
        <Alert variant="primary"><pre>{msg}</pre></Alert>
     </div>
    );
}

export default TestYate;

