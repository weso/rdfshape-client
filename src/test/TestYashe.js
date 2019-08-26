import React, {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import QueryForm from '../QueryForm'

function TestYashe(props)  {
    const [shEx,setShEx] = useState('');
    const [msg,setMsg] = useState('');

    return (
        <div>
            <h1>Yashe example</h1>
            <QueryForm id="textarea1"
                       onChange={(value) => setShEx(value)}
            />
            <br/>
            <Button variant="primary"
                    onClick={() => {
                        setMsg(`TextArea value: ${shEx}`)
                    }}
                    type="submit">See ShEx</Button>
            <Alert variant="primary">{msg}</Alert>
        </div>
    );
}

export default TestYashe;

