import React, {useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import QueryForm from '../QueryForm'

function TestYasqe()  {
    const [query,setQuery] = useState('');
    const [msg,setMsg] = useState('');

    return (
        <div>
            <h1>Yasqe example</h1>
            <QueryForm id="textarea1"
                       value={query}
                       onChange={(value) => setQuery(value)}
                       placeholder="select ..."
            />
            <br/>
            <Button variant="primary"
                    onClick={() => {
                        setMsg(`Query: ${query}`)
                    }}
                    type="submit">See query</Button>
            { msg && <div><pre>{msg}</pre></div> }
        </div>
    );
}

export default TestYasqe;
