import React, {Fragment, useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "../API";
import Form from "react-bootstrap/Form";
import axios from "axios";
import {
    InitialQuery,
    paramsFromStateQuery,
    mkQueryTabs,
    updateStateQuery,
    queryParamsFromQueryParams
} from "../query/Query";
import {mkPermalink, mkPermalinkLong, params2Form, Permalink} from "../Permalink";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import {InitialData, mkDataTabs, paramsFromStateData, updateStateData} from "./Data";
import qs from "query-string";
import {dataParamsFromQueryParams} from "../utils/Utils";
import ResultEndpointQuery from "../results/ResultEndpointQuery";
import ProgressBar from "react-bootstrap/ProgressBar";


function DataQuery(props)  {
    const [data, setData] = useState(InitialData);
    const [params, setParams] = useState(null);
    const [lastParams, setLastParams] = useState(null);
    const [result,setResult] = useState(null);
    const [query, setQuery] = useState(InitialQuery);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState('');
    const [progressPercent,setProgressPercent] = useState(0);

    const url = API.dataQuery

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                if (queryParams.data && queryParams.query) {
                    const dataParams = {...dataParamsFromQueryParams(queryParams), ...queryParamsFromQueryParams(queryParams)};
                    setData(updateStateData(dataParams, data) || data);
                    setQuery(updateStateQuery(dataParams, query) || query);

                    // Update text areas correctly
                    const codemirrors = document.querySelectorAll('.react-codemirror2')
                    if (codemirrors.length > 0) {
                        if (codemirrors[0]){
                            const cm = codemirrors[0].firstChild.CodeMirror
                            if (cm) cm.setValue(queryParams.data)
                        }
                        if (codemirrors[1]){
                            const cm = codemirrors[1].firstChild.CodeMirror
                            if (cm) cm.setValue(queryParams.query)
                        }
                    }

                    setParams(dataParams)
                    setLastParams(dataParams)
                }
                else {
                    setError("Could not parse URL data")
                }
            }},
        [props.location.search]
    );

    useEffect( () => {
        if (params){
            if (params.data && params.query){
                resetState()
                setUpHistory()
                postQuery()
            }
            else if (!params.data) {
                setError("No RDF data provided")
            }
            else if (!params.query) {
                setError("No query provided")
            }
            window.scrollTo(0, 0)
        }
    }, [params])

    async function handleSubmit(event) {
        event.preventDefault();
        setParams({...paramsFromStateData(data), ...paramsFromStateQuery(query)})
    }

    function postQuery(cb) {
        setLoading(true);
        const formData = params2Form(params);
        setProgressPercent(20)
        axios.post(url,formData).then (response => response.data)
            .then(async data => {
                setProgressPercent(70)
                if (data.error) setError(data.error)
                setResult({ result: data })
                setProgressPercent(80)
                setPermalink(await mkPermalink(API.dataQueryRoute, params));
                if (cb) cb();
                setProgressPercent(100)
            })
            .catch(function (error) {
                setError(error.message);
            })
            .finally( () => {
                setLoading(false)
                window.scrollTo(0, 0)
            });
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.dataQueryRoute, lastParams))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.dataQueryRoute, params))

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
                <Row>
                    <h1>Data Query</h1>
                </Row>
                <Row>
                    <Col className={"border-right"}>
                        <Form onSubmit={handleSubmit}>
                            { mkDataTabs(data, setData) }
                            { mkQueryTabs(query, setQuery) }
                            <hr/>
                            <Button variant="primary" type="submit"
                                    className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                                Query</Button>
                        </Form>
                    </Col>
                    { loading || result || error ?
                        <Col>
                            <Fragment>
                                <Col>
                                    { loading? <ProgressBar striped animated variant="info" now={progressPercent}/> :
                                        error? <Alert variant='danger'>{error}</Alert> :
                                       result?
                                           <ResultEndpointQuery
                                               result={result}
                                               error={error}
                                               />: null
                                    }
                                    { permalink && !error? <Permalink url={permalink} />: null }
                                </Col>
                            </Fragment>
                        </Col> :
                        <Col>
                            <Alert variant='info'>Query results will appear here</Alert>
                        </Col>
                    }
                </Row>
            </Container>
        );
}

export default DataQuery;
