import React, {Fragment, useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import API from "../API";
import Form from "react-bootstrap/Form";
import axios from "axios";
// import SelectGraphFormat from "../utils/SelectGraphFormat.toDelete";
import {dataParamsFromQueryParams} from "../utils/Utils";
import {mkPermalink, params2Form, Permalink} from "../Permalink";
import qs from "query-string";
import ShowSVG from "../svg/ShowSVG";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pace from "react-pace-progress";
import Alert from "react-bootstrap/Alert";
import {InitialData, mkDataTabs, paramsFromStateData, updateStateData} from "./Data";
import SelectFormat from "../components/SelectFormat";
import { convertDot } from './dotUtils'

function  DataVisualize(props) {

    const [data, setData] = useState(InitialData);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permalink, setPermalink] = useState(null);
    const [targetGraphFormat, setTargetGraphFormat] = useState('SVG');
    const [svg, setSVG] = useState(null);

    function handleTargetGraphFormatChange(value) {  setTargetGraphFormat(value);  }

    useEffect(() => {
            if (props.location.search) {
                const queryParams = qs.parse(props.location.search);
                let params = dataParamsFromQueryParams(queryParams);
                params['targetDataFormat'] = 'dot'; // It converts to dot in the server
                mkPermalink(API.dataConvertRoute,params).then( link => setPermalink(link));
                postVisualize(API.dataConvert, params2Form(params), () => updateStateVisualize(params))
        }},
        [props.location.search
        ]
    );

    function updateStateVisualize(params) {
        console.log(`Update state visualize: ${JSON.stringify(params)}`)
        setData(updateStateData(params, data));
    }

    function processData(d, targetFormat) {
       console.log(`Process data: ${JSON.stringify(d)}`);
       convertDot(d.result,'dot','SVG', setLoading, setError, setSVG)
    }

    async function handleSubmit(event) {
        event.preventDefault();
        let params = paramsFromStateData(data);
        params['targetGraphFormat'] = targetGraphFormat;
        let formData = params2Form(params);
        const targetFormat = targetGraphFormat;
        formData.append('targetDataFormat', 'dot'); // It converts to dot in the server
        params['targetDataFormat'] = targetFormat; // But it keeps the original target format for permalink
        setLoading(true);
        setError(null);
        setPermalink(await mkPermalink(API.dataVisualizeRoute, params));
        postVisualize(API.dataConvert, formData)
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

     return (
       <Container fluid={true}>
         <h1>Visualize RDF data</h1>
           <Row> { loading || error || svg ?
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
             { mkDataTabs(data,setData)}
             <SelectFormat name="Target graph format"
                           handleFormatChange={handleTargetGraphFormatChange}
                           urlFormats={API.dataVisualFormats}
                           selectedFormat={targetGraphFormat}
             />
         <Button variant="primary" type="submit">Visualize</Button>
         </Form>
           </Col>
           </Row>
       </Container>
   );
}

export default DataVisualize;
