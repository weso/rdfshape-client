import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { mkPermalink, params2Form, Permalink } from "./Permalink";
import API from "./API";
import Pace from "react-pace-progress";
import ResultValidate from "./results/ResultValidate";
import Form from "react-bootstrap/Form";
import QueryTabs from "./QueryTabs";
import Button from "react-bootstrap/Button";
import {convertTabQuery} from "./Utils";
import axios from "axios";
import ResultEndpointQuery from "./results/ResultEndpointQuery";

function WikidataQuery(props) {
    const [result, setResult] = useState('');
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);

    const [queryTextArea, setQueryTextArea] = useState('');
    const [queryUrl, setQueryUrl] = useState('');
    const [queryFile, setQueryFile] = useState('');
    const [queryActiveTab, setQueryActiveTab] = useState('ByText');
    const serverUrl = API.endpointQuery ;

    function queryParams() {
        let params = {} ;
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
                console.log(`Unknown value queryActiveTab: ${queryActiveTab}`)
        }
        return params ;
    }

    function formParams() {
        let params = {} ;
        return params ;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const permalinkParams = queryParams();
        let serviceParams = permalinkParams ;
        serviceParams['endpoint'] = API.wikidataUrl ;
        let permalink = mkPermalink(API.wikidataQueryRoute, permalinkParams);
        setLoading(true);
        postProcess(serverUrl, serviceParams, permalink);
    }

    function postProcess(url, params, permalink) {
        axios.post(url, params)
            .then(response => response.data)
            .then((data) => {
                setResult(data);
                setPermalink(permalink)
            })
            .catch(function (error) {
                const msg = `Error doing server request at ${serverUrl}: ${error}`;
                console.log(msg);
                setLoading(false);
                setError(msg);
            })
        ;
    }

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

    return (
       <Container>
         <h1>Query Wikidata</h1>
         <Row>
             { result || loading || error ?
             <Col>
                 {loading ? <Pace color="#27ae60"/> :
                     error? <Alert variant="danger">{error}</Alert> :
                     result ?
                         <ResultEndpointQuery result={result} /> : null
                 }
                 { permalink &&  <Permalink url={permalink} /> }
             </Col> : null
             }
             <Col>
                 <Form onSubmit={handleSubmit}>
                     <QueryTabs activeTab={queryActiveTab}
                                handleTabChange={handleTabChangeQuery}

                                textAreaValue={queryTextArea}
                                handleByTextChange={handleByTextChangeQuery}

                                urlValue={queryUrl}
                                handleDataUrlChange={handleUrlChangeQuery}

                                handleFileUpload={handleFileUploadQuery}
                     />
                     <Button variant="primary"
                             type="submit">Query wikidata</Button>
                 </Form>
             </Col>
         </Row>
       </Container>
     );
}

export default WikidataQuery;
