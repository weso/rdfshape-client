import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointInput from "./EndpointInput";
import ResultEndpointInfo from "./results/ResultEndpointInfo";
import API from "./API";
import {mkPermalink, params2Form} from "./Permalink";
import axios from "axios";

function EndpointInfo(props) {
    const [endpoint, setEndpoint] = useState('')
    const [result,setResult] = useState(null)
    const [permalink,setPermalink] = useState(null)
    const [error,setError] = useState('')

    function handleOnChange(value) {
        setEndpoint(value)
    }

    function handleSubmit(event) {
        const infoUrl = API.endpointInfo;
        let params = {};
        params['endpoint'] = endpoint;
        let formData = params2Form(params);
        let permalink = mkPermalink(API.endpointInfoRoute, params);
        axios.post(infoUrl,formData)
            .then (response => response.data)
            .then((data) => {
                setResult(data);
                setPermalink(permalink);
            })
            .catch(function (error) {
                const msg = `Error invoking ${infoUrl}: ${JSON.stringify(error,null,2)}`
                setError(msg);
                console.log(msg);
            })
            ;
        event.preventDefault();
    }

    return (
        <Container fluid={true}>
            <h1>Endpoint info</h1>
            <ResultEndpointInfo
                result={result}
                error={error}
                permalink={permalink}
            />
            <Form onSubmit={handleSubmit}>
                <EndpointInput
                    value={endpoint}
                    handleOnChange={handleOnChange}
                />
                <Button variant="primary"
                        type="submit">Info about endpoint</Button>
            </Form>
        </Container>
    );
}

export default EndpointInfo;
