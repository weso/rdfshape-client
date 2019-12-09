import React, {useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import TurtleForm from '../data/TurtleForm'

function TestYate(props)  {
    const [options,setOptions] = useState({readOnly:false});
    const [turtle,setTurtle] = useState('');
    const [msg,setMsg] = useState('');

    return (
     <div>
       <h1>YATE example</h1>
       <TurtleForm id="turtleArea1"
                   value={turtle}
                   options={options}
                   onChange={(value) => setTurtle(value)}
       />
       <br/>
       <Button variant="primary"
                onClick={() => {
                setMsg(`TextArea value: \nShEx: ${turtle}\nOptions:${JSON.stringify(options)}\n`)
               }}
               type="submit">See Value</Button>
       <Button variant="secondary"
                 onClick={() => {
                     setOptions({...options, readOnly: !options.readOnly})
                 }}
                 type="submit">Change Reaonly Status</Button>

        <Alert variant="primary"><pre>{msg}</pre></Alert>
     </div>
    );
}

export default TestYate;

