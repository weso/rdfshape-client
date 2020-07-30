import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import API from "../API";
import axios from "axios";
import SelectFormat from "../components/SelectFormat";
import ResultDataConvert from "../results/ResultDataConvert";
import {dataParamsFromQueryParams} from "../utils/Utils";
import qs from "query-string";
import {mkPermalink, mkPermalinkLong, params2Form, Permalink} from "../Permalink";
import {InitialData, paramsFromStateData, updateStateData, mkDataTabs} from "./Data";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";

function DataConvert(props) {
    const [result, setResult] = useState('');
    const [params, setParams] = useState(null);
    const [lastParams, setLastParams] = useState(null);
    const [permalink, setPermalink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [data,setData] = useState(InitialData);
    const [targetDataFormat, setTargetDataFormat] = useState(API.defaultDataFormat);
    const [progressPercent,setProgressPercent] = useState(0);

    const url = API.dataConvert;

    function handleTargetDataFormatChange(value) { setTargetDataFormat(value); }

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            if (queryParams.data){
                const dataParams = {...dataParamsFromQueryParams(queryParams), targetDataFormat: queryParams.targetDataFormat};

                setData(updateStateData(dataParams,data) || data);

                // Update text area correctly
                const codeMirrorElement = document.querySelector('.react-codemirror2').firstChild
                if (codeMirrorElement && codeMirrorElement.CodeMirror)
                    codeMirrorElement.CodeMirror.setValue(dataParams.data)

                setParams(dataParams)
                setLastParams(dataParams)
            }
            else {
                setError("Could not parse URL data")
            }
        }
    },
     [props.location.search]
   );

    useEffect( () => {
        if (params){
            if (params.data) {
                resetState()
                setUpHistory()
                postConvert()
            }
            else {
                setError("No RDF data provided")
            }
            window.scrollTo(0, 0)
        }
    }, [params])

    function handleSubmit(event) {
        event.preventDefault();
        setParams({...paramsFromStateData(data), targetDataFormat})
    }

    function postConvert(cb) {
        setLoading(true)
        setProgressPercent(20)
        let formData = params2Form(params);

        axios.post(url,formData).then (response => response.data)
            .then(async data => {
                setProgressPercent(70)
                setResult(data)
                setPermalink(await mkPermalink(API.dataConvertRoute, params));
                setProgressPercent(80)
                if (cb) cb()
                setProgressPercent(100)
            })
            .catch(function (error) {
                setError(error);
            })
            .finally( () => setLoading(false));
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.dataConvertRoute, lastParams))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.dataConvertRoute, params))

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
         <h1>Convert RDF data</h1>
       </Row>
       <Row>
           <Col className={"half-col border-right"}>
               <Form onSubmit={handleSubmit}>
                   { mkDataTabs(data,setData, "RDF input") }
                   <hr/>
                   <SelectFormat name="Target data format"
                                 selectedFormat={targetDataFormat}
                                 handleFormatChange={handleTargetDataFormatChange}
                                 urlFormats={API.dataFormatsOutput}
                   />
                   <Button variant="primary" type="submit"
                           className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                       Convert data</Button>
               </Form>
           </Col>
           { loading || result || error || permalink ?
             <Col className={"half-col"}>
                 {  loading ? <ProgressBar striped animated variant="info" now={progressPercent}/> :
                    error? <Alert variant='danger'>{error}</Alert> :
                    result ?  <ResultDataConvert
                            result={result}
                            permalink={permalink}
                        /> :
                    null
                 }
             </Col>
                 : <Col className={"half-col"}>
                     <Alert variant='info'>Conversion results will appear here</Alert>
                 </Col>
             }
       </Row>
       </Container>
 );
}

export default DataConvert;
