import React, {Fragment, useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "../API";
import Form from "react-bootstrap/Form";
import axios from "axios";
import {dataParamsFromQueryParams} from "../utils/Utils";
import {mkPermalink, mkPermalinkLong, params2Form, Permalink} from "../Permalink";
import qs from "query-string";
import ShowSVG from "../svg/ShowSVG";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import {InitialData, mkDataTabs, paramsFromStateData, updateStateData} from "./Data";
import SelectFormat from "../components/SelectFormat";
import { convertDot } from './dotUtils'
import {ZoomInIcon, ZoomOutIcon} from "react-open-iconic-svg";
import ProgressBar from "react-bootstrap/ProgressBar";

function  DataVisualize(props) {

    const [data, setData] = useState(InitialData);
    const [params, setParams] = useState(null);
    const [lastParams, setLastParams] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);
    const [targetGraphFormat, setTargetGraphFormat] = useState('SVG');
    const [svg, setSVG] = useState(null);
    const [svgZoom,setSvgZoom] = useState(1);
    const [progressPercent,setProgressPercent] = useState(0);

    const url = API.dataConvert

    const minSvgZoom = 0.2
    const maxSvgZoom = 1.9
    const svgZoomStep = 0.1

    function handleTargetGraphFormatChange(value) {  setTargetGraphFormat(value);  }

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                const dataParams = {...dataParamsFromQueryParams(queryParams), targetDataFormat: 'dot'};

                setData(updateStateData(dataParams,data) || data);

                // Update text area correctly
                const codeMirror = document.querySelector('.react-codemirror2').firstChild.CodeMirror
                if (codeMirror) codeMirror.setValue(dataParams.data)

                setParams(dataParams)
                setLastParams(dataParams)

        }},
        [props.location.search
        ]
    );

    useEffect( () => {
        if (params && params.data){
            resetState()
            setUpHistory()
            postVisualize()
        }
    }, [params])

    function handleSubmit(event) {
        event.preventDefault();
        setParams({...paramsFromStateData(data), targetGraphFormat, targetDataFormat: targetGraphFormat});
    }

    function postVisualize(cb) {
        setLoading(true)
        const formData = params2Form(params);
        formData.append('targetDataFormat', 'dot'); // It converts to dot in the server
        setProgressPercent(20)
        axios.post(url,formData).then (response => response.data)
            .then(async data => {
                setProgressPercent(70)
                processData(data);
                setPermalink(await mkPermalink(API.dataVisualizeRoute, params));
                setProgressPercent(80)
                if (cb) cb()
                setProgressPercent(100)
            })
            .catch(function (error) {
                setError(`Error doing request to ${url}: ${error.message}`)
            })
            .finally( () => setLoading(false));
    }

    function processData(d, targetFormat) {
        convertDot(d.result,'dot','SVG', setLoading, setError, setSVG)
    }

    function zoomSvg(zoomIn) {
        if (zoomIn){
            const zoom = Math.min(maxSvgZoom, svgZoom + svgZoomStep)
            setSvgZoom(zoom)
        }
        else {
            const zoom = Math.max(minSvgZoom, svgZoom - svgZoomStep)
            setSvgZoom(zoom)
        }
    }

    function setUpHistory() {
        // Store the last search URL in the browser history to allow going back
        if (params && lastParams && JSON.stringify(params) !== JSON.stringify(lastParams)){
            // eslint-disable-next-line no-restricted-globals
            history.pushState(null, document.title, mkPermalinkLong(API.dataVisualizeRoute, lastParams))
        }
        // Change current url for shareable links
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, document.title ,mkPermalinkLong(API.dataVisualizeRoute, params))

        setLastParams(params)
    }

    function resetState() {
        setSVG(null)
        setSvgZoom(1)
        setPermalink(null)
        setError(null)
        setProgressPercent(0)
    }

     return (
       <Container fluid={true}>
           <Row>
            <h1>Visualize RDF data</h1>
           </Row>
           <Row>
            <Col className={"border-right"}>
             <Form className={"width-100"} onSubmit={handleSubmit}>
                 { mkDataTabs(data,setData)}
                 <SelectFormat name="Target graph format"
                               handleFormatChange={handleTargetGraphFormatChange}
                               urlFormats={API.dataVisualFormats}
                               selectedFormat={targetGraphFormat}
                 />
                <Button variant="primary" type="submit"
                        className={"btn-with-icon " + (loading ? "disabled" : "")} disabled={loading}>
                    Visualize</Button>
             </Form>
            </Col>
               { loading || error || svg ?
                   <Col style={{height: "70vh"}}>
                       <Fragment>
                           { permalink? <div className={"d-flex"}>
                               <Permalink url={permalink} />
                               <Button onClick={() => zoomSvg(false)} className="btn-zoom" variant="secondary"
                                       disabled={svgZoom <= minSvgZoom}>
                                   <ZoomOutIcon className="white-icon"/>
                               </Button>
                               <Button onClick={() => zoomSvg(true)} style={{marginLeft: "1px"}} className="btn-zoom" variant="secondary"
                                       disabled={svgZoom >= maxSvgZoom}>
                                   <ZoomInIcon className="white-icon"/>
                               </Button>
                           </div> : null }
                           { loading ? <ProgressBar striped animated variant="info" now={progressPercent}/> :
                               error ? <Alert variant='danger'>{error}</Alert> :
                                   svg && svg.svg ?
                                           <div style={{overflow: "auto", zoom: svgZoom}} className={"width-100 height-100 border"}>
                                               <ShowSVG svg={svg.svg}/>
                                           </div> : null
                           }
                       </Fragment>
                   </Col>   :
                   <Col>
                       <Alert variant='info'>Visualizations will appear here</Alert>
                   </Col>
               }
           </Row>
       </Container>
   );
}

export default DataVisualize;
