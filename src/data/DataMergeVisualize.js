import React, {useState, useEffect, Fragment} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from "../API";
import axios from 'axios';
import Form from "react-bootstrap/Form";
// import DataTabs from "./DataTabs";
import qs from 'query-string';
import { mkPermalink, params2Form, Permalink} from "../Permalink";
import {dataParamsFromQueryParams} from "../utils/Utils";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Row from "react-bootstrap/Row";
import {InitialData, paramsFromStateData, updateStateData, mkDataTabs} from "./Data";
import {convertDot} from "./dotUtils";
import ShowSVG from "../svg/ShowSVG";

function DataMergeVisualize(props) {

    const [data1, setData1] = useState(InitialData);
    const [data2, setData2] = useState(InitialData);
    const [targetDataFormat, setTargetDataFormat] = useState(API.defaultDataFormat);
    const [result,setResult] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);
    const [svg, setSVG] = useState(null);

    function handleTargetDataFormatChange(value) { setTargetDataFormat(value); }

    useEffect(() => {
        if (props.location.search) {
            const queryParams = qs.parse(props.location.search);
            let dataParams = dataParamsFromQueryParams(queryParams);
            // params['targetDataFormat']=queryParams.targetDataFormat;
            // const infoUrl = API.dataInfo + "?" + qs.stringify(dataParams);
            postVisualize(API.dataConvert, params2Form(dataParams), () => {
                const newData1 = updateStateData(dataParams,data1) || data1 ;
                const newData2 = updateStateData(dataParams,data2) || data2 ;
                setData1(newData1);
                setData2(newData2);
            });
        }},
        [props.location.search]
    );

    function mergeParams(params1,params2) {
        return {"compoundData": JSON.stringify([params1, params2]) };
    }

    function processData(d, targetFormat) {
        console.log(`Process data: ${JSON.stringify(d)}`);
        convertDot(d.result,'dot','SVG', setLoading, setError, setSVG)
    }


    async function handleSubmit(event) {
        event.preventDefault();
        let params1 = paramsFromStateData(data1);
        let params2 = paramsFromStateData(data2);
        console.log(`params1: ${JSON.stringify(params1)}`);
        console.log(`params2: ${JSON.stringify(params2)}`);
        let params = mergeParams(params1, params2);
        params['targetDataFormat'] = 'dot'; // It converts to dot in the server
        let formData = params2Form(params);
        console.log(`formData: ${JSON.stringify(formData)}`);
        console.log("Permalink created: " + JSON.stringify(permalink));
        setLoading(true);
        setPermalink(await mkPermalink(API.dataInfoRoute, formData));
        postVisualize(API.dataConvert, formData);
    }

    function postVisualize(url, formData, cb) {
        console.log(`POSTVisualize: ${url}`)
        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                console.log(`POSTVisualize, data returned: ${JSON.stringify(data)}`)
                processData(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError(`Error doing request to ${url}: ${error.message}`)
            });
    }

/*    function postMerge(url,formData,cb) {

        axios.post(url,formData).then (response => response.data)
            .then((data) => {
                setLoading(false);
                setError(null);
                setResult(data);
                if (cb) cb()
            })
            .catch(function (error) {
                setLoading(false);
                setError("Error calling server at " + url + ": " + error);
            });
    } */

    return (
       <Container fluid={true}>
        <Row>
        <h1>Merge & visualize RDF data</h1>
        </Row>
        <Row>
          { loading || error || svg ?
                <Fragment>
                    { loading ? <Pace color="#27ae60"/> :
                        error ? <Alert variant='danger'>{error}</Alert> :
                            svg && svg.svg ?
                                <Col>
                                    <ShowSVG svg={svg.svg}/>
                                    { permalink? <Permalink url={permalink} /> : null }
                                </Col> : null
                    }
                </Fragment> :
                null
          }
         <Col>
         <Form onSubmit={handleSubmit}>
             { mkDataTabs(data1,setData1) }
             { mkDataTabs(data2,setData2) }
         <Button id="submit" variant="primary" type="submit">Merge & visualize</Button>
         </Form>
       </Col>
       </Row>
       </Container>
     );
}

export default DataMergeVisualize;
