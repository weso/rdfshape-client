import React, {useState, useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import QueryForm from '../QueryForm'

function TestYasqe(props)  {
    const [query,setQuery] = useState('');
    const [msg,setMsg] = useState('');

    return (
        <div>
            <h1>Yasqe example</h1>
            <QueryForm id="textarea1"
                       onChange={(value) => setQuery(value)}
            />
            <br/>
            <Button variant="primary"
                    onClick={() => {
                        setMsg(`TextArea value: ${query}`)
                    }}
                    type="submit">See query</Button>
            <Alert variant="primary">{msg}</Alert>
        </div>
    );
}

export default TestYasqe;
