import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from "../API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
// import DataTabs from "./DataTabs";
import ResultDataInfo from "../results/ResultDataInfo";
import qs from 'query-string';
import { mkPermalink, mkPermalinkLong, params2Form, Permalink} from "../Permalink";
import {dataParamsFromQueryParams} from "../utils/Utils";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {InitialData, paramsFromStateData, updateStateData, mkDataTabs} from "./Data";
import ProgressBar from "react-bootstrap/ProgressBar";

function DataInfo(props) {

    const [data, setData] = useState(InitialData);
    const [params, setParams] = useState(null);
    const [lastParams, setLastParams] = useState(null);
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);
    const [progressPercent,setProgressPercent] = useState(0);

    const url = API.dataInfo

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let dataParams = dataParamsFromQueryParams(queryParams);

            setData(updateStateData(dataParams,data) || data);
            // Update text area correctly
            const codeMirror = document.querySelector('.react-codemirror2').firstChild.CodeMirror
            if (codeMirror) codeMirror.setValue(dataParams.data)

            setParams(dataParams)
            setLastParams(dataParams)
        }},
        [props.location.search]
    );

    useEffect( () => {
        if (params){
            resetState()
            setUpHistory()
            postDataInfo()
        }
    }, [params])


    async function handleSubmit(event) {
        event.preventDefault();
        setParams(paramsFromStateData(data))
    }

    function postDataInfo(cb) {
        setLoading(true)
        setProgressPercent(20)
        const formData = params2Form(params)

        axios.post(url,formData).then (response => response.data)
            .then(async data => {
                setProgressPercent(70)
                setResult(data);
                setPermalink(await mkPermalink(API.dataInfoRoute, params));
                setProgressPercent(80)
                if (cb) cb()
                setProgressPercent(100)
            })
            .catch(function (error) {
                setError("Error calling server at " + url + ": " + error);
            })
            .finally( () => setLoading(false));
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.dataInfoRoute, lastParams))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.dataInfoRoute, params))

        setLastParams(params)
    }

    function resetState() {
        setResult(null)
        setParams(null)
        setPermalink(null)
        setError(null)
        setProgressPercent(0)
    }

    return (
       <Container fluid={true}>
        <Row>
            <h1>RDF Data info</h1>
        </Row>
        <Row>
            <Col className={"border-right"}>
                <Form onSubmit={handleSubmit}>
                    { mkDataTabs(data,setData) }
                    <Button id="submit" variant="primary" type="submit"
                            className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                        Info about data</Button>
                </Form>
            </Col>
           { loading || result || permalink ?
               <Fragment>
                   <Col>
                       {loading ? <ProgressBar striped animated variant="info" now={progressPercent}/> :
                        error? <Alert variant='danger'>{error}</Alert> :
                        result ?
                            <ResultDataInfo
                                result={result}
                                fromParams={data.fromParams}
                                resetFromParams={() => setData({ ...data, fromParams: false})}
                            /> : null
                       }
                       { permalink? <Permalink url={permalink} />: null }
                   </Col>
               </Fragment>
             : <Col>
                   <Alert variant='info'>Validation results will appear here</Alert>
               </Col>
           }
       </Row>
       </Container>
     );
}

export default DataInfo;
