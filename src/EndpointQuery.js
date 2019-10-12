import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointInput from "./EndpointInput";
import QueryTabs from "./QueryTabs";
import API from "./API";
import axios from "axios";
import {mkPermalink, params2Form} from "./Permalink";
import ResultEndpointQuery from "./results/ResultEndpointQuery";
import {convertTabQuery} from "./Utils"

function EndpointQuery(props) {
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const [endpoint, setEndpoint] = useState('');

    const [queryTextArea, setQueryTextArea] = useState('');
    const [queryUrl, setQueryUrl] = useState('');
    const [queryFile, setQueryFile] = useState('');
    const [queryActiveTab, setQueryActiveTab] = useState('ByText');
    const [permalink, setPermalink] = useState(null);

    function handleTabChangeQuery(value) {
        setQueryActiveTab(value)
    }

    function handleByTextChangeQuery(value) {
        setQueryTextArea(value)
    }

    function handleUrlChangeQuery(value) {
        setQueryUrl(value)
    }

    function handleFileUploadQuery(value) {
        setQueryFile(value)
    }

    function handleSubmit(event) {
        const infoUrl = API.endpointQuery;
        let params = {};
        params['endpoint'] = endpoint;
        params['activeTab'] = convertTabQuery(queryActiveTab);
        switch (queryActiveTab) {
            case API.byTextTab:
                params['query'] = queryTextArea;
                break;
            case API.byUrlTab:
                params['queryURL'] = queryUrl;
                break;
            case API.byFileTab:
                params['queryFile'] = queryFile;
                break;
            default:
                console.log(`Unknown value for ${queryActiveTab}`)
        }
        let formData = params2Form(params);
        let pl = mkPermalink(API.endpointQueryRoute, params);
        axios.post(infoUrl, formData)
            .then(response => response.data)
            .then((data) => {
                setResult(data);
                setPermalink(pl)
            })
            .catch(function (error) {
                const msg = `Error doing server request at ${infoUrl}: ${error}`;
                console.log(msg);
                setError(msg);
            })
        ;
        event.preventDefault();
    }

    function handleEndpointChange(value) {
        setEndpoint(value);
    }

    return (
        <Container fluid={true}>
            <h1>Endpoint query</h1>
            <ResultEndpointQuery
                result={result}
                error={error}
                permalink={permalink}
            />
            <Form onSubmit={handleSubmit}>
                <EndpointInput value={endpoint}
                               handleOnChange={handleEndpointChange}/>
                <QueryTabs activeTab={queryActiveTab}
                           handleTabChange={handleTabChangeQuery}

                           textAreaValue={queryTextArea}
                           handleByTextChange={handleByTextChangeQuery}

                           urlValue={queryUrl}
                           handleDataUrlChange={handleUrlChangeQuery}

                           handleFileUpload={handleFileUploadQuery}
                />
                <Button variant="primary"
                        type="submit">Query endpoint</Button>
            </Form>
        </Container>
    )
}

export default EndpointQuery;
