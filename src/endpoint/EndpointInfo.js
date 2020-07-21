import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import EndpointInput from "./EndpointInput";
import ResultEndpointInfo from "../results/ResultEndpointInfo";
import API from "../API";
import {mkPermalink, mkPermalinkLong, params2Form, Permalink} from "../Permalink";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import qs from "query-string";

function EndpointInfo(props) {
    const [endpoint, setEndpoint] = useState('')
    const [params, setParams] = useState(null)
    const [lastParams, setLastParams] = useState(null)
    const [result,setResult] = useState(null)
    const [error,setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);
    const [progressPercent,setProgressPercent] = useState(0);

    const infoUrl = API.endpointInfo;

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                if (queryParams.endpoint){
                    // Update form input with queried endpoint
                    setEndpoint(queryParams.endpoint)

                    // Update inner state and perform query
                    setParams({endpoint: queryParams.endpoint})
                    setLastParams({endpoint: queryParams.endpoint})
                }
                else {
                    setError("Could not parse URL data")
                }
            }},
        [props.location.search]
    );

    useEffect( () => {
        if (params){
            if (params.endpoint) {
                resetState()
                setUpHistory()
                postEndpointInfo()
            }
            else {
                setError("No endpoint provided")
            }
        }
    }, [params])

    function handleOnChange(value) {
        setEndpoint(value)
    }

    function handleOnSelect(){
        setLoading(false)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setParams({endpoint: endpoint.trim()})
    }

    function postEndpointInfo(){
        setLoading(true)
        setProgressPercent(20)
        const formData = params2Form(params)

        axios.post(infoUrl, formData)
            .then(response => response.data)
            .then( async (data) => {
                setProgressPercent(70)
                setResult(data)
                setPermalink(await mkPermalink(API.endpointInfoRoute, params));
                setProgressPercent(100)
            })
            .catch(function (error) {
                setError(`Error calling server at ${infoUrl}: ${error}.\n Did you input a valid SPARQL endpoint?`)
            })
            .finally( () => setLoading(false))
        ;
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.endpointInfoRoute, lastParams))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.endpointInfoRoute, params))

        setLastParams(params)
    }

    function resetState() {
        setResult(null)
        setPermalink(null)
        setError(null)
        setProgressPercent(0)
    }

    return (
        <Container fluid={true}>
            <h1>Endpoint Info</h1>
                <Form id="common-endpoints" onSubmit={handleSubmit}>
                    <EndpointInput
                        value={endpoint}
                        handleOnChange={handleOnChange}
                        handleOnSelect={handleOnSelect}
                    />
                    <Button variant="primary" type="submit"
                            className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                        Info about endpoint</Button>
                </Form>

            {loading || result || error || permalink ?
                <Row>
                    {loading ? <ProgressBar style={{width: '100%'}} striped animated variant="info" now={progressPercent}/> :
                        error ? <Alert style={{width: '100%'}} variant='danger'>{error}</Alert> :
                            result ?
                                <ResultEndpointInfo
                                    result={result}
                                    error={error}
                                    permalink={permalink}
                                /> : null
                    }
                </Row> : null
            }
        </Container>
    );
}

export default EndpointInfo;
