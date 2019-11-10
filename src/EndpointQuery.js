import React, {Fragment, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointInput from "./EndpointInput";
import QueryTabs from "./QueryTabs";
import API from "./API";
import axios from "axios";
import {mkPermalink, params2Form} from "./Permalink";
import ResultEndpointQuery from "./results/ResultEndpointQuery";
import {InitialQuery, paramsFromStateQuery} from "./Utils"
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";

function EndpointQuery(props) {
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const [endpoint, setEndpoint] = useState('');

    const [query, setQuery] = useState(InitialQuery);

    const [permalink, setPermalink] = useState(null);

    function handleQueryTabChange(value) { setQuery({...query, queryActiveTab: value}); }
    function handleQueryByTextChange(value) { setQuery({...query, queryTextArea: value}); }
    function handleQueryUrlChange(value) { setQuery( {...query, queryUrl: value}); }
    function handleQueryFileUpload(value) { setQuery({...query, queryFile: value }); }

    function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateQuery(query);
        params['endpoint'] = endpoint;
        let formData = params2Form(params);
        setPermalink(mkPermalink(API.endpointQueryRoute, params));
        postQuery(API.endpointQuery, formData)
    }

    function postQuery(url,formData,cb) {
        setLoading(true);
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                setResult({ result: data })
                if (cb) cb();
            })
            .catch(function (error) {
                setLoading(false);
                setError(error.message);
            });
    }

    function handleEndpointChange(value) {
        setEndpoint(value);
    }

    return (
        <Container fluid={true}>
            <h1>Endpoint query</h1>
            <Row>
            { loading || result || permalink ?
                <Fragment>
                    <Col>
                        {loading ? <Pace color="#27ae60"/> :
                            error? <Alert variant='danger'>{error}</Alert> :
                                result ? <ResultEndpointQuery result={result} error={error} permalink={permalink} />: null }
                    </Col>
                </Fragment> : null }
            <Col>
            <Form onSubmit={handleSubmit}>
                <EndpointInput value={endpoint}
                               handleOnChange={handleEndpointChange}/>
                <QueryTabs activeTab={query.queryActiveTab}
                           handleTabChange={handleQueryTabChange}

                           textAreaValue={query.queryTextArea}
                           handleByTextChange={handleQueryByTextChange}

                           urlValue={query.queryUrl}
                           handleDataUrlChange={handleQueryUrlChange}

                           handleFileUpload={handleQueryFileUpload}
                />
                <Button variant="primary"
                        type="submit">Query endpoint</Button>
            </Form>
        </Col>
        </Row>
        </Container>
    )
}

export default EndpointQuery;
